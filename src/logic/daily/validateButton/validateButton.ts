import type { StandupSummary } from '@/types/apiContract'

export type ValidateButtonState = {
  summary: StandupSummary | null
  isSaving: boolean
}

export function isValidateDisabled(_state: ValidateButtonState): boolean {
  return false
}
