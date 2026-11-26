import type { Jour } from '@/types/apiContract'

// Jour courant en Europe/Paris, le fuseau du serveur. L'horloge est injectée : la CI tourne en UTC (CA11, CA37).
export function todayInParis(_now: Date): Jour {
  return ''
}
