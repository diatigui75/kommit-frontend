// Le code passé à page.evaluate et addInitScript s'exécute dans le navigateur : types DOM activés pour ce fichier.
/// <reference lib="dom" />
import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, expectAfterBackend } from './support/auth.ts'
import {
  TODAY_URL,
  counter,
  createTodayStandup,
  dailyInput,
  doneHeading,
  launchButton,
  signInNewMarc,
  todoHeading,
} from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

test('SM-1 : standup du jour pas encore fait, titre avec le prénom (CA1)', async ({ page, request }) => {
  await signInNewMarc(page, request)

  await page.goto('/')

  await expectAfterBackend(todoHeading(page)).toBeVisible()
  await expect(page.getByText('Renseigne ton daily du jour ci-dessous.')).toBeVisible()
  await expect(dailyInput(page)).toBeVisible()
  await expect(launchButton(page)).toBeVisible()
  await expect(doneHeading(page)).toHaveCount(0)
  await expect(counter(page, 0)).toBeVisible()
})

test('SM-2 : standup du jour déjà fait, titre de félicitation (CA8)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await createTodayStandup(page)

  await page.goto('/')

  await expectAfterBackend(doneHeading(page)).toBeVisible()
  await expect(page.getByText("En renseignant ton daily du jour à nouveau, il remplacera l'existant.")).toBeVisible()
  await expect(todoHeading(page)).toHaveCount(0)
  await expect(dailyInput(page)).toBeVisible()
  await expect(launchButton(page)).toBeVisible()
  // Le liseré vert du carré n'a ni texte ni libellé : le compteur sert de preuve (conventions des smokes).
  await expect(counter(page, 1)).toBeVisible()
})

test('SM-3 : état du jour inconnu, loader à la place du titre (CA42)', async ({ page, request }) => {
  await signInNewMarc(page, request)
  await createTodayStandup(page)
  // Remplace le profil « Slow 3G » : GET /standups/today est retenu jusqu'aux vérifications du chargement.
  let releaseToday: () => void = () => undefined
  const todayReleased = new Promise<void>((resolve) => {
    releaseToday = resolve
  })
  await page.route(TODAY_URL, async (route) => {
    await todayReleased
    await route.continue()
  })
  // Note à chaque modification du DOM si le titre « à faire » apparaît, même un instant.
  await page.addInitScript(() => {
    const record = () => {
      if (document.body?.textContent?.includes("Qu'as-tu fait de beau aujourd'hui")) {
        Object.assign(window, { sawTodoTitle: true })
      }
    }
    new MutationObserver(record).observe(document, { childList: true, subtree: true, characterData: true })
  })

  await page.goto('/')

  await expectAfterBackend(page.getByRole('status', { name: 'Chargement du daily du jour' })).toBeVisible()
  await expect(todoHeading(page)).toHaveCount(0)
  await expect(doneHeading(page)).toHaveCount(0)
  releaseToday()
  await expectAfterBackend(doneHeading(page)).toBeVisible()
  await expect(page.getByRole('status', { name: 'Chargement du daily du jour' })).toHaveCount(0)
  expect(await page.evaluate(() => (window as unknown as { sawTodoTitle?: boolean }).sawTodoTitle ?? false)).toBe(false)
})
