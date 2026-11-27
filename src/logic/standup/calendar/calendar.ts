import { standupContent } from '@/data/standup'
import type { GetCalendrierQuery, GetCalendrierResponse, Jour } from '@/types/apiContract'

const WEEKS = 53
const DAYS = 7

export type CalendarDayView = {
  jour: Jour
  state: 'empty' | 'filled' | 'future'
  label: string
}

export type MonthLabelView = { label: string; weekIndex: number }

export type CalendarGrid = {
  weeks: CalendarDayView[][]
  months: MonthLabelView[]
}

export type CalendarView =
  | { status: 'loading' }
  | { status: 'error' }
  | ({ status: 'ready'; count: number } & CalendarGrid)

export type CalendarQueryState = {
  response?: GetCalendrierResponse
  hasFailed: boolean
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const PARIS_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' })
const DAY_LABEL = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Les jours se comptent sur des dates UTC à minuit : aucun changement d'heure ne décale ni ne duplique une case (CA37).
const toUtcMs = (jour: Jour) => Date.parse(`${jour}T00:00:00Z`)
const toJour = (utcMs: number): Jour => new Date(utcMs).toISOString().slice(0, 10)

// Aujourd'hui se lit en Europe/Paris, comme le serveur qui impose le jour du standup (contrat, type Jour).
const parisToday = (now: Date): Jour => PARIS_DAY.format(now)

// 1er dimanche de la fenêtre : 52 semaines pleines avant la semaine en cours, qui commence le dimanche (CA11).
function firstSundayMs(now: Date): number {
  const todayMs = toUtcMs(parisToday(now))
  const lastSundayMs = todayMs - new Date(todayMs).getUTCDay() * ONE_DAY_MS
  return lastSundayMs - (WEEKS - 1) * DAYS * ONE_DAY_MS
}

export function calendarRangeFor(now: Date): GetCalendrierQuery {
  return { from: toJour(firstSundayMs(now)), to: parisToday(now) }
}

export function buildCalendar(now: Date, standupDays: Jour[]): CalendarGrid {
  const today = parisToday(now)
  const filled = new Set(standupDays)
  const startMs = firstSundayMs(now)

  const weeks = Array.from({ length: WEEKS }, (_, week) =>
    Array.from({ length: DAYS }, (_, day): CalendarDayView => {
      const utcMs = startMs + (week * DAYS + day) * ONE_DAY_MS
      const jour = toJour(utcMs)
      const state = jour > today ? 'future' : filled.has(jour) ? 'filled' : 'empty'
      return { jour, state, label: DAY_LABEL.format(utcMs) }
    }),
  )

  // Un mois s'affiche sur la 1re semaine dont le dimanche tombe dans ce mois.
  const months: MonthLabelView[] = []
  weeks.forEach((week, weekIndex) => {
    const month = Number(week[0].jour.slice(5, 7)) - 1
    const previousMonth = weekIndex === 0 ? -1 : Number(weeks[weekIndex - 1][0].jour.slice(5, 7)) - 1
    if (month !== previousMonth) months.push({ label: standupContent.calendar.months[month], weekIndex })
  })

  return { weeks, months }
}

// Le compteur est celui du serveur, jamais recalculé (CA11) ; un échec ne montre aucune case (CA43).
export function calendarViewFor(now: Date, queryState: CalendarQueryState): CalendarView {
  if (queryState.hasFailed) return { status: 'error' }
  if (!queryState.response) return { status: 'loading' }

  return { status: 'ready', count: queryState.response.count, ...buildCalendar(now, queryState.response.jours) }
}
