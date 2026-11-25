import { expect, test } from '@playwright/test'
import { SIGNUP_URL, connectedHeading, countPosts, holdPost, toasts, uniqueEmail } from './support/auth.ts'

const EMAIL_ERROR = 'Renseigne un email valide.'
const PASSWORD_ERROR = 'Ton mot de passe doit contenir au moins 8 caractères.'

test.beforeEach(async ({ page }) => {
  await page.goto('/signup')
})

test('SM-6 : signup invalide, erreurs à la soumission puis mises à jour à la saisie (RM30)', async ({ page }) => {
  const signupPosts = countPosts(page, SIGNUP_URL)
  const firstName = page.getByLabel('Prénom*')
  const email = page.getByLabel('Email*')
  const password = page.getByLabel('Mot de passe*')

  await firstName.fill('Marc')
  await email.fill('marc')
  await password.fill('abc')

  await expect(page.getByText(EMAIL_ERROR)).toHaveCount(0)
  await expect(page.getByText(PASSWORD_ERROR)).toHaveCount(0)
  for (const field of [firstName, email, password]) await expect(field).not.toHaveAttribute('aria-invalid', 'true')

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toHaveAccessibleDescription(EMAIL_ERROR)
  await expect(password).toHaveAttribute('aria-invalid', 'true')
  await expect(password).toHaveAccessibleDescription(PASSWORD_ERROR)
  await expect(firstName).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Renseigne ton prénom.')).toHaveCount(0)
  await expect(page).toHaveURL('/signup')
  expect(signupPosts()).toBe(0)

  await password.press('End')
  await password.pressSequentially('defgh')

  await expect(password).toHaveValue('abcdefgh')
  await expect(password).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText(PASSWORD_ERROR)).toHaveCount(0)
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toHaveAccessibleDescription(EMAIL_ERROR)
  expect(signupPosts()).toBe(0)
})

test('SM-8 : signup en cours, bouton désactivé avec spinner (RM17, signup)', async ({ page }) => {
  const releaseSignup = await holdPost(page, SIGNUP_URL)
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('motdepasse123')

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  const pendingButton = page.getByRole('button', { name: 'Création du compte en cours' })
  await expect(pendingButton).toBeVisible()
  await expect(pendingButton).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Créer un compte' })).toHaveCount(0)

  releaseSignup()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
})

test('SM-10 : signup réussi, retour à l\'accueil connecté (RM8)', async ({ page }) => {
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('motdepasse123')

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
})

test('SM-20 : prénom contenant du HTML, rendu en texte brut (RM23)', async ({ page }) => {
  await page.getByLabel('Prénom*').fill('<b>Marc</b>')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('motdepasse123')

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, '<b>Marc</b>')).toBeVisible()
  await expect(toasts(page).getByText('Bienvenue <b>Marc</b>, ton compte est créé.', { exact: true })).toBeVisible()
})
