import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, SIGNIN_URL, countPosts, expectAfterBackend } from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

test('QA-7 : signin avec un email mal formé, requête envoyée et message générique du serveur (RM10, RM13)', async ({ page }) => {
  const signinPosts = countPosts(page, SIGNIN_URL)
  await page.goto('/signin')
  const email = page.getByLabel('Email', { exact: true })
  const password = page.getByLabel('Mot de passe', { exact: true })
  await email.fill('pas-un-email')
  await password.fill('court')

  await page.getByRole('button', { name: 'Me connecter' }).click()

  await expectAfterBackend(page.getByText('Email ou mot de passe incorrect.')).toBeVisible()
  expect(signinPosts()).toBe(1)
  await expect(page).toHaveURL('/signin')
  await expect(email).not.toHaveAttribute('aria-invalid', 'true')
  await expect(password).not.toHaveAttribute('aria-invalid', 'true')
})
