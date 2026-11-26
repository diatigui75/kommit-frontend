import type { Jour } from '@/types/apiContract'

export const WEEK_COUNT = 53
const DAYS_PER_WEEK = 7
const DAY_MS = 24 * 60 * 60 * 1000

export type CalendarDay = {
  jour: Jour
  isRecorded: boolean
}

export type MonthMarker = {
  monthIndex: number
  week: number
}

export type CalendarGrid = {
  // Une semaine par colonne, du lundi au dimanche. null = jour à venir.
  weeks: (CalendarDay | null)[][]
  months: MonthMarker[]
}

function toTime(jour: Jour): number {
  const [year, month, day] = jour.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

function toJour(time: number): Jour {
  return new Date(time).toISOString().slice(0, 10)
}

// Fenêtre glissante de 53 semaines qui se termine sur la semaine d'aujourd'hui.
export function calendarGrid(today: Jour, recordedJours: Jour[]): CalendarGrid {
  const todayTime = toTime(today)
  const todayWeekday = (new Date(todayTime).getUTCDay() + 6) % DAYS_PER_WEEK
  const firstMonday = todayTime - (todayWeekday + (WEEK_COUNT - 1) * DAYS_PER_WEEK) * DAY_MS
  const recorded = new Set(recordedJours)

  const weeks: (CalendarDay | null)[][] = []
  const months: MonthMarker[] = []

  for (let week = 0; week < WEEK_COUNT; week++) {
    const days: (CalendarDay | null)[] = []
    for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday++) {
      const time = firstMonday + (week * DAYS_PER_WEEK + weekday) * DAY_MS
      const date = new Date(time)
      if (date.getUTCDate() === 1) months.push({ monthIndex: date.getUTCMonth(), week })
      const jour = toJour(time)
      days.push(time > todayTime ? null : { jour, isRecorded: recorded.has(jour) })
    }
    weeks.push(days)
  }

  return { weeks, months }
}
