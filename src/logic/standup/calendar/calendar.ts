import type { GetCalendrierQuery, GetCalendrierResponse, Jour } from '@/types/apiContract'

const WEEKS = 53
const DAYS = 7
const WEEKDAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }

// Le jour se lit en Europe/Paris, comme le serveur qui impose le jour du standup (contrat, type Jour).
export function parisWeekdayIndex(date: Date): number {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Paris' }).format(date)
  return WEEKDAY_INDEX[weekday]
}

// 53 semaines de 7 jours (lundi en premier), la dernière colonne étant la semaine en cours.
export function calendarWeeksFor(todayWeekdayIndex: number, isTodayFilled: boolean): boolean[][] {
  return Array.from({ length: WEEKS }, (_, week) =>
    Array.from({ length: DAYS }, (_, day) => isTodayFilled && week === WEEKS - 1 && day === todayWeekdayIndex),
  )
}

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

export function calendarRangeFor(_now: Date): GetCalendrierQuery {
  return { from: '', to: '' }
}

export function buildCalendar(_now: Date, _standupDays: Jour[]): CalendarGrid {
  return { weeks: [], months: [] }
}

export function calendarViewFor(_now: Date, _queryState: CalendarQueryState): CalendarView {
  return { status: 'ready', count: 0, weeks: [], months: [] }
}
