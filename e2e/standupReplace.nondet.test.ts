import { expect, test } from '@playwright/test'
import { countPosts, expectAfterBackend } from './support/auth.ts'
import {
  CONVERSATION_URL,
  LLM_TEST_TIMEOUT,
  OLD_SUMMARY,
  STANDUPS_URL,
  START_TEXT,
  TODAY_URL,
  chatDialog,
  counter,
  createTodayStandup,
  doneHeading,
  expectTurnEnded,
  launchDaily,
  nextConversationTurn,
  quitConfirm,
  replaceConfirm,
  signInNewMarc,
  textAfter,
} from './support/standup.ts'

// « Refaire mon daily » démarre une vraie conversation avec Groq.
test.describe.configure({ timeout: LLM_TEST_TIMEOUT })

test.beforeEach(async ({ page, request }) => {
  await signInNewMarc(page, request)
  await createTodayStandup(page)
  await page.goto('/')
  await expectAfterBackend(doneHeading(page)).toBeVisible()
})

test('SM-15 : standup déjà fait, alerte de remplacement puis nouvelle conversation (CA9)', async ({ page }) => {
  const conversationPosts = countPosts(page, CONVERSATION_URL)

  await launchDaily(page, START_TEXT)

  await expect(replaceConfirm(page)).toBeVisible()
  await expect(
    replaceConfirm(page).getByText("En le refaisant, le nouveau daily remplacera l'existant une fois validé."),
  ).toBeVisible()
  await expect(replaceConfirm(page).getByRole('button', { name: 'Annuler' })).toBeVisible()
  await expect(replaceConfirm(page).getByRole('button', { name: 'Refaire mon daily' })).toBeVisible()
  await expect(chatDialog(page)).toHaveCount(0)
  expect(conversationPosts()).toBe(0)
  const firstReply = nextConversationTurn(page)

  await replaceConfirm(page).getByRole('button', { name: 'Refaire mon daily' }).click()

  await expect(replaceConfirm(page)).toHaveCount(0)
  await expect(chatDialog(page)).toBeVisible()
  await expect(chatDialog(page).getByText(START_TEXT, { exact: true })).toBeVisible()
  await expectTurnEnded(page, firstReply)
  expect(await textAfter(page, START_TEXT), "réponse de l'IA sous le message").not.toBe('')
})

test('SM-17 : refaire puis quitter sans valider, l\'ancien standup reste intact (CA41)', async ({ page }) => {
  await expect(counter(page, 1)).toBeVisible()
  const standupPosts = countPosts(page, STANDUPS_URL)
  await launchDaily(page, START_TEXT)
  const firstReply = nextConversationTurn(page)
  await replaceConfirm(page).getByRole('button', { name: 'Refaire mon daily' }).click()
  await expectTurnEnded(page, firstReply)
  await chatDialog(page).getByRole('button', { name: 'Fermer la conversation' }).click()

  await quitConfirm(page).getByRole('button', { name: 'Quitter le daily' }).click()

  await expect(chatDialog(page)).toHaveCount(0)
  await expect(doneHeading(page)).toBeVisible()
  await expect(counter(page, 1)).toBeVisible()
  expect(standupPosts()).toBe(0)

  const today = await page.request.get(TODAY_URL)

  expect(await today.json()).toMatchObject({ done: true, standup: { summary: { fait: OLD_SUMMARY.fait } } })
})
