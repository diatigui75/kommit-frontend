import { expect, test } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  connectedHeading,
  createAccount,
  expectAfterBackend,
  newMarcAccount,
  openSession,
  toasts,
  visitorHeading,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

test('URL inconnue, redirection vers l’accueil', async ({ page }) => {
  await page.context().clearCookies()

  await page.goto('/nimporte-quoi')

  await expect(page).toHaveURL('/')
  await expectAfterBackend(visitorHeading(page)).toBeVisible()
})

test('retour navigateur après la redirection, pas de retour sur l’URL inconnue', async ({ page }) => {
  await page.goto('/signin')
  await page.goto('/nimporte-quoi')
  await expect(page).toHaveURL('/')

  await page.goBack()

  await expect(page).toHaveURL('/signin')
})

test('connecté, URL inconnue vers l’accueil connecté sans toast', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await openSession(page, marc)

  await page.goto('/nimporte-quoi')

  await expect(page).toHaveURL('/')
  await expectAfterBackend(connectedHeading(page, 'Marc')).toBeVisible()
  await expect(toasts(page)).toHaveCount(0)
})
