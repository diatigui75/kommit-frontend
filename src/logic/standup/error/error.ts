import type { ApiError } from '@/types/apiContract'

export type StandupErrorDisplay = {
  kind: 'business' | 'outage'
  message: string
}

const OUTAGE_CODES: ApiError['code'][] = ['LLM_QUOTA_EXCEEDED', 'LLM_UNAVAILABLE', 'INTERNAL_ERROR']

// Les pannes de l'IA et du serveur sont distinctes des erreurs métier (CA31, CA32) ; le message du serveur s'affiche tel quel.
export function standupErrorDisplayFor(error: ApiError): StandupErrorDisplay {
  return { kind: OUTAGE_CODES.includes(error.code) ? 'outage' : 'business', message: error.message }
}

export type SummaryLoadErrorReaction = {
  message: string
  shouldCloseDialog: boolean
  shouldRefreshCalendar: boolean
}

export function summaryLoadErrorFor(_error: ApiError): SummaryLoadErrorReaction {
  return { message: '', shouldCloseDialog: false, shouldRefreshCalendar: false }
}
