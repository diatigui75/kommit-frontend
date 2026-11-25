import { expect, test, type Page } from '@playwright/test'
import {
  connectedHeading,
  createAccount,
  newMarcAccount,
  openSession,
  toasts,
  uniqueEmail,
  type Account,
} from './support/auth.ts'

const SIGNIN_TOAST = 'Content de te revoir Marc.'

let marc: Account

test.beforeAll(async ({ request }) => {
  marc = newMarcAccount()
  await createAccount(request, marc)
})

async function signInThroughForm(page: Page, account: Account) {
  await page.goto('/signin')
  await page.getByLabel('Email', { exact: true }).fill(account.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(account.password)
  await page.getByRole('button', { name: 'Me connecter' }).click()
  await expect(toasts(page).getByText(SIGNIN_TOAST, { exact: true })).toBeVisible()
}

// Le toast est vu puis fermé par sa croix, comme dans la précondition de SM-14 et SM-15.
async function dismissArrivalToast(page: Page) {
  await toasts(page).getByRole('button', { name: 'Close toast' }).click()
  await expect(toasts(page)).toHaveCount(0)
}

async function expectToastInTopRightCorner(page: Page, toastText: string) {
  const toastBox = await toasts(page).filter({ hasText: toastText }).boundingBox()
  const viewport = page.viewportSize()

  expect(toastBox).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(toastBox!.x).toBeGreaterThan(viewport!.width / 2)
  expect(toastBox!.y).toBeLessThan(viewport!.height / 2)
}

test('SM-12 : toast d\'arrivée après un signup (RM3)', async ({ page }) => {
  const toastText = 'Bienvenue Marc, ton compte est créé.'
  await page.goto('/signup')
  await page.getByLabel('Prénom*').fill('Marc')
  await page.getByLabel('Email*').fill(uniqueEmail())
  await page.getByLabel('Mot de passe*').fill('motdepasse123')

  await page.getByRole('button', { name: 'Créer un compte' }).click()

  await expect(page).toHaveURL('/')
  await expect(toasts(page).getByText(toastText, { exact: true })).toBeVisible()
  await expect(toasts(page).getByRole('button', { name: 'Close toast' })).toBeVisible()
  await expect(toasts(page)).toHaveCount(1)
  await expectToastInTopRightCorner(page, toastText)
})

test('SM-13 : toast d\'arrivée après un signin (RM4)', async ({ page }) => {
  await page.goto('/signin')
  await page.getByLabel('Email', { exact: true }).fill(marc.email)
  await page.getByLabel('Mot de passe', { exact: true }).fill(marc.password)

  await page.getByRole('button', { name: 'Me connecter' }).click()

  await expect(page).toHaveURL('/')
  await expect(toasts(page).getByText(SIGNIN_TOAST, { exact: true })).toBeVisible()
  await expect(toasts(page).getByRole('button', { name: 'Close toast' })).toBeVisible()
  await expect(toasts(page)).toHaveCount(1)
  await expect(page.getByText(/Bienvenue/)).toHaveCount(0)
  await expectToastInTopRightCorner(page, SIGNIN_TOAST)
})

test('SM-14 : pas de toast après un rechargement (RM24)', async ({ page }) => {
  await signInThroughForm(page, marc)
  await dismissArrivalToast(page)

  await page.reload()

  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  await expect(toasts(page)).toHaveCount(0)
})

test('SM-15 : pas de toast après un « retour » puis « suivant » navigateur (RM24)', async ({ page }) => {
  await signInThroughForm(page, marc)
  await dismissArrivalToast(page)

  await page.goBack()
  await page.goForward()

  await expect(page).toHaveURL('/')
  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  await expect(toasts(page)).toHaveCount(0)
})

test('SM-16 : session persistée, ouverture directe de l\'accueil sans toast (RM25)', async ({ page, context }) => {
  await openSession(page, marc)
  await page.close()

  const newTab = await context.newPage()
  await newTab.goto('/')

  await expect(connectedHeading(newTab, 'Marc')).toBeVisible()
  await expect(toasts(newTab)).toHaveCount(0)
})
