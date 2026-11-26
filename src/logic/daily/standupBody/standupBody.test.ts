import { describe, expect, it } from 'vitest'
import { standupBodyFor } from '@/logic/daily/standupBody/standupBody'
import type { StandupSummary } from '@/types/apiContract'

describe('standupBodyFor — CA26 Valider reposte le dernier récap reçu, tel quel', () => {
  it('envoie le récap reçu sans le modifier', () => {
    const lastSummary: StandupSummary = {
      fait: ['PR auth mergée', '  Revue  du ticket '],
      blocages: ['CI rouge sur dev'],
      prevu: ['Brancher le chat'],
    }

    expect(standupBodyFor(lastSummary)).toEqual({
      summary: {
        fait: ['PR auth mergée', '  Revue  du ticket '],
        blocages: ['CI rouge sur dev'],
        prevu: ['Brancher le chat'],
      },
    })
  })

  it("n'envoie que le récap, sans date ni autre champ", () => {
    const lastSummary: StandupSummary = { fait: ['PR auth'], blocages: [], prevu: ['Chat'] }

    expect(Object.keys(standupBodyFor(lastSummary))).toEqual(['summary'])
  })

  it('envoie une catégorie vide en liste vide, jamais « Aucun » (CA10)', () => {
    const summaryWithoutBlocker: StandupSummary = { fait: ['PR auth'], blocages: [], prevu: ['Chat'] }

    expect(standupBodyFor(summaryWithoutBlocker).summary.blocages).toEqual([])
  })
})
