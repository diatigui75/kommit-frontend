import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, expectAfterBackend } from './support/auth.ts'
import {
  START_TEXT,
  STANDUPS_URL,
  chatDialog,
  dailyInput,
  fulfillSse,
  launchButton,
  launchDaily,
  messageInput,
  mockConversation,
  sendButton,
  signInNewMarc,
  summaryIntro,
  todoHeading,
  tokens,
  validateButton,
} from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

const FIRST_REPLY = "Merci Marc. As-tu un blocage aujourd'hui ?"
const SUMMARY = { fait: ['Terminé la page de connexion'], blocages: [], prevu: ['Commencer le calendrier'] }

test('QA-1 : zone vide ou faite d\'espaces, envoi désactivé sur l\'accueil et dans la modale (CA39)', async ({
  page,
  request,
}) => {
  await mockConversation(page, [(route) => fulfillSse(route, tokens(FIRST_REPLY))])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()

  await expect(launchButton(page)).toBeDisabled()
  await dailyInput(page).fill('     ')
  await expect(launchButton(page)).toBeDisabled()
  await expect(chatDialog(page)).toHaveCount(0)

  await launchDaily(page, START_TEXT)
  await expect(chatDialog(page).getByText(FIRST_REPLY, { exact: true })).toBeVisible()
  await messageInput(page).fill('   ')

  await expect(sendButton(page)).toBeDisabled()
})

test('QA-2 : erreur SSE LLM_QUOTA_EXCEEDED, message et « Réessayer » sans perdre le fil (CA29, CA31)', async ({
  page,
  request,
}) => {
  const quotaMessage = 'Quota du fournisseur IA atteint, réessaie plus tard.'
  await mockConversation(page, [
    (route) =>
      fulfillSse(route, [
        ...tokens('Merci'),
        { type: 'error', error: { code: 'LLM_QUOTA_EXCEEDED', message: quotaMessage } },
      ]),
  ])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()

  await launchDaily(page, START_TEXT)

  const alert = chatDialog(page).getByRole('alert')
  await expect(alert).toBeVisible()
  await expect(alert.getByRole('button', { name: 'Réessayer' })).toBeVisible()
  await expect(chatDialog(page).getByText(START_TEXT, { exact: true })).toBeVisible()
})

test('QA-3 : erreur SSE SUMMARY_MALFORMED, « Valider » jamais actif (CA32)', async ({ page, request }) => {
  await mockConversation(page, [
    (route) =>
      fulfillSse(route, [
        ...tokens('Voici ton récap.'),
        { type: 'error', error: { code: 'SUMMARY_MALFORMED', message: 'Le résumé produit est invalide.' } },
      ]),
  ])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()

  await launchDaily(page, START_TEXT)

  await expect(chatDialog(page).getByRole('alert')).toBeVisible()
  await expect(validateButton(page).and(page.locator(':enabled'))).toHaveCount(0)
})

test('QA-4 : « Valider » reposte le récap reçu tel quel, sans date ni nouvel appel à l\'IA (CA26)', async ({
  page,
  request,
}) => {
  let conversationCalls = 0
  page.on('request', (sent) => {
    if (sent.url().endsWith('/standups/conversation')) conversationCalls += 1
  })
  await mockConversation(page, [
    (route) => fulfillSse(route, [...tokens('Merci, voici ton récap.'), { type: 'summary', summary: SUMMARY }]),
  ])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
  await launchDaily(page, START_TEXT)
  await expect(summaryIntro(page)).toBeVisible()
  const postStandup = page.waitForRequest((sent) => sent.url() === STANDUPS_URL && sent.method() === 'POST')

  await validateButton(page).click()

  expect((await postStandup).postDataJSON()).toEqual({ summary: SUMMARY })
  await expectAfterBackend(chatDialog(page)).toHaveCount(0)
  expect(conversationCalls).toBe(1)
})
