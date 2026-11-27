import { expect, test } from '@playwright/test'
import {
  BACKEND_TEST_TIMEOUT,
  connectedHeading,
  createAccount,
  expectAfterBackend,
  openSession,
  uniqueEmail,
} from './support/auth.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

const LONG_FIRST_NAME = 'Maximilien'.repeat(20)

for (const width of [1280, 375]) {
  test(`prénom de 200 caractères, titre de l’accueil sans débordement en ${width} px`, async ({ page, request }) => {
    const account = { name: LONG_FIRST_NAME, email: uniqueEmail(), password: 'motdepasse123' }
    await createAccount(request, account)
    await openSession(page, account)
    await page.setViewportSize({ width, height: 800 })

    await page.goto('/')

    await expectAfterBackend(connectedHeading(page, LONG_FIRST_NAME)).toBeVisible()
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(pageWidth).toBeLessThanOrEqual(width)
  })
}
