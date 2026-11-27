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

export function isSendDisabled(_state: SendState): boolean {
  return false
}

export function isValidateDisabled(_state: ValidateState): boolean {
  return false
}
