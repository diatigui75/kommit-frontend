import { expect, test } from '@playwright/test'
import { headerLink } from './support/auth.ts'

test('SM-4 : lien « Créer un compte » vers le signup (RM6)', async ({ page }) => {
  await page.goto('/')

  await headerLink(page, 'Créer un compte').click()

  await expect(page).toHaveURL('/signup')
  await expect(page.getByRole('heading', { level: 1, name: 'Créer un compte' })).toBeVisible()
  await expect(page.getByLabel('Prénom*')).toBeVisible()
  await expect(page.getByLabel('Email*')).toBeVisible()
  await expect(page.getByLabel('Mot de passe*')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Créer un compte' })).toBeVisible()
})

test('SM-5 : lien « Se connecter » vers le signin (RM7)', async ({ page }) => {
  await page.goto('/')

  await headerLink(page, 'Se connecter').click()

  await expect(page).toHaveURL('/signin')
  await expect(page.getByRole('heading', { level: 1, name: 'Se connecter' })).toBeVisible()
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Mot de passe', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Me connecter' })).toBeVisible()
})
