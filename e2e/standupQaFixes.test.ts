import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, expectAfterBackend, visitorHeading } from './support/auth.ts'
import {
  START_TEXT,
  chatDialog,
  createTodayStandup,
  fulfillSse,
  launchDaily,
  messageInput,
  mockConversation,
  quitConfirm,
  sendButton,
  signInNewMarc,
  todoHeading,
  tokens,
} from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

const FIRST_REPLY = 'Merci Marc. As-tu rencontré des blocages hier ?'

test('P2-08 : session expirée pendant la conversation, message dédié et accueil visiteur', async ({ page, request }) => {
  await mockConversation(page, [
    (route) => fulfillSse(route, tokens(FIRST_REPLY)),
    (route) => route.fulfill({ status: 401, headers: { 'Access-Control-Allow-Origin': route.request().headers()['origin'] ?? '', 'Access-Control-Allow-Credentials': 'true' } }),
  ])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
  await launchDaily(page, START_TEXT)
  await expect(chatDialog(page).getByText(FIRST_REPLY)).toBeVisible()
  await page.context().clearCookies()

  await messageInput(page).fill('Pas de blocage.')
  await sendButton(page).click()

  await expect(page.getByText('Ta session a expiré. Reconnecte-toi pour renseigner ton daily.')).toBeVisible()
  await expect(page.getByText('Le serveur ne répond pas. Réessaie dans un instant.')).toHaveCount(0)
  await expect(chatDialog(page)).toHaveCount(0)
  await expectAfterBackend(visitorHeading(page)).toBeVisible()
})

test('P2-10 : après un long message, le fil descend jusqu’à la réponse de l’IA', async ({ page, request }) => {
  await page.setViewportSize({ width: 375, height: 700 })
  await mockConversation(page, [(route) => fulfillSse(route, tokens(FIRST_REPLY))])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()

  await launchDaily(page, 'Migration de l’authentification terminée. '.repeat(120))

  const reply = chatDialog(page).getByText(FIRST_REPLY)
  await expect(reply).toBeVisible()
  await expect(reply).toBeInViewport()
})

test('P2-12 : bouton retour en pleine conversation, la confirmation s’ouvre et la conversation reste', async ({
  page,
  request,
}) => {
  await mockConversation(page, [(route) => fulfillSse(route, tokens(FIRST_REPLY))])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
  await launchDaily(page, START_TEXT)
  await expect(chatDialog(page).getByText(FIRST_REPLY)).toBeVisible()

  await page.goBack()

  await expect(quitConfirm(page)).toBeVisible()
  await expect(page).toHaveURL('/')
  await expect(chatDialog(page).getByText(FIRST_REPLY)).toBeAttached()
})

test('P2-09 : à 375 px, le calendrier s’ouvre sur la semaine en cours', async ({ page, request }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await signInNewMarc(page, request)
  await createTodayStandup(page)

  await page.goto('/')

  const todaySquare = page.getByRole('button', { name: /^Voir le daily du / })
  await expectAfterBackend(todaySquare).toBeVisible()
  // Seul le défilement vertical est fait ici : le carré du jour doit déjà être visible sans faire défiler la grille.
  await page.getByText('Daily enregistré', { exact: true }).scrollIntoViewIfNeeded()
  await expect(todaySquare).toBeInViewport()
})
