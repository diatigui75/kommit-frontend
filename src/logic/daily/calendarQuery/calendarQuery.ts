import { firstJourOfWindow } from '@/logic/daily/calendarGrid/calendarGrid'
import type { GetCalendrierQuery, Jour } from '@/types/apiContract'

// Bornes de GET /standups : du premier jour de la grille à aujourd'hui (CA11).
export function calendarQueryFor(today: Jour): GetCalendrierQuery {
  return { from: firstJourOfWindow(today), to: today }
}
