import type { ApiError, StandupSummary } from '@/types/apiContract'

export type SendState = {
  text: string
  isStreaming: boolean
}

export type ValidateState = {
  summary: StandupSummary | null
  isSaving: boolean
  streamError: ApiError | null
}

// Jamais 2 flux concurrents dans le même fil (CA40), jamais de message blanc (CA39).
export function isSendDisabled(state: SendState): boolean {
  return state.isStreaming || state.text.trim() === ''
}

// Un récap non conforme ne doit jamais pouvoir être validé (CA32).
export function isValidateDisabled(state: ValidateState): boolean {
  return state.summary === null || state.isSaving || state.streamError?.code === 'SUMMARY_MALFORMED'
}
