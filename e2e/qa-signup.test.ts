import { expect, test } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  SIGNUP_URL,
  countPosts,
  createAccount,
  expectAfterBackend,
  newMarcAccount,
  uniqueEmail,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

const EMAIL_TAKEN = /Un compte avec cet email existe déjà/

test.beforeEach(async ({ page }) => {
  await page.goto('/signup')
})

test('QA-1 : bouton « Créer un compte » grisé tant qu\'un champ requis est vide, prénom d\'espaces compris (RM33, RM11, RM20)', async ({ page }) => {
  const signupPosts = countPosts(page, SIGNUP_URL)
  const submit = page.getByRole('button', { name: 'Créer un compte' })

  await expect(submit).toBeDisabled()

  await page.getByLabel('Prénom*').fill('   ')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('motdepasse123')

  await expect(submit).toBeDisabled()

  await page.getByLabel('Prénom*').fill('Marc')

  await expect(submit).toBeEnabled()

  await page.getByLabel('Mot de passe*').fill('')

  await expect(submit).toBeDisabled()
  expect(signupPosts()).toBe(0)
})

test('QA-2 : email déjà utilisé, message sous le champ Email (RM9)', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(marc.email)
  await page.getByLabel('Mot de passe*').fill(marc.password)

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expectAfterBackend(page.getByLabel('Email*')).toHaveAccessibleDescription(EMAIL_TAKEN)
  await expect(page).toHaveURL('/signup')
})

test('QA-3 : email existant saisi en majuscules et entouré d\'espaces, refusé (RM21)', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(`  ${marc.email.toUpperCase()}  `)
  await page.getByLabel('Mot de passe*').fill(marc.password)

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expectAfterBackend(page.getByLabel('Email*')).toHaveAccessibleDescription(EMAIL_TAKEN)
  await expect(page).toHaveURL('/signup')
})

test('QA-4 : mot de passe de plus de 128 caractères, refusé (RM10)', async ({ page }) => {
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('a'.repeat(129))

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expectAfterBackend(page.getByText(/au plus 128 caractères/)).toBeVisible()
  await expect(page).toHaveURL('/signup')
})
