import { expect, test, type Page } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  SIGNIN_URL,
  SIGNUP_URL,
  connectedHeading,
  countPosts,
  createAccount,
  expectAfterBackend,
  newMarcAccount,
  uniqueEmail,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

// 2 soumissions dans le même instant, plus rapides qu'un double-clic : React n'a pas le temps de griser le bouton entre les 2.
const submitTwiceAtOnce = (page: Page) =>
  page.locator('form').evaluate((form) => {
    const submittable = form as unknown as { requestSubmit: () => void }
    submittable.requestSubmit()
    submittable.requestSubmit()
  })

test('signup soumis 2 fois dans le même instant, une seule requête', async ({ page }) => {
  const signupPosts = countPosts(page, SIGNUP_URL)
  await page.goto('/signup')
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('motdepasse123')

  await submitTwiceAtOnce(page)

  await expectAfterBackend(connectedHeading(page, 'Marc')).toBeVisible()
  expect(signupPosts()).toBe(1)
})

test('signin soumis 2 fois dans le même instant, une seule requête', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  const signinPosts = countPosts(page, SIGNIN_URL)
  await page.goto('/signin')
  await page.getByLabel('Email', { exact: true }).fill(marc.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)

  await submitTwiceAtOnce(page)

  await expectAfterBackend(connectedHeading(page, 'Marc')).toBeVisible()
  expect(signinPosts()).toBe(1)
})
