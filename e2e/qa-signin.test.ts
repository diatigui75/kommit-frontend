import { expect, test } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  SIGNIN_URL,
  countPosts,
  createAccount,
  expectAfterBackend,
  newMarcAccount,
  type Account,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

let marc: Account

test.beforeAll(async ({ request }) => {
  marc = newMarcAccount()
  await createAccount(request, marc)
})

test.beforeEach(async ({ page }) => {
  await page.goto('/signin')
})

test('QA-5 : bouton « Me connecter » grisé tant qu\'un champ est vide, aucune requête (RM32)', async ({ page }) => {
  const signinPosts = countPosts(page, SIGNIN_URL)
  const submit = page.getByRole('button', { name: 'Me connecter' })

  await expect(submit).toBeDisabled()

  await page.getByLabel('Email', { exact: true }).fill(marc.email)

  await expect(submit).toBeDisabled()

  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)

  await expect(submit).toBeEnabled()
  expect(signinPosts()).toBe(0)
})

test('QA-6 : mauvais mot de passe, message générique sans champ désigné (RM13)', async ({ page }) => {
  const email = page.getByLabel('Email', { exact: true })
  const password = page.getByLabel('Mot de passe', { exact: true })
  await email.fill(marc.email)
  await password.fill('mauvaismotdepasse')

  await page.getByRole('button', { name: 'Me connecter' }).click()

  await expectAfterBackend(page.getByText('Email ou mot de passe incorrect.')).toBeVisible()
  await expect(page).toHaveURL('/signin')
  await expect(email).not.toHaveAttribute('aria-invalid', 'true')
  await expect(password).not.toHaveAttribute('aria-invalid', 'true')
})
