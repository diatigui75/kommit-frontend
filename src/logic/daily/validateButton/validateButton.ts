import type { StandupSummary } from '@/types/apiContract'

export type ValidateButtonState = {
  summary: StandupSummary | null
  isSaving: boolean
}

// Actif dès qu'un récap est reçu (CA6, CA25), inactif pendant l'enregistrement (CA27).
export function isValidateDisabled(state: ValidateButtonState): boolean {
  return state.summary === null || state.isSaving
}
