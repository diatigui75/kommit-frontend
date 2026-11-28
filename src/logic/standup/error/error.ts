import { standupContent } from '@/data/standup'
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

// Un standup disparu ne laisse jamais de modale vide : on l'annonce et le calendrier se recharge (CA45).
export function summaryLoadErrorFor(error: ApiError): SummaryLoadErrorReaction {
  if (error.code === 'STANDUP_NOT_FOUND') {
    return { message: standupContent.summaryDialog.notFoundMessage, shouldCloseDialog: true, shouldRefreshCalendar: true }
  }

  return { message: error.message, shouldCloseDialog: true, shouldRefreshCalendar: false }
}

// Le backend répond 401 sans corps quand la session a expiré : ce n'est pas une panne du serveur.
export function isSessionExpired(error: unknown): boolean {
  return error !== null && typeof error === 'object' && 'status' in error && error.status === 401
}
