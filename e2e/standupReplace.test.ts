import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, countPosts, expectAfterBackend } from './support/auth.ts'
import {
  CONVERSATION_URL,
  START_TEXT,
  chatDialog,
  createTodayStandup,
  doneHeading,
  launchDaily,
  replaceConfirm,
  signInNewMarc,
} from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

test('SM-16 : standup déjà fait, « Annuler » ne démarre rien (CA9)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await createTodayStandup(page)
  await page.goto('/')
  await expectAfterBackend(doneHeading(page)).toBeVisible()
  const conversationPosts = countPosts(page, CONVERSATION_URL)
  await launchDaily(page, START_TEXT)
  await expect(replaceConfirm(page)).toBeVisible()

  await replaceConfirm(page).getByRole('button', { name: 'Annuler' }).click()

  await expect(replaceConfirm(page)).toHaveCount(0)
  await expect(chatDialog(page)).toHaveCount(0)
  await expect(doneHeading(page)).toBeVisible()
  expect(conversationPosts()).toBe(0)
})
