import { expect, test, type Page } from '@playwright/test'
import { countPosts, expectAfterBackend } from './support/auth.ts'
import {
  LLM_TEST_TIMEOUT,
  STANDUPS_URL,
  START_TEXT,
  TODAY_URL,
  chatDialog,
  counter,
  expectTurnEnded,
  launchDaily,
  nextConversationTurn,
  quitConfirm,
  reachSummary,
  signInNewMarc,
  textAfter,
  todoHeading,
} from './support/standup.ts'

// La conversation à fermer contient au moins une vraie réponse de Groq.
test.describe.configure({ timeout: LLM_TEST_TIMEOUT })

test.beforeEach(async ({ page, request }) => {
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
})

// Précondition de SM-11 à SM-13 : modale ouverte après SM-4, texte de départ et 1re réponse de l'IA affichés.
async function openConversationWithFirstReply(page: Page): Promise<string> {
  const firstReply = nextConversationTurn(page)
  await launchDaily(page, START_TEXT)
  await expectTurnEnded(page, firstReply)

  return textAfter(page, START_TEXT)
}

// Derrière la confirmation, la conversation reste à l'écran : vérifiée par son texte, la modale étant masquée de l'arbre d'accessibilité.
async function expectConfirmOverConversation(page: Page) {
  await expect(quitConfirm(page)).toBeVisible()
  await expect(
    quitConfirm(page).getByText(
      "En quittant cette conversation, tout l'échange sera définitivement perdu. Es-tu sûr de vouloir quitter ?",
    ),
  ).toBeVisible()
  await expect(quitConfirm(page).getByRole('button', { name: 'Poursuivre le daily' })).toBeVisible()
  await expect(quitConfirm(page).getByRole('button', { name: 'Quitter le daily' })).toBeVisible()
  await expect(page.getByText('Daily Standup Assistant')).toBeVisible()
  await expect(page.getByText(START_TEXT, { exact: true })).toBeVisible()
}

test('SM-11 : fermeture par la croix, confirmation puis reprise (CA7)', async ({ page }) => {
  const firstReply = await openConversationWithFirstReply(page)

  await chatDialog(page).getByRole('button', { name: 'Fermer la conversation' }).click()

  await expectConfirmOverConversation(page)

  await quitConfirm(page).getByRole('button', { name: 'Poursuivre le daily' }).click()

  await expect(quitConfirm(page)).toHaveCount(0)
  await expect(chatDialog(page)).toBeVisible()
  await expect(chatDialog(page).getByText(START_TEXT, { exact: true })).toBeVisible()
  expect(await textAfter(page, START_TEXT)).toBe(firstReply)
})

test('SM-12 : fermeture par Échap, confirmation puis reprise (CA7)', async ({ page }) => {
  const firstReply = await openConversationWithFirstReply(page)

  await page.keyboard.press('Escape')

  await expectConfirmOverConversation(page)

  await quitConfirm(page).getByRole('button', { name: 'Poursuivre le daily' }).click()

  await expect(quitConfirm(page)).toHaveCount(0)
  await expect(chatDialog(page)).toBeVisible()
  expect(await textAfter(page, START_TEXT)).toBe(firstReply)
})

test('SM-13 : fermeture par clic sur le voile, confirmation puis abandon (CA7)', async ({ page }) => {
  await expect(counter(page, 0)).toBeVisible()
  await openConversationWithFirstReply(page)
  const standupPosts = countPosts(page, STANDUPS_URL)

  // Le voile n'a pas de libellé : il est désigné par sa position, le coin en haut à gauche de la page (smoke).
  await page.mouse.click(5, 5)

  await expectConfirmOverConversation(page)

  await quitConfirm(page).getByRole('button', { name: 'Quitter le daily' }).click()

  await expect(quitConfirm(page)).toHaveCount(0)
  await expect(chatDialog(page)).toHaveCount(0)
  await expect(todoHeading(page)).toBeVisible()
  await expect(counter(page, 0)).toBeVisible()
  expect(standupPosts()).toBe(0)
})

test('SM-14 : récap reçu mais non validé, la fermeture demande confirmation (CA44)', async ({ page }) => {
  await expect(counter(page, 0)).toBeVisible()
  await reachSummary(page)
  const standupPosts = countPosts(page, STANDUPS_URL)

  await page.keyboard.press('Escape')

  await expect(quitConfirm(page)).toBeVisible()

  await quitConfirm(page).getByRole('button', { name: 'Quitter le daily' }).click()

  await expect(chatDialog(page)).toHaveCount(0)
  await expect(todoHeading(page)).toBeVisible()
  await expect(counter(page, 0)).toBeVisible()
  expect(standupPosts()).toBe(0)
  const today = await page.request.get(TODAY_URL)
  expect(await today.json()).toMatchObject({ done: false, standup: null })
})
