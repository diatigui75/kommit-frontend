import { expect, test } from '@playwright/test'
import {
  connectedHeading,
  createAccount,
  headerLink,
  newMarcAccount,
  openSession,
  toasts,
  visitorHeading,
} from './support/auth.ts'

test('SM-17 : déconnexion silencieuse (RM5)', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await openSession(page, marc)
  await page.goto('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()

  await page.getByRole('button', { name: 'Se déconnecter' }).click()

  await expect(visitorHeading(page)).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toBeVisible()
  await expect(headerLink(page, 'Créer un compte')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
  await expect(toasts(page)).toHaveCount(0)

  await page.reload()

  await expect(visitorHeading(page)).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toBeVisible()
  await expect(headerLink(page, 'Créer un compte')).toBeVisible()
})
