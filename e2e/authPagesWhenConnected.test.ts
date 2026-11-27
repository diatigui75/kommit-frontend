import { expect, test } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  connectedHeading,
  createAccount,
  expectAfterBackend,
  newMarcAccount,
  openSession,
  toasts,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

for (const authPage of ['/signin', '/signup']) {
  test(`connecté, ${authPage} renvoie vers l’accueil connecté`, async ({ page, request }) => {
    const marc = newMarcAccount()
    await createAccount(request, marc)
    await openSession(page, marc)

    await page.goto(authPage)

    await expectAfterBackend(page).toHaveURL('/')
    await expect(connectedHeading(page, 'Marc')).toBeVisible()
    await expect(toasts(page)).toHaveCount(0)
  })
}

test('retour navigateur après la connexion, pas de retour sur le formulaire', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await page.goto('/signin')
  await page.getByLabel('Email', { exact: true }).fill(marc.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)
  await page.getByRole('button', { name: 'Me connecter' }).click()
  await expectAfterBackend(connectedHeading(page, 'Marc')).toBeVisible()

  await page.goBack()

  await expectAfterBackend(page).not.toHaveURL('/signin')
  await expect(page.getByRole('button', { name: 'Me connecter' })).toHaveCount(0)
})
