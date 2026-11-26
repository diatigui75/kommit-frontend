import { expect, type APIRequestContext, type Locator, type Page, type Route } from '@playwright/test'
import pg from 'pg'

export const API_URL = process.env.VITE_API_URL ?? 'http://localhost:3000'
// Better Auth refuse une requête dont l'Origin n'est pas dans ses trustedOrigins : en QA, c'est le front déployé.
const FRONT_ORIGIN = process.env.QA_BASE_URL ?? 'http://localhost:5173'

export const SIGNUP_URL = `${API_URL}/api/auth/sign-up/email`
export const SIGNIN_URL = `${API_URL}/api/auth/sign-in/email`

export type Account = { name: string; email: string; password: string }

// Backend sur une base Neon distante : un aller-retour peut prendre plusieurs secondes (réveil de la base, workers en parallèle).
// Ce délai vaut seulement pour un observable qui attend une réponse du backend ; le reste garde les 5 s par défaut.
export const BACKEND_TIMEOUT = 15_000
export const expectAfterBackend = expect.configure({ timeout: BACKEND_TIMEOUT })

// Un test qui enchaîne plusieurs allers-retours (création du compte, session, signin, relecture) dépasse vite les 30 s par défaut.
export const BACKEND_TEST_TIMEOUT = 60_000

// Email unique par appel : un 2e run ne bute pas sur EMAIL_ALREADY_EXISTS.
export const uniqueEmail = () => `marc+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.dev`

export const newMarcAccount = (): Account => ({ name: 'Marc', email: uniqueEmail(), password: 'motdepasse123' })

// Crée le compte par l'API, hors du navigateur : le contexte du test reste sans session.
export async function createAccount(request: APIRequestContext, account: Account) {
  const response = await request.post(SIGNUP_URL, { data: account, headers: { Origin: FRONT_ORIGIN } })

  expect(response.ok(), `création du compte ${account.email} : ${response.status()}`).toBe(true)
}

// page.request partage les cookies du navigateur : le cookie de session posé ici vaut pour les pages ouvertes ensuite.
export async function openSession(page: Page, account: Account) {
  const response = await page.request.post(SIGNIN_URL, {
    data: { email: account.email, password: account.password },
    headers: { Origin: FRONT_ORIGIN },
  })

  expect(response.ok(), `signin de ${account.email} : ${response.status()}`).toBe(true)
}

// Retient la requête POST visée jusqu'à l'appel de la fonction renvoyée : l'état « en cours » reste observable sans délai fixe.
export async function holdPost(page: Page, url: string): Promise<() => void> {
  let release: () => void = () => undefined
  const released = new Promise<void>((resolve) => {
    release = resolve
  })

  await page.route(url, async (route: Route) => {
    if (route.request().method() !== 'POST') return route.fallback()

    await released
    await route.continue()
  })

  return release
}

export function countPosts(page: Page, url: string): () => number {
  let count = 0
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url() === url) count += 1
  })

  return () => count
}

export const toasts = (page: Page): Locator =>
  page.getByRole('region', { name: /Notifications/ }).getByRole('listitem')

export const connectedHeading = (page: Page, name: string): Locator =>
  page.getByRole('heading', { level: 1, name: `Qu'as-tu fait de beau aujourd'hui, ${name} ?` })

export const visitorHeading = (page: Page): Locator =>
  page.getByRole('heading', { level: 1, name: 'Prêt(e) pour ton daily standup ?' })

export const headerLink = (page: Page, name: string): Locator =>
  page.getByRole('banner').getByRole('link', { name, exact: true })

// SM-18 a besoin d'écrire en base : le smoke fait passer `expiresAt` dans le passé, rien côté API ne le permet.
export const databaseUrl = process.env.E2E_DATABASE_URL

export async function expireSessionsOf(email: string) {
  const client = new pg.Client({ connectionString: databaseUrl })
  await client.connect()

  try {
    await client.query(
      `UPDATE "session" SET "expiresAt" = now() - interval '1 day' WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)`,
      [email],
    )
  } finally {
    await client.end()
  }
}
