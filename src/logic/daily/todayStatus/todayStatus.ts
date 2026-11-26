import { dailyContent } from '@/data/daily'
import { composeGreeting } from '@/logic/auth/session/session'
import type { GetTodayResponse } from '@/types/apiContract'

// Tant que l'état du jour n'est pas connu, un loader remplace le titre (CA42).
export type DailyHeading = { kind: 'loader' } | { kind: 'title'; title: string; titleAccent: string }

export function dailyHeadingFor(today: GetTodayResponse | undefined, firstName: string): DailyHeading {
  if (!today) return { kind: 'loader' }
  if (today.done) {
    return { kind: 'title', title: dailyContent.alreadyFilled.title, titleAccent: dailyContent.alreadyFilled.titleAccent }
  }
  return { kind: 'title', ...composeGreeting(firstName) }
}

// Relancer un daily déjà fait le remplacera : on prévient d'abord (CA9).
export function shouldConfirmReplacement(today: GetTodayResponse): boolean {
  return today.done
}
