import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, expectAfterBackend } from './support/auth.ts'
import {
  START_TEXT,
  chatDialog,
  fulfillSse,
  launchDaily,
  messageInput,
  mockConversation,
  sendButton,
  signInNewMarc,
  todoHeading,
  tokens,
  validateButton,
  waitingIndicator,
} from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

const FIRST_REPLY = "Merci Marc. As-tu autre chose à ajouter sur ta journée d'hier ?"
const RETRY_REPLY = "Noté pour la PR. Y a-t-il un blocage dont tu voudrais parler ?"
const PR_MESSAGE = "J'ai aussi relu une PR."

// Le backend n'est pas arrêté depuis le test : le 2e tour est coupé par le navigateur, comme un serveur qui tombe.
test('SM-18 : backend coupé pendant que l\'IA écrit, message et « Réessayer » (CA29, CA31, CA32)', async ({
  page,
  request,
}) => {
  let releaseRetry: () => void = () => undefined
  const retryReleased = new Promise<void>((resolve) => {
    releaseRetry = resolve
  })
  await mockConversation(page, [
    (route) => fulfillSse(route, tokens(FIRST_REPLY)),
    (route) => route.abort('connectionreset'),
    async (route) => {
      await retryReleased
      await fulfillSse(route, tokens(RETRY_REPLY))
    },
  ])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
  await launchDaily(page, START_TEXT)
  await expect(chatDialog(page).getByText(FIRST_REPLY)).toBeVisible()
  await messageInput(page).fill(PR_MESSAGE)

  await sendButton(page).click()

  const outage = chatDialog(page).getByRole('alert')
  await expect(outage).toContainText('Le serveur ne répond pas. Réessaie dans un instant.')
  await expect(outage.getByRole('button', { name: 'Réessayer' })).toBeVisible()
  await expect(chatDialog(page).getByText(START_TEXT, { exact: true })).toBeVisible()
  await expect(chatDialog(page).getByText(FIRST_REPLY, { exact: true })).toBeVisible()
  await expect(chatDialog(page).getByText(PR_MESSAGE, { exact: true })).toBeVisible()
  await expect(validateButton(page)).toHaveCount(0)

  await outage.getByRole('button', { name: 'Réessayer' }).click()

  await expect(chatDialog(page).getByRole('alert')).toHaveCount(0)
  await expect(waitingIndicator(page)).toBeVisible()
  releaseRetry()
  await expect(chatDialog(page).getByText(RETRY_REPLY, { exact: true })).toBeVisible()
  await expect(chatDialog(page).getByText(PR_MESSAGE, { exact: true })).toHaveCount(1)
})
