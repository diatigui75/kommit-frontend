// Le code passé à page.evaluate s'exécute dans le navigateur : types DOM activés pour ce fichier.
/// <reference lib="dom" />
import { expect, test, type Page, type Request, type Route } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, expectAfterBackend, toasts } from './support/auth.ts'
import { STANDUPS_URL, chatDialog, counter, doneHeading, signInNewMarc } from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

type Summary = { fait: string[]; blocages: string[]; prevu: string[] }

const DAILY_SUMMARY: Summary = {
  fait: ['Page de connexion terminée'],
  blocages: ['Attente de la review backend'],
  prevu: ['Calendrier'],
}

const HTML_ITEM = "Testé <script>alert('xss')</script> sur le composant <b>Navbar</b>"

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const ERROR_MESSAGE = "Ton calendrier n'a pas pu être chargé. Réessaie dans un instant."
const NOT_FOUND_MESSAGE = "Ce standup n'existe plus, le calendrier a été mis à jour."

// Grille de la maquette : carré de 11 px + 3 px d'écart entre colonnes, 53 semaines.
const COLUMN_STEP = 14
const LAST_COLUMN = 52

// Aujourd'hui se lit en Europe/Paris, comme le serveur qui impose le jour du standup.
const now = new Date()
const todayJour = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(now)
const todayLabel = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(now)
// 0 = dimanche : rang du jour dans sa colonne, les semaines allant du dimanche au samedi (CA11).
const todayWeekday = new Date(`${todayJour}T00:00:00Z`).getUTCDay()
const currentMonthLabel = MONTHS[Number(todayJour.slice(5, 7)) - 1]

const STANDUP_OF_TODAY_URL = `${STANDUPS_URL}/${todayJour}`

const isCalendarUrl = (url: URL) => url.href.startsWith(STANDUPS_URL) && url.pathname === '/standups' && url.searchParams.has('from')
const isStandupOfDayRequest = (request: Request) => /\/standups\/\d{4}-\d{2}-\d{2}$/.test(new URL(request.url()).pathname)

const dayButtons = (page: Page) => page.getByRole('button', { name: /^Voir le daily du / })
const todayButton = (page: Page) => page.getByRole('button', { name: `Voir le daily du ${todayLabel}`, exact: true })
const summaryDialog = (page: Page) => chatDialog(page)

// Précondition « compte avec standup du jour » : POST envoyé avec le cookie de session du navigateur.
async function postTodayStandup(page: Page, summary: Summary) {
  const response = await page.request.post(STANDUPS_URL, { data: { summary } })

  expect(response.ok(), `POST /standups : ${response.status()}`).toBe(true)
}

// Réponse interceptée sur une autre origine : sans ces en-têtes, le navigateur bloque la lecture (CORS avec cookie).
function fulfillJson(route: Route, status: number, body: unknown) {
  const origin = route.request().headers()['origin'] ?? 'http://localhost:5173'

  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true' },
    body: JSON.stringify(body),
  })
}

async function centerOf(page: Page, text: string) {
  const box = await page.getByText(text, { exact: true }).boundingBox()
  if (!box) throw new Error(`« ${text} » sans boîte à l'écran`)

  return { x: box.x + box.width / 2, y: box.y + box.height / 2, left: box.x }
}

// Les carrés gris n'ont ni texte ni libellé (conventions des smokes) : on les situe par leur position dans la grille.
// elementFromPoint ne voit que la partie affichée : la grille et sa légende sont amenées à l'écran avant toute mesure.
async function gridGeometry(page: Page) {
  await page.getByText('Lun', { exact: true }).scrollIntoViewIfNeeded()
  const lun = await centerOf(page, 'Lun')
  const mer = await centerOf(page, 'Mer')
  const rowStep = (mer.y - lun.y) / 2
  const monthLefts = await Promise.all(
    MONTHS.map(async (month) => {
      const labels = await page.getByText(month, { exact: true }).all()
      const boxes = await Promise.all(labels.map((label) => label.boundingBox()))
      return boxes.flatMap((box) => (box ? [{ month, left: box.x }] : []))
    }),
  )
  const months = monthLefts.flat().sort((a, b) => a.left - b.left)
  const firstColumnLeft = months[0].left

  const squareCenter = (column: number, weekday: number) => ({
    x: firstColumnLeft + column * COLUMN_STEP + 5.5,
    y: lun.y + (weekday - 1) * rowStep,
  })

  return { months, rowStep, squareCenter }
}

// La veille du jour : juste au-dessus dans la même colonne, ou en bas de la colonne précédente si aujourd'hui est un dimanche.
const yesterdayPosition = () =>
  todayWeekday === 0 ? { column: LAST_COLUMN - 1, weekday: 6 } : { column: LAST_COLUMN, weekday: todayWeekday - 1 }

async function squareStyleAt(page: Page, point: { x: number; y: number }) {
  return page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y)
    if (!element) return null
    const style = getComputedStyle(element)
    return {
      tag: element.tagName,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderTopColor,
      borderWidth: style.borderTopWidth,
    }
  }, point)
}

// Le carré de la légende est collé à gauche de son texte (11 px).
async function legendSquareStyle(page: Page, legend: string) {
  const box = await page.getByText(legend, { exact: true }).boundingBox()
  if (!box) throw new Error(`légende « ${legend} » absente`)

  return squareStyleAt(page, { x: box.x + 5.5, y: box.y + box.height / 2 })
}

test('SM-1 : compteur du serveur, semaines du dimanche au samedi, aujourd\'hui en dernière colonne (CA11)', async ({
  page,
  request,
}) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)
  const calendarResponse = page.waitForResponse((response) => isCalendarUrl(new URL(response.url())))

  await page.goto('/')

  const response = await calendarResponse
  expect(new URL(response.url()).searchParams.get('to')).toBe(todayJour)
  expect(await response.json()).toMatchObject({ count: 1 })
  await expectAfterBackend(counter(page, 1)).toBeVisible()
  await expect(todayButton(page)).toBeVisible()
  const { months, rowStep, squareCenter } = await gridGeometry(page)
  const lun = await centerOf(page, 'Lun')
  const mer = await centerOf(page, 'Mer')
  const ven = await centerOf(page, 'Ven')
  // Lun, Mer, Ven sur les lignes 2, 4, 6 : une ligne vide au-dessus de « Lun », une entre chaque libellé.
  expect(ven.y - mer.y).toBeCloseTo(mer.y - lun.y, 0)
  expect(rowStep).toBeGreaterThan(0)
  expect(months.at(-1)?.month).toBe(currentMonthLabel)
  const todayBox = await todayButton(page).boundingBox()
  const expectedTodayCenter = squareCenter(LAST_COLUMN, todayWeekday)
  expect(Math.abs((todayBox?.x ?? 0) + (todayBox?.width ?? 0) / 2 - expectedTodayCenter.x)).toBeLessThan(2)
  expect(Math.abs((todayBox?.y ?? 0) + (todayBox?.height ?? 0) / 2 - expectedTodayCenter.y)).toBeLessThan(2)
  // Rien à droite du carré du jour : c'est bien la dernière colonne.
  const beyondLastColumn = await squareStyleAt(page, squareCenter(LAST_COLUMN + 1, todayWeekday))
  expect(beyondLastColumn?.tag).not.toBe('BUTTON')
  expect(beyondLastColumn?.backgroundColor).not.toBe((await legendSquareStyle(page, 'Daily non renseigné'))?.backgroundColor)
})

test('SM-2 : le jour renseigné a le liseré vert, les autres sont gris (CA12)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)

  await page.goto('/')

  await expectAfterBackend(todayButton(page)).toBeVisible()
  await expect(dayButtons(page)).toHaveCount(1)
  const { squareCenter } = await gridGeometry(page)
  const filledLegend = await legendSquareStyle(page, 'Daily enregistré')
  const emptyLegend = await legendSquareStyle(page, 'Daily non renseigné')
  const todayBox = await todayButton(page).boundingBox()
  const todaySquare = await squareStyleAt(page, {
    x: (todayBox?.x ?? 0) + (todayBox?.width ?? 0) / 2,
    y: (todayBox?.y ?? 0) + (todayBox?.height ?? 0) / 2,
  })
  expect(todaySquare).toMatchObject({
    tag: 'BUTTON',
    backgroundColor: filledLegend?.backgroundColor,
    borderColor: filledLegend?.borderColor,
    borderWidth: filledLegend?.borderWidth,
  })
  expect(filledLegend?.backgroundColor).not.toBe(emptyLegend?.backgroundColor)
  // Échantillon des jours passés : la veille et la toute 1re case de la grille (un dimanche d'il y a 52 semaines).
  const yesterday = yesterdayPosition()
  for (const square of [squareCenter(yesterday.column, yesterday.weekday), squareCenter(0, 0)]) {
    expect(await squareStyleAt(page, square)).toMatchObject({ tag: 'SPAN', backgroundColor: emptyLegend?.backgroundColor })
  }
})

test('SM-3 : clic sur un carré vert, modale résumé en lecture seule (CA14)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)
  await page.goto('/')
  await expectAfterBackend(todayButton(page)).toBeVisible()

  await todayButton(page).click()

  const dialog = summaryDialog(page)
  await expectAfterBackend(dialog.getByText(`Voici le résumé du daily du ${todayLabel}`, { exact: true })).toBeVisible()
  await expect(dialog.getByText(`En date du ${todayLabel}`, { exact: true })).toBeVisible()
  await expect(dialog.getByRole('heading', { level: 3 })).toHaveText(['Hier', 'Blocages', 'À venir'])
  await expect(dialog.getByRole('heading', { level: 3 }).first()).toHaveCSS('text-transform', 'uppercase')
  await expect(dialog.getByRole('list').nth(0).getByRole('listitem')).toHaveText(DAILY_SUMMARY.fait)
  await expect(dialog.getByRole('list').nth(1).getByRole('listitem')).toHaveText(DAILY_SUMMARY.blocages)
  await expect(dialog.getByRole('list').nth(2).getByRole('listitem')).toHaveText(DAILY_SUMMARY.prevu)
  await expect(dialog.getByRole('textbox')).toHaveCount(0)
  await expect(dialog.getByRole('button', { name: 'Envoyer' })).toHaveCount(0)
  await expect(dialog.getByRole('button', { name: 'Oui, je valide le daily' })).toHaveCount(0)
  await expect(dialog.getByRole('button')).toHaveCount(1)
  await expect(dialog.getByRole('button', { name: 'Fermer le résumé' })).toBeVisible()
})

test('SM-4 : clic sur un carré gris, rien ne se passe (CA15)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)
  await page.goto('/')
  await expectAfterBackend(todayButton(page)).toBeVisible()
  const standupOfDayRequests: string[] = []
  page.on('request', (request) => {
    if (isStandupOfDayRequest(request)) standupOfDayRequests.push(request.url())
  })
  const { squareCenter } = await gridGeometry(page)
  const yesterday = squareCenter(yesterdayPosition().column, yesterdayPosition().weekday)

  await page.mouse.click(yesterday.x, yesterday.y)

  await expect(summaryDialog(page)).toHaveCount(0)
  await expect(page.getByText(/^En date du /)).toHaveCount(0)
  await expect(page).toHaveURL('/')
  // Point de synchronisation : le clic sur le carré vert prouve que le clic précédent a été traité.
  // Seule la requête du jour doit alors exister, aucune pour la veille.
  await todayButton(page).click()
  await expectAfterBackend(summaryDialog(page).getByRole('list').first()).toBeVisible()
  expect(standupOfDayRequests).toEqual([STANDUP_OF_TODAY_URL])
})

test('SM-5 : le résumé est demandé au clic, avec un état de chargement (CA46)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)
  const standupOfDayRequests: string[] = []
  page.on('request', (request) => {
    if (isStandupOfDayRequest(request)) standupOfDayRequests.push(request.url())
  })
  // Remplace le profil « Slow 3G » : GET /standups/:jour est retenu jusqu'aux vérifications du chargement.
  let releaseSummary: () => void = () => undefined
  const summaryReleased = new Promise<void>((resolve) => {
    releaseSummary = resolve
  })
  await page.route(STANDUP_OF_TODAY_URL, async (route) => {
    await summaryReleased
    await route.continue()
  })
  const calendarResponse = page.waitForResponse((response) => isCalendarUrl(new URL(response.url())))

  await page.goto('/')

  expect(Object.keys(await (await calendarResponse).json()).sort()).toEqual(['count', 'jours'])
  await expectAfterBackend(todayButton(page)).toBeVisible()
  expect(standupOfDayRequests).toEqual([])

  const summaryRequest = page.waitForRequest(STANDUP_OF_TODAY_URL)
  await todayButton(page).click()

  const dialog = summaryDialog(page)
  await summaryRequest
  await expect(dialog.getByText(`En date du ${todayLabel}`, { exact: true })).toBeVisible()
  await expect(dialog.getByRole('status', { name: 'Chargement du résumé' })).toBeVisible()
  await expect(dialog.getByRole('heading', { level: 3 })).toHaveCount(0)
  releaseSummary()
  await expectAfterBackend(dialog.getByRole('heading', { level: 3 })).toHaveText(['Hier', 'Blocages', 'À venir'])
  await expect(dialog.getByRole('status', { name: 'Chargement du résumé' })).toHaveCount(0)
})

test('SM-6 : HTML dans le résumé rendu en texte brut, « Aucun » pour une catégorie vide (CA30)', async ({
  page,
  request,
}) => {
  const browserDialogs: string[] = []
  page.on('dialog', (dialog) => {
    browserDialogs.push(dialog.message())
    void dialog.dismiss()
  })
  await signInNewMarc(page, request)
  await postTodayStandup(page, { fait: [HTML_ITEM], blocages: [], prevu: ['Calendrier'] })
  await page.goto('/')
  await expectAfterBackend(todayButton(page)).toBeVisible()

  await todayButton(page).click()

  const dialog = summaryDialog(page)
  const lists = dialog.getByRole('list')
  // Le texte exact, balises comprises : si React l'avait interprété en HTML, `<b>` et `<script>` auraient disparu du texte.
  await expectAfterBackend(lists.nth(0).getByRole('listitem')).toHaveText([HTML_ITEM])
  await expect(lists.nth(1).getByRole('listitem')).toHaveText(['Aucun'])
  await expect(lists.nth(2).getByRole('listitem')).toHaveText(['Calendrier'])
  expect(browserDialogs).toEqual([])
})

test('SM-7 : standup disparu entre le chargement et le clic, message et calendrier rafraîchi (CA45)', async ({
  page,
  request,
}) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)
  // Remplace la suppression en base : le 1er chargement du calendrier passe, les suivants ne contiennent plus le jour.
  let calendarLoads = 0
  await page.route(isCalendarUrl, async (route) => {
    calendarLoads += 1
    if (calendarLoads === 1) return route.continue()
    await fulfillJson(route, 200, { count: 0, jours: [] })
  })
  await page.route(STANDUP_OF_TODAY_URL, (route) =>
    fulfillJson(route, 404, { code: 'STANDUP_NOT_FOUND', message: 'Standup introuvable' }),
  )
  await page.goto('/')
  await expectAfterBackend(counter(page, 1)).toBeVisible()

  await todayButton(page).click()

  await expect(toasts(page).filter({ hasText: NOT_FOUND_MESSAGE })).toBeVisible()
  await expect(summaryDialog(page)).toHaveCount(0)
  await expect(page.getByRole('status', { name: 'Chargement du résumé' })).toHaveCount(0)
  await expect(counter(page, 0)).toBeVisible()
  await expect(todayButton(page)).toHaveCount(0)
  expect(calendarLoads).toBe(2)
  const { squareCenter } = await gridGeometry(page)
  const emptyLegend = await legendSquareStyle(page, 'Daily non renseigné')
  expect(await squareStyleAt(page, squareCenter(LAST_COLUMN, todayWeekday))).toMatchObject({
    tag: 'SPAN',
    backgroundColor: emptyLegend?.backgroundColor,
  })
})

test('SM-8 : aucun standup, grille pleine de cases grises (CA43)', async ({ page, request }) => {
  await signInNewMarc(page, request)

  await page.goto('/')

  await expectAfterBackend(counter(page, 0)).toBeVisible()
  await expect(page.getByText(currentMonthLabel, { exact: true }).first()).toBeVisible()
  for (const dayLabel of ['Lun', 'Mer', 'Ven']) {
    await expect(page.getByText(dayLabel, { exact: true })).toBeVisible()
  }
  await expect(dayButtons(page)).toHaveCount(0)
  await expect(page.getByText(ERROR_MESSAGE)).toHaveCount(0)
  // Échantillon des jours passés : le jour même, la veille et la toute 1re case de la grille.
  const { squareCenter } = await gridGeometry(page)
  const emptyLegend = await legendSquareStyle(page, 'Daily non renseigné')
  const yesterday = yesterdayPosition()
  for (const square of [
    squareCenter(LAST_COLUMN, todayWeekday),
    squareCenter(yesterday.column, yesterday.weekday),
    squareCenter(0, 0),
  ]) {
    expect(await squareStyleAt(page, square)).toMatchObject({ tag: 'SPAN', backgroundColor: emptyLegend?.backgroundColor })
  }
})

test('SM-9 : échec de chargement, message d\'erreur et aucune case (CA43)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await postTodayStandup(page, DAILY_SUMMARY)
  // Remplace « Bloquer l'URL de requête » des devtools : seul GET /standups?from=… échoue, GET /standups/today passe.
  let calendarAttempts = 0
  await page.route(isCalendarUrl, (route) => {
    calendarAttempts += 1
    return route.abort('failed')
  })

  await page.goto('/')

  await expectAfterBackend(page.getByRole('alert').filter({ hasText: ERROR_MESSAGE })).toBeVisible()
  // 1 essai + 1 nouvelle tentative (retry: 1) avant l'erreur.
  expect(calendarAttempts).toBe(2)
  await expect(page.getByRole('status', { name: 'Chargement du calendrier' })).toHaveCount(0)
  await expect(page.getByText(/daily renseigné\(s\) sur l'année/)).toHaveCount(0)
  for (const label of ['Lun', 'Mer', 'Ven', ...MONTHS, 'Daily non renseigné', 'Daily enregistré']) {
    await expect(page.getByText(label, { exact: true })).toHaveCount(0)
  }
  await expect(dayButtons(page)).toHaveCount(0)
  await expect(doneHeading(page)).toBeVisible()
})
