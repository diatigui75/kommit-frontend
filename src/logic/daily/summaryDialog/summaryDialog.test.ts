import { describe, expect, it } from 'vitest'
import { summaryDialogStateFor } from '@/logic/daily/summaryDialog/summaryDialog'
import type { ApiError, Standup } from '@/types/apiContract'

const standupOfMay11: Standup = {
  id: 'standup-1',
  jour: '2026-05-11',
  summary: { fait: ['Revue de la PR auth'], blocages: [], prevu: ['Brancher le calendrier'] },
}

describe('summaryDialogStateFor — aucune case ouverte', () => {
  it("garde la modale fermée tant qu'aucun jour n'est sélectionné", () => {
    const noSelectedJour = null

    expect(summaryDialogStateFor({ selectedJour: noSelectedJour, status: 'pending' })).toEqual({ kind: 'closed' })
  })
})

describe('summaryDialogStateFor — CA46 état de chargement du résumé', () => {
  it('affiche le chargement pendant que le résumé est demandé au serveur', () => {
    const clickedJour = '2026-05-11'

    expect(summaryDialogStateFor({ selectedJour: clickedJour, status: 'pending' })).toEqual({ kind: 'loading' })
  })

  it('affiche le résumé reçu une fois la requête terminée', () => {
    const clickedJour = '2026-05-11'

    expect(summaryDialogStateFor({ selectedJour: clickedJour, status: 'success', data: standupOfMay11 })).toEqual({
      kind: 'summary',
      standup: standupOfMay11,
    })
  })
})

describe("summaryDialogStateFor — CA45 standup disparu, message et calendrier rafraîchi", () => {
  it('n’ouvre pas de modale, affiche le message du serveur et demande le rafraîchissement du calendrier', () => {
    const clickedJour = '2026-05-11'
    const standupNotFound: ApiError = { code: 'STANDUP_NOT_FOUND', message: "Ce standup n'existe plus" }

    expect(summaryDialogStateFor({ selectedJour: clickedJour, status: 'error', error: standupNotFound })).toEqual({
      kind: 'standupGone',
      message: "Ce standup n'existe plus",
      shouldRefreshCalendar: true,
    })
  })
})
