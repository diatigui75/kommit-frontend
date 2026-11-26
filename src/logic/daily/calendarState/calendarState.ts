import { dailyContent } from '@/data/daily'
import { isApiError } from '@/logic/apiError/apiError'
import type { GetCalendrierResponse, Jour } from '@/types/apiContract'

export type CalendarQueryResult = {
  status: 'pending' | 'error' | 'success'
  data?: GetCalendrierResponse
  error?: unknown
}

// Succès sans jour → grille grise ; échec → message sans grille (CA43). Le compteur est celui du serveur (CA11).
export type CalendarState =
  | { kind: 'loading' }
  | { kind: 'ready'; count: number; recordedJours: Jour[] }
  | { kind: 'error'; message: string }

export function calendarStateFor(query: CalendarQueryResult): CalendarState {
  if (query.status === 'success' && query.data) {
    return { kind: 'ready', count: query.data.count, recordedJours: query.data.jours }
  }
  if (query.status === 'error') {
    return { kind: 'error', message: isApiError(query.error) ? query.error.message : dailyContent.outageMessage }
  }
  return { kind: 'loading' }
}
