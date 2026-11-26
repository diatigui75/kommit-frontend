import type { GetTodayResponse } from '@/types/apiContract'

// Tant que l'état du jour n'est pas connu, un loader remplace le titre (CA42).
export type DailyHeading = { kind: 'loader' } | { kind: 'title'; title: string; titleAccent: string }

export function dailyHeadingFor(_today: GetTodayResponse | undefined, _firstName: string): DailyHeading {
  return { kind: 'title', title: '', titleAccent: '' }
}

export function shouldConfirmReplacement(_today: GetTodayResponse): boolean {
  return false
}
