import type { Jour } from '@/types/apiContract'

const parisDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// Jour courant en Europe/Paris, le fuseau du serveur. L'horloge est injectée : la CI tourne en UTC (CA11, CA37).
export function todayInParis(now: Date): Jour {
  return parisDateFormat.format(now)
}
