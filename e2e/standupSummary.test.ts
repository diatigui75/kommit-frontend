import { expect, test } from '@playwright/test'
import { BACKEND_TEST_TIMEOUT, expectAfterBackend } from './support/auth.ts'
import {
  chatDialog,
  fulfillSse,
  launchDaily,
  mockConversation,
  signInNewMarc,
  summaryIntro,
  todoHeading,
  tokens,
} from './support/standup.ts'

test.describe.configure({ timeout: BACKEND_TEST_TIMEOUT })

const HTML_TEXT =
  "Hier j'ai corrigé le composant <b>Navbar</b> et testé <script>alert('xss')</script>. Aucun blocage. Demain je commence le calendrier."
const HTML_ITEM = "Corrigé le composant <b>Navbar</b> et testé <script>alert('xss')</script>"

// Le vrai LLM peut retirer les balises du récap : le `summary` est injecté pour que la partie récap soit concluante (SM-8).
test('SM-8 : HTML dans le récap, rendu en texte brut (CA30)', async ({ page, request }) => {
  const browserDialogs: string[] = []
  page.on('dialog', (dialog) => {
    browserDialogs.push(dialog.message())
    void dialog.dismiss()
  })
  await mockConversation(page, [
    (route) =>
      fulfillSse(route, [
        ...tokens('Merci, voici ton récap.'),
        { type: 'summary', summary: { fait: [HTML_ITEM], blocages: [], prevu: ['Commencer le calendrier'] } },
      ]),
  ])
  await signInNewMarc(page, request)
  await page.goto('/')
  await expectAfterBackend(todoHeading(page)).toBeVisible()

  await launchDaily(page, HTML_TEXT)

  await expect(summaryIntro(page)).toBeVisible()
  // Le texte exact, balises comprises : si React l'avait interprété en HTML, `<b>` et `<script>` auraient disparu du texte.
  await expect(chatDialog(page).getByText(HTML_TEXT, { exact: true })).toBeVisible()
  await expect(chatDialog(page).getByRole('listitem').filter({ hasText: HTML_ITEM })).toHaveText(HTML_ITEM)
  expect(browserDialogs).toEqual([])
})
