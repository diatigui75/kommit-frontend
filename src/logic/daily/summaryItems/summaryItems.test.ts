import { describe, expect, it } from 'vitest'
import { summaryItemsToDisplay } from '@/logic/daily/summaryItems/summaryItems'

describe('summaryItemsToDisplay — CA30 catégorie vide', () => {
  it('affiche « Aucun » pour une catégorie vide', () => {
    const emptyCategory: string[] = []

    expect(summaryItemsToDisplay(emptyCategory)).toEqual(['Aucun'])
  })

  it('affiche les items reçus, dans leur ordre, quand la catégorie en contient', () => {
    const plannedItems = ['Brancher le calendrier', 'Relire la PR']

    expect(summaryItemsToDisplay(plannedItems)).toEqual(['Brancher le calendrier', 'Relire la PR'])
  })
})

describe('summaryItemsToDisplay — CA30 résumé en texte brut', () => {
  it('rend un item contenant du HTML tel quel, sans le retirer ni le transformer', () => {
    const itemWithScriptTag = ['<script>alert(1)</script>']

    expect(summaryItemsToDisplay(itemWithScriptTag)).toEqual(['<script>alert(1)</script>'])
  })
})
