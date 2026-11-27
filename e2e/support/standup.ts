import { expect, type APIRequestContext, type Locator, type Page, type Response, type Route } from '@playwright/test'
import { API_URL, createAccount, newMarcAccount, openSession, type Account } from './auth.ts'

export const TODAY_URL = `${API_URL}/standups/today`
export const STANDUPS_URL = `${API_URL}/standups`
export const CONVERSATION_URL = `${API_URL}/standups/conversation`

// Couvre les 3 catégories pour que l'IA arrive vite au récap (conventions des smokes).
export const START_TEXT =
  "Hier j'ai terminé la page de connexion. Aucun blocage. Demain je commence le calendrier."

export const OLD_SUMMARY = { fait: ['Ancien standup : page de connexion'], blocages: [], prevu: ['Calendrier'] }

// Un tour du vrai LLM (Groq) peut prendre plusieurs dizaines de secondes.
export const LLM_TIMEOUT = 90_000
export const expectAfterLlm = expect.configure({ timeout: LLM_TIMEOUT })
export const LLM_TEST_TIMEOUT = 300_000

// Redonne les 3 catégories à chaque tour : une réponse sans plan du jour fait reboucler l'IA sur sa question (run du 27/11).
const SUMMARY_ANSWER =
  "Hier j'ai terminé la page de connexion. Aucun blocage. Aujourd'hui je commence le calendrier. Rien d'autre, tu peux faire le récap."
const MAX_TURNS = 6

export async function signInNewMarc(page: Page, request: APIRequestContext): Promise<Account> {
  const marc = newMarcAccount()
  await createAccount(request, marc)
  await openSession(page, marc)

  return marc
}

// Précondition « compte avec standup du jour » : POST envoyé avec le cookie de session du navigateur.
export async function createTodayStandup(page: Page) {
  const response = await page.request.post(STANDUPS_URL, { data: { summary: OLD_SUMMARY } })

  expect(response.ok(), `POST /standups : ${response.status()}`).toBe(true)
}

export const todoHeading = (page: Page): Locator =>
  page.getByRole('heading', { level: 1, name: "Qu'as-tu fait de beau aujourd'hui, Marc ?" })

export const doneHeading = (page: Page): Locator =>
  page.getByRole('heading', { level: 1, name: 'Bravo, tu as renseigné ton standup du jour !' })

// Par texte : derrière une modale ouverte, la page est masquée de l'arbre d'accessibilité.
export const counter = (page: Page, count: number): Locator =>
  page.getByText(`${count} daily renseigné(s) sur l'année`, { exact: true })

export const dailyInput = (page: Page): Locator => page.getByRole('textbox', { name: 'Ton daily du jour' })

export const launchButton = (page: Page): Locator => page.getByRole('button', { name: 'Lancer le daily' })

export const chatDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Daily Standup Assistant' })

export const messageInput = (page: Page): Locator => chatDialog(page).getByRole('textbox', { name: 'Écrire un message …' })

export const sendButton = (page: Page): Locator => chatDialog(page).getByRole('button', { name: 'Envoyer' })

export const waitingIndicator = (page: Page): Locator => chatDialog(page).getByText("L'assistant écrit…")

export const summaryIntro = (page: Page): Locator => chatDialog(page).getByText('Voici le résumé de ton daily. Tu valides ?')

export const validateButton = (page: Page): Locator => page.getByRole('button', { name: 'Oui, je valide le daily' })

export const quitConfirm = (page: Page): Locator =>
  page.getByRole('alertdialog', { name: "Le daily standup n'est pas encore validé." })

export const replaceConfirm = (page: Page): Locator =>
  page.getByRole('alertdialog', { name: 'Ton daily du jour est déjà renseigné.' })

export async function launchDaily(page: Page, text: string) {
  await dailyInput(page).fill(text)
  await launchButton(page).click()
}

// À appeler AVANT l'action qui envoie le tour : se résout quand le flux SSE de la réponse est entièrement reçu.
export function nextConversationTurn(page: Page): Promise<Response> {
  return page
    .waitForResponse((response) => response.url() === CONVERSATION_URL && response.request().method() === 'POST', {
      timeout: LLM_TIMEOUT,
    })
    .then(async (response) => {
      await response.finished()
      return response
    })
}

// Fin d'un tour : l'indicateur d'attente a disparu et aucune erreur (quota Groq, provider) n'est affichée.
export async function expectTurnEnded(page: Page, turn: Promise<Response>) {
  await turn
  await expect(waitingIndicator(page)).toHaveCount(0)
  await expect(chatDialog(page).getByRole('alert'), 'erreur affichée par la modale').toHaveCount(0)
}

// Texte du fil après le message de l'utilisateur : la réponse de l'IA y apparaît en dessous.
export async function textAfter(page: Page, userText: string): Promise<string> {
  const thread = await chatDialog(page).innerText()

  return (thread.split(userText)[1] ?? '').replace('Fermer la conversation', '').trim()
}

// Répond à l'IA jusqu'au récap ; le nombre de tours dépend du LLM. `beforeEachTurn` vérifie l'état avant le récap.
export async function answerUntilSummary(page: Page, beforeEachTurn: () => Promise<void> = async () => undefined) {
  for (let turn = 0; turn < MAX_TURNS; turn += 1) {
    if (await summaryIntro(page).isVisible()) return
    await beforeEachTurn()
    const reply = nextConversationTurn(page)
    await messageInput(page).fill(SUMMARY_ANSWER)
    await sendButton(page).click()
    await expectTurnEnded(page, reply)
  }

  await expect(summaryIntro(page), `récap absent après ${MAX_TURNS} tours`).toBeVisible()
}

// Lance le daily avec le texte de départ, attend la 1re réponse de l'IA, puis répond jusqu'au récap.
export async function reachSummary(page: Page, beforeEachTurn?: () => Promise<void>) {
  const firstReply = nextConversationTurn(page)
  await launchDaily(page, START_TEXT)
  await expectTurnEnded(page, firstReply)
  await answerUntilSummary(page, beforeEachTurn)
}

// Flux SSE contrôlé, au format du backend : `data: <SseEvent JSON>\n\n`.
export const sseBody = (events: unknown[]) => events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('')

export const tokens = (text: string) => text.split(' ').map((word, index) => ({ type: 'token', text: index === 0 ? word : ` ${word}` }))

// Réponse interceptée sur une autre origine : sans ces en-têtes, le navigateur bloque la lecture (CORS avec cookie).
export function fulfillSse(route: Route, events: unknown[]) {
  const origin = route.request().headers()['origin'] ?? 'http://localhost:5173'

  return route.fulfill({
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
    },
    body: sseBody(events),
  })
}

// Remplace le vrai LLM : chaque POST sur la conversation reçoit le gestionnaire du tour suivant, dans l'ordre.
export async function mockConversation(page: Page, turns: ((route: Route) => Promise<void>)[]) {
  let turn = 0
  await page.route(CONVERSATION_URL, async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()

    const handler = turns[turn]
    turn += 1
    if (!handler) return route.abort('failed')
    await handler(route)
  })
}
