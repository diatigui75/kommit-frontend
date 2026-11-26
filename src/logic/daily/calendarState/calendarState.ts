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

export function calendarStateFor(_query: CalendarQueryResult): CalendarState {
  return { kind: 'loading' }
}
