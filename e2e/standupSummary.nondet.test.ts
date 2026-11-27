import { expect, test } from '@playwright/test'
import { countPosts, expectAfterBackend, holdPost } from './support/auth.ts'
import {
  LLM_TEST_TIMEOUT,
  STANDUPS_URL,
  chatDialog,
  counter,
  dailyInput,
  doneHeading,
  quitConfirm,
  reachSummary,
  signInNewMarc,
  todoHeading,
  validateButton,
} from './support/standup.ts'

// Le récap n'arrive qu'après plusieurs tours de Groq.
test.describe.configure({ timeout: LLM_TEST_TIMEOUT })

test.beforeEach(async ({ page, request }) => {
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()
})

test('SM-7 : récap en 3 blocs, « Aucun » pour les blocages (CA5, CA10)', async ({ page }) => {
  await reachSummary(page)

  const recap = chatDialog(page)
  await expect(recap.getByRole('heading', { level: 3 })).toHaveText(['Hier', 'Blocages', 'À venir'])
  // Listes dans l'ordre des titres : Hier, Blocages, À venir.
  const lists = recap.getByRole('list')
  await expect(lists).toHaveCount(3)
  await expect(lists.nth(0).getByRole('listitem').filter({ hasText: /connexion/i }).first()).toBeVisible()
  await expect(lists.nth(1).getByRole('listitem'), "l'IA a produit un blocage : smoke non concluant, à rejouer").toHaveText(['Aucun'])
  await expect(lists.nth(2).getByRole('listitem').filter({ hasText: /calendrier/i }).first()).toBeVisible()
  // Seul champ de la modale : la saisie du message, rien d'éditable dans le récap.
  await expect(recap.getByRole('textbox')).toHaveCount(1)
  await expect(validateButton(page)).toBeVisible()
  await expect(page.getByRole('button', { name: "Non, j'aimerais ajouter une info." })).toBeVisible()
})

test('SM-9 : validation du récap, modale fermée et carré du jour vert (CA6, CA25)', async ({ page }) => {
  await expect(counter(page, 0)).toBeVisible()
  const beforeSummary = async () => {
    await expect(validateButton(page)).toHaveCount(0)
    await expect(counter(page, 0)).toBeVisible()
  }
  await reachSummary(page, beforeSummary)
  await expect(counter(page, 0)).toBeVisible()

  await validateButton(page).click()

  await expectAfterBackend(chatDialog(page)).toHaveCount(0)
  await expect(quitConfirm(page)).toHaveCount(0)
  await expectAfterBackend(counter(page, 1)).toBeVisible()
  await expectAfterBackend(doneHeading(page)).toBeVisible()
  await expect(dailyInput(page)).toBeVisible()
})

test('SM-10 : double-clic sur « Oui, je valide le daily », un seul enregistrement (CA27)', async ({ page }) => {
  await reachSummary(page)
  // Remplace le profil « Slow 3G » : le POST est retenu pour observer le bouton pendant la requête.
  const releaseSave = await holdPost(page, STANDUPS_URL)
  const standupPosts = countPosts(page, STANDUPS_URL)

  await validateButton(page).dblclick()

  await expect(validateButton(page)).toBeDisabled()
  releaseSave()
  await expectAfterBackend(chatDialog(page)).toHaveCount(0)
  await expectAfterBackend(counter(page, 1)).toBeVisible()
  expect(standupPosts()).toBe(1)
})
