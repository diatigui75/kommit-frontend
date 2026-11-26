import { describe, expect, it } from 'vitest'
import { summaryBlocksFor } from '@/logic/daily/summaryBlocks/summaryBlocks'
import type { StandupSummary } from '@/types/apiContract'

describe('summaryBlocksFor — CA5 le front dessine les 3 blocs du récap', () => {
  it('produit HIER, BLOCAGES et À VENIR dans cet ordre, avec leurs items', () => {
    const fullSummary: StandupSummary = {
      fait: ['PR auth mergée', 'Revue du ticket KOM-19'],
      blocages: ['CI rouge sur dev'],
      prevu: ['Brancher le chat'],
    }

    expect(summaryBlocksFor(fullSummary)).toEqual([
      { category: 'fait', label: 'Hier', lines: ['PR auth mergée', 'Revue du ticket KOM-19'], isEmpty: false },
      { category: 'blocages', label: 'Blocages', lines: ['CI rouge sur dev'], isEmpty: false },
      { category: 'prevu', label: 'À venir', lines: ['Brancher le chat'], isEmpty: false },
    ])
  })

  it('reprend un item contenant du HTML tel quel, sans le transformer', () => {
    const summaryWithHtml: StandupSummary = { fait: ['<script>alert(1)</script>'], blocages: [], prevu: [] }

    expect(summaryBlocksFor(summaryWithHtml).map((block) => block.lines)).toEqual([
      ['<script>alert(1)</script>'],
      ['Aucun'],
      ['Aucun'],
    ])
  })
})

describe('summaryBlocksFor — CA10 une catégorie vide s\'affiche « Aucun »', () => {
  it('affiche « Aucun » pour la catégorie vide et garde les autres', () => {
    const summaryWithoutBlocker: StandupSummary = { fait: ['PR auth mergée'], blocages: [], prevu: ['Brancher le chat'] }

    expect(summaryBlocksFor(summaryWithoutBlocker)[1]).toEqual({
      category: 'blocages',
      label: 'Blocages',
      lines: ['Aucun'],
      isEmpty: true,
    })
  })

  it('affiche « Aucun » dans les 3 blocs quand tout est vide', () => {
    const emptySummary: StandupSummary = { fait: [], blocages: [], prevu: [] }

    expect(summaryBlocksFor(emptySummary).map((block) => block.lines)).toEqual([['Aucun'], ['Aucun'], ['Aucun']])
  })

  it("n'ajoute jamais « Aucun » au récap reçu", () => {
    const emptySummary: StandupSummary = { fait: [], blocages: [], prevu: [] }

    summaryBlocksFor(emptySummary)

    expect(emptySummary).toEqual({ fait: [], blocages: [], prevu: [] })
  })
})
