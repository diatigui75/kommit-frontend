import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

// Variables propres aux e2e (E2E_DATABASE_URL pour SM-18), lues dans .env.e2e s'il existe.
if (existsSync('.env.e2e')) process.loadEnvFile('.env.e2e')

// HEADED=1 : fenêtre visible, ralenti (SLOWMO en ms par action) et 1 seul worker, pour regarder un parcours.
const headed = process.env.HEADED === '1'

// Défini uniquement par les scripts `test:e2e:qa:*`, qui chargent .env.qa : on teste alors le front déployé en DEV.
const qaBaseUrl = process.env.QA_BASE_URL

export default defineConfig({
  testDir: 'e2e',
  // Plafond à 3 : le backend compte une requête sign-in / sign-up en cours comme un échec jusqu'à sa réponse (limite 5 par minute et par IP).
  workers: headed ? 1 : 3,
  reporter: 'list',
  use: {
    baseURL: qaBaseUrl ?? 'http://localhost:5173',
    headless: !headed,
    launchOptions: { slowMo: headed ? Number(process.env.SLOWMO ?? 800) : 0 },
    trace: 'retain-on-failure',
    screenshot: qaBaseUrl ? 'on' : 'off',
  },
  // Le suffixe du fichier route la spec : `.nondet.test.ts` dépend d'un système externe non contrôlé (LLM), hors CI.
  projects: [
    {
      name: 'deterministic',
      testMatch: /(?<!\.nondet)\.test\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'nondet',
      testMatch: /\.nondet\.test\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Lance seulement le front : le backend est un serveur séparé, à démarrer à part. Rien à lancer sur le lien déployé.
  webServer: qaBaseUrl
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
      },
})
