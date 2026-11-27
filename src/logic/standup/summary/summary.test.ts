import { describe, expect, it } from 'vitest'
import { standupBodyFor, summarySectionsFor } from '@/logic/standup/summary/summary'
import type { StandupSummary } from '@/types/apiContract'

describe('summarySectionsFor — CA5 le front dessine les 3 blocs du récap', () => {
  it('donne les 3 blocs Hier, Blocages, À venir, dans cet ordre, avec leurs puces', () => {
    const fullSummary: StandupSummary = {
      fait: ['Migration de l’auth', 'Correction des cookies JWT'],
      blocages: ['Accès DEV en attente'],
      prevu: ['Pousser en DEV'],
    }

    expect(summarySectionsFor(fullSummary)).toEqual([
      { label: 'Hier', lines: ['Migration de l’auth', 'Correction des cookies JWT'] },
      { label: 'Blocages', lines: ['Accès DEV en attente'] },
      { label: 'À venir', lines: ['Pousser en DEV'] },
    ])
  })
})

describe('summarySectionsFor — CA10 une catégorie vide s’affiche « Aucun »', () => {
  it('affiche « Aucun » sous une catégorie vide', () => {
    const summaryWithoutBlockers: StandupSummary = {
      fait: ['Migration de l’auth'],
      blocages: [],
      prevu: ['Pousser en DEV'],
    }

    expect(summarySectionsFor(summaryWithoutBlockers)).toEqual([
      { label: 'Hier', lines: ['Migration de l’auth'] },
      { label: 'Blocages', lines: ['Aucun'] },
      { label: 'À venir', lines: ['Pousser en DEV'] },
    ])
  })

  it('affiche « Aucun » sous chacune des 3 catégories quand toutes sont vides', () => {
    const emptySummary: StandupSummary = { fait: [], blocages: [], prevu: [] }

    expect(summarySectionsFor(emptySummary)).toEqual([
      { label: 'Hier', lines: ['Aucun'] },
      { label: 'Blocages', lines: ['Aucun'] },
      { label: 'À venir', lines: ['Aucun'] },
    ])
  })

  it('n’ajoute jamais « Aucun » dans le récap reçu', () => {
    const summaryWithoutBlockers: StandupSummary = { fait: ['Migration de l’auth'], blocages: [], prevu: [] }

    summarySectionsFor(summaryWithoutBlockers)

    expect(summaryWithoutBlockers).toEqual({ fait: ['Migration de l’auth'], blocages: [], prevu: [] })
  })
})

describe('standupBodyFor — CA26 Valider reposte le récap reçu, tel quel, sans date', () => {
  it('poste exactement le récap reçu dans l’événement summary', () => {
    const receivedSummary: StandupSummary = {
      fait: ['Migration de l’auth'],
      blocages: ['Accès DEV en attente'],
      prevu: ['Pousser en DEV'],
    }

    expect(standupBodyFor(receivedSummary)).toEqual({
      summary: { fait: ['Migration de l’auth'], blocages: ['Accès DEV en attente'], prevu: ['Pousser en DEV'] },
    })
  })

  it('garde les catégories vides en listes vides, jamais « Aucun » (CA10)', () => {
    const summaryWithoutBlockers: StandupSummary = { fait: ['Migration de l’auth'], blocages: [], prevu: [] }

    expect(standupBodyFor(summaryWithoutBlockers)).toEqual({
      summary: { fait: ['Migration de l’auth'], blocages: [], prevu: [] },
    })
  })

  it('ne porte que le récap, sans aucun champ de date', () => {
    const receivedSummary: StandupSummary = { fait: ['Migration de l’auth'], blocages: [], prevu: ['Pousser en DEV'] }

    expect(Object.keys(standupBodyFor(receivedSummary))).toEqual(['summary'])
  })
})
