import { describe, expect, it } from 'vitest'
import { isValidateDisabled } from '@/logic/daily/validateButton/validateButton'
import type { StandupSummary } from '@/types/apiContract'

const receivedSummary: StandupSummary = { fait: ['PR auth'], blocages: [], prevu: ['Chat'] }

describe('isValidateDisabled — CA6, CA25 « Valider mon standup » actif seulement après le summary', () => {
  it("désactive le bouton tant que l'événement summary n'est pas arrivé", () => {
    const stateBeforeSummary = { summary: null, isSaving: false }

    expect(isValidateDisabled(stateBeforeSummary)).toBe(true)
  })

  it("active le bouton dès que l'événement summary est reçu", () => {
    const stateWithSummary = { summary: receivedSummary, isSaving: false }

    expect(isValidateDisabled(stateWithSummary)).toBe(false)
  })

  it('active le bouton avec un récap dont les 3 catégories sont vides', () => {
    const emptySummary: StandupSummary = { fait: [], blocages: [], prevu: [] }
    const stateWithEmptySummary = { summary: emptySummary, isSaving: false }

    expect(isValidateDisabled(stateWithEmptySummary)).toBe(false)
  })
})

describe('isValidateDisabled — CA27 re-clic ignoré pendant l\'enregistrement', () => {
  it("désactive le bouton tant que le serveur n'a pas répondu", () => {
    const stateWhileSaving = { summary: receivedSummary, isSaving: true }

    expect(isValidateDisabled(stateWhileSaving)).toBe(true)
  })
})

describe('isValidateDisabled — CA32 SUMMARY_MALFORMED ne laisse jamais valider', () => {
  it("garde le bouton désactivé quand le flux s'est arrêté sur SUMMARY_MALFORMED, sans récap", () => {
    const stateAfterMalformedSummary = { summary: null, isSaving: false }

    expect(isValidateDisabled(stateAfterMalformedSummary)).toBe(true)
  })
})
