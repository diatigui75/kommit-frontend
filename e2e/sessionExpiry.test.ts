import { expect, test } from '@playwright/test'
import {
  connectedHeading,
  createAccount,
  databaseUrl,
  expireSessionsOf,
  headerLink,
  newMarcAccount,
  openSession,
  toasts,
  visitorHeading,
} from './support/auth.ts'

test('SM-18 : session expirée, accueil visiteur sans message (RM31)', async ({ page, request }) => {
  test.skip(!databaseUrl, 'E2E_DATABASE_URL absente : ce scénario doit passer expiresAt dans le passé en base.')
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await openSession(page, marc)
  await page.goto('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  await expireSessionsOf(marc.email)

  await page.reload()

  await expect(visitorHeading(page)).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toBeVisible()
  await expect(headerLink(page, 'Créer un compte')).toBeVisible()
  await expect(page).toHaveURL('/')
  await expect(toasts(page)).toHaveCount(0)
  await expect(page.getByRole('alert')).toHaveCount(0)
})
