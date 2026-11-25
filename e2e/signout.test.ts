import { expect, test } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  connectedHeading,
  createAccount,
  expectAfterBackend,
  headerLink,
  newMarcAccount,
  openSession,
  toasts,
  visitorHeading,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

test('SM-17 : déconnexion silencieuse (RM5)', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await openSession(page, marc)
  await page.goto('/')
  await expectAfterBackend(connectedHeading(page, 'Marc')).toBeVisible()

  await page.getByRole('button', { name: 'Se déconnecter' }).click()

  await expectAfterBackend(visitorHeading(page)).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toBeVisible()
  await expect(headerLink(page, 'Créer un compte')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
  await expect(toasts(page)).toHaveCount(0)

  await page.reload()

  await expectAfterBackend(visitorHeading(page)).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toBeVisible()
  await expect(headerLink(page, 'Créer un compte')).toBeVisible()
})
