import { expect, test, type Route } from '@playwright/test'
import { SIGNIN_URL, connectedHeading, countPosts, createAccount, holdPost, newMarcAccount, type Account } from './support/auth.ts'

const OUTAGE_MESSAGE = 'Le serveur ne répond pas. Réessaie dans un instant.'

let marc: Account

test.beforeAll(async ({ request }) => {
  marc = newMarcAccount()
  await createAccount(request, marc)
})

test.beforeEach(async ({ page }) => {
  await page.goto('/signin')
})

test('SM-7 : signin en cours, bouton désactivé avec spinner (RM17, signin)', async ({ page }) => {
  const releaseSignin = await holdPost(page, SIGNIN_URL)
  await page.getByLabel('Email', { exact: true }).fill(marc.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)

  await page.getByRole('button', { name: 'Me connecter' }).click()

  const pendingButton = page.getByRole('button', { name: 'Connexion en cours' })
  await expect(pendingButton).toBeVisible()
  await expect(pendingButton).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Me connecter' })).toHaveCount(0)

  releaseSignin()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
})

test('SM-9 : double-clic sur « Me connecter », une seule requête (RM16)', async ({ page }) => {
  const signinPosts = countPosts(page, SIGNIN_URL)
  await page.getByLabel('Email', { exact: true }).fill(marc.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)

  await page.getByRole('button', { name: 'Me connecter' }).dblclick()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  expect(signinPosts()).toBe(1)
})

test('SM-11 : signin réussi, retour à l\'accueil connecté (RM12)', async ({ page }) => {
  await page.getByLabel('Email', { exact: true }).fill(marc.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)

  await page.getByRole('button', { name: 'Me connecter' }).click()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
})

test('SM-19 : backend coupé, message de panne et action re-tentable (RM18, RM19)', async ({ page }) => {
  // Backend « coupé » pour ce test seul : la requête de signin échoue au niveau réseau, comme un serveur arrêté.
  // La 2e tentative est retenue avant l'échec, pour voir le spinner revenir.
  let attempts = 0
  let releaseRetry: () => void = () => undefined
  const retryReleased = new Promise<void>((resolve) => {
    releaseRetry = resolve
  })
  await page.route(SIGNIN_URL, async (route: Route) => {
    if (route.request().method() !== 'POST') return route.fallback()

    attempts += 1
    if (attempts > 1) await retryReleased
    await route.abort('connectionrefused')
  })
  const email = page.getByLabel('Email', { exact: true })
  const password = page.getByLabel('Mot de passe', { exact: true })
  const submit = page.getByRole('button', { name: 'Me connecter' })
  await email.fill('marc@test.dev')
  await password.fill('motdepasse123')

  await submit.click()

  await expect(page.getByRole('alert')).toHaveText(OUTAGE_MESSAGE)
  await expect(page.getByText('Email ou mot de passe incorrect.')).toHaveCount(0)
  await expect(email).not.toHaveAttribute('aria-invalid', 'true')
  await expect(password).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page).toHaveURL('/signin')
  await expect(email).toHaveValue('marc@test.dev')
  await expect(password).toHaveValue('motdepasse123')
  await expect(submit).toBeEnabled()

  await submit.click()

  await expect(page.getByRole('button', { name: 'Connexion en cours' })).toBeDisabled()
  releaseRetry()
  await expect(submit).toBeEnabled()
  await expect(page.getByText(OUTAGE_MESSAGE)).toHaveCount(1)
  expect(attempts).toBe(2)
})
