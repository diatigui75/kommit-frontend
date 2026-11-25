import { expect, test } from '@playwright/test'
import { connectedHeading, createAccount, headerLink, newMarcAccount, openSession, visitorHeading } from './support/auth.ts'

test('SM-1 : visiteur sans session, accueil en état visiteur (RM1)', async ({ page }) => {
  await page.context().clearCookies()

  await page.goto('/')

  await expect(visitorHeading(page)).toBeVisible()
  await expect(page.getByText('Track tes résultats pour que les jours ne se ressemblent pas.')).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toBeVisible()
  await expect(headerLink(page, 'Créer un compte')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toHaveCount(0)
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('SM-2 : utilisateur connecté, titre avec son prénom (RM2)', async ({ page, request }) => {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await openSession(page, marc)

  await page.goto('/')

  await expect(connectedHeading(page, 'Marc')).toBeVisible()
  await expect(page.getByText('Renseigne ton daily du jour ci-dessous.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
  await expect(headerLink(page, 'Se connecter')).toHaveCount(0)
  await expect(headerLink(page, 'Créer un compte')).toHaveCount(0)
})

test('SM-3 : lien ViDev ouvert dans un nouvel onglet (RM15)', async ({ page, context }) => {
  // YouTube est remplacé par une page vide : on vérifie l'ouverture de l'onglet, pas la disponibilité de YouTube.
  await context.route('https://www.youtube.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html><body></body></html>' }),
  )
  await page.goto('/')
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'ViDev' })).toBeVisible()
  const newTab = context.waitForEvent('page')

  await page.getByRole('contentinfo').getByRole('link', { name: 'ViDev' }).click()

  const youtubeTab = await newTab
  await expect(youtubeTab).toHaveURL('https://www.youtube.com/@videv9858')
  await expect(page).toHaveURL('/')
  expect(context.pages()).toContain(page)
})
