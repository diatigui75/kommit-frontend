// Le code passé à page.evaluate et addInitScript s'exécute dans le navigateur : types DOM activés pour ce fichier.
/// <reference lib="dom" />
import { expect, test } from '@playwright/test'
import { countPosts, expectAfterBackend, holdPost } from './support/auth.ts'
import {
  CONVERSATION_URL,
  LLM_TEST_TIMEOUT,
  START_TEXT,
  chatDialog,
  expectAfterLlm,
  expectTurnEnded,
  launchDaily,
  messageInput,
  nextConversationTurn,
  sendButton,
  signInNewMarc,
  textAfter,
  todoHeading,
  waitingIndicator,
} from './support/standup.ts'

// Chaque scénario attend au moins une vraie réponse de Groq.
test.describe.configure({ timeout: LLM_TEST_TIMEOUT })

test.beforeEach(async ({ page, request }) => {
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
})

test('SM-4 : le texte de l\'accueil ouvre la conversation (CA2)', async ({ page }) => {
  const conversationRequest = page.waitForRequest(
    (request) => request.url() === CONVERSATION_URL && request.method() === 'POST',
  )
  const firstReply = nextConversationTurn(page)

  await launchDaily(page, START_TEXT)

  await expect(chatDialog(page)).toBeVisible()
  await expect(chatDialog(page).getByText(START_TEXT, { exact: true })).toBeVisible()
  expect((await conversationRequest).postDataJSON()).toEqual({ messages: [{ role: 'user', content: START_TEXT }] })
  await expectTurnEnded(page, firstReply)
  expect(await textAfter(page, START_TEXT), "réponse de l'IA sous le message").not.toBe('')
})

test('SM-5 : indicateur d\'attente puis réponse au fil de l\'eau (CA4, CA34)', async ({ page }) => {
  // Remplace le backend « tout juste redémarré » : la requête est retenue pour que l'attente reste observable.
  const releaseConversation = await holdPost(page, CONVERSATION_URL)
  // Relève chaque état successif du fil : une réponse qui s'allonge par morceaux en laisse plusieurs.
  await page.evaluate(() => {
    const lengths: number[] = []
    Object.assign(window, { threadLengths: lengths })
    new MutationObserver(() => {
      const thread = document.querySelector('[role="dialog"]')?.textContent ?? ''
      if (!thread.includes("L'assistant écrit…") && lengths.at(-1) !== thread.length) lengths.push(thread.length)
    }).observe(document.body, { childList: true, subtree: true, characterData: true })
  })
  const firstReply = nextConversationTurn(page)

  await launchDaily(page, START_TEXT)

  await expect(waitingIndicator(page)).toBeVisible()
  releaseConversation()
  await expectAfterLlm(waitingIndicator(page)).toHaveCount(0)
  await expectTurnEnded(page, firstReply)
  expect(await textAfter(page, START_TEXT), "réponse de l'IA sous le message").not.toBe('')
  const threadLengths = await page.evaluate(() => (window as unknown as { threadLengths: number[] }).threadLengths)
  // Au moins un état intermédiaire entre le fil sans réponse et la réponse complète.
  expect(new Set(threadLengths).size, `longueurs successives du fil : ${threadLengths.join(', ')}`).toBeGreaterThanOrEqual(3)
})

test('SM-6 : envoi bloqué pendant que l\'IA écrit (CA40)', async ({ page }) => {
  const firstReply = nextConversationTurn(page)
  await launchDaily(page, START_TEXT)
  await expectTurnEnded(page, firstReply)
  // Remplace le profil « Slow 3G » : le 2e tour est retenu, l'IA reste « en train d'écrire » pendant les vérifications.
  const releaseConversation = await holdPost(page, CONVERSATION_URL)
  const conversationPosts = countPosts(page, CONVERSATION_URL)
  const secondReply = nextConversationTurn(page)
  await messageInput(page).fill("J'ai aussi relu une PR.")
  await sendButton(page).click()

  await messageInput(page).fill("Et j'ai fait un point avec l'équipe.")
  await expect(sendButton(page)).toBeDisabled()
  await messageInput(page).press('Enter')

  await expect(chatDialog(page).getByText("Et j'ai fait un point avec l'équipe.")).toHaveCount(0)
  await expect(messageInput(page)).toHaveValue("Et j'ai fait un point avec l'équipe.")
  releaseConversation()
  await expectTurnEnded(page, secondReply)
  await expect(sendButton(page)).toBeEnabled()
  expect(conversationPosts()).toBe(1)
})
