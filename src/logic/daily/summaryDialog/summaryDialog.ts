import { dailyContent } from '@/data/daily'
import { isApiError } from '@/logic/auth/error/error'
import type { Jour, Standup } from '@/types/apiContract'

export type StandupQueryResult = {
  selectedJour: Jour | null
  status: 'pending' | 'error' | 'success'
  data?: Standup
  error?: unknown
}

// Chargement pendant la requête (CA46). Standup disparu : pas de modale, message et calendrier à rafraîchir (CA45).
export type SummaryDialogState =
  | { kind: 'closed' }
  | { kind: 'loading' }
  | { kind: 'summary'; standup: Standup }
  | { kind: 'standupGone'; message: string; shouldRefreshCalendar: true }

export function summaryDialogStateFor(query: StandupQueryResult): SummaryDialogState {
  if (query.selectedJour === null) return { kind: 'closed' }
  if (query.status === 'success' && query.data) return { kind: 'summary', standup: query.data }
  if (query.status === 'error') {
    const message = isApiError(query.error) ? query.error.message : dailyContent.outageMessage
    return { kind: 'standupGone', message, shouldRefreshCalendar: true }
  }
  return { kind: 'loading' }
}
