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

export function summaryDialogStateFor(_query: StandupQueryResult): SummaryDialogState {
  return { kind: 'closed' }
}
