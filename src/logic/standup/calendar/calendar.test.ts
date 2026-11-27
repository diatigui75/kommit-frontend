import { describe, expect, it } from 'vitest'
import { calendarWeeksFor, parisWeekdayIndex } from '@/logic/standup/calendar/calendar'
import { buildCalendar, calendarRangeFor, calendarViewFor } from '@/logic/standup/calendar/calendar'
import type { CalendarDayView } from '@/logic/standup/calendar/calendar'

describe('calendarWeeksFor — CA6, CA25 le carré du jour dans le calendrier', () => {
  it('colore seulement le carré du jour, dans la dernière semaine', () => {
    const wednesday = 2

    const weeks = calendarWeeksFor(wednesday, true)

    expect(weeks).toHaveLength(53)
    expect(weeks[52][2]).toBe(true)
    expect(weeks.flat().filter(Boolean)).toHaveLength(1)
  })

  it('ne colore aucun carré quand le standup du jour n’est pas enregistré', () => {
    const wednesday = 2

    const weeksWithoutStandup = calendarWeeksFor(wednesday, false)

    expect(weeksWithoutStandup.flat().some(Boolean)).toBe(false)
  })
})

describe('parisWeekdayIndex — le jour se lit en Europe/Paris', () => {
  it('compte déjà le lendemain à 00h30 heure de Paris, même s’il est encore la veille en UTC', () => {
    const tuesdayHalfPastMidnightInParis = new Date('2026-11-23T23:30:00Z')

    expect(parisWeekdayIndex(tuesdayHalfPastMidnightInParis)).toBe(1)
  })
})

const ONE_DAY_MS = 24 * 60 * 60 * 1000

function nextJour(jour: string): string {
  return new Date(Date.parse(`${jour}T00:00:00Z`) + ONE_DAY_MS).toISOString().slice(0, 10)
}

function areConsecutiveDays(days: CalendarDayView[]): boolean {
  return days.every((day, index) => index === 0 || day.jour === nextJour(days[index - 1].jour))
}

describe('buildCalendar — CA11 fenêtre de 53 semaines, du dimanche au samedi', () => {
  it('construit 53 semaines de 7 jours', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, [])

    expect(weeks).toHaveLength(53)
    expect(weeks.every((week) => week.length === 7)).toBe(true)
  })

  it('commence chaque semaine un dimanche', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, [])

    expect(weeks[0]?.[0]?.jour).toBe('2025-11-23')
    expect(weeks[52]?.[0]?.jour).toBe('2026-11-22')
  })

  it("place aujourd'hui dans la dernière semaine, à son jour de la semaine", () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, [])

    expect(weeks[52]?.[5]?.jour).toBe('2026-11-27')
  })

  it('pose le libellé de chaque mois sur la 1re semaine dont le dimanche tombe dans ce mois', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { months } = buildCalendar(fridayNoonInParis, [])

    expect(months.filter((month) => month.weekIndex > 0)).toEqual([
      { label: 'déc.', weekIndex: 2 },
      { label: 'janv.', weekIndex: 6 },
      { label: 'févr.', weekIndex: 10 },
      { label: 'mars', weekIndex: 14 },
      { label: 'avr.', weekIndex: 19 },
      { label: 'mai', weekIndex: 23 },
      { label: 'juin', weekIndex: 28 },
      { label: 'juil.', weekIndex: 32 },
      { label: 'août', weekIndex: 36 },
      { label: 'sept.', weekIndex: 41 },
      { label: 'oct.', weekIndex: 45 },
      { label: 'nov.', weekIndex: 49 },
    ])
  })
})

describe('calendarRangeFor — CA11 bornes from / to de GET /standups', () => {
  it("va du dimanche de la 1re semaine jusqu'à aujourd'hui", () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    expect(calendarRangeFor(fridayNoonInParis)).toEqual({ from: '2025-11-23', to: '2026-11-27' })
  })

  it("commence 52 semaines avant le dimanche courant quand aujourd'hui est dimanche", () => {
    const sundayNoonInParis = new Date('2026-11-22T11:00:00Z')

    expect(calendarRangeFor(sundayNoonInParis)).toEqual({ from: '2025-11-23', to: '2026-11-22' })
  })

  it('lit aujourd’hui en Europe/Paris : à 00h30 à Paris, la borne haute est déjà le lendemain de la date UTC', () => {
    const halfPastMidnightInParisOnFriday = new Date('2026-11-26T23:30:00Z')

    expect(calendarRangeFor(halfPastMidnightInParisOnFriday)).toEqual({ from: '2025-11-23', to: '2026-11-27' })
  })

  it('a la même 1re journée que la grille construite au même instant', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, [])

    expect(calendarRangeFor(fridayNoonInParis).from).toBe(weeks[0]?.[0]?.jour)
  })
})

describe('calendarViewFor — CA11 le compteur du serveur affiché tel quel', () => {
  it('reprend le count du serveur sans le recalculer depuis les jours reçus', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')
    const responseWithCountDifferentFromDays = { count: 5, jours: ['2026-11-20'] }

    const calendarView = calendarViewFor(fridayNoonInParis, { response: responseWithCountDifferentFromDays, hasFailed: false })

    expect(calendarView).toMatchObject({ status: 'ready', count: 5 })
  })
})

describe('buildCalendar — CA12 un jour est vide ou renseigné', () => {
  it('marque filled les jours renseignés et empty tous les autres jours passés', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')
    const standupDays = ['2026-11-20', '2026-03-29']

    const { weeks } = buildCalendar(fridayNoonInParis, standupDays)
    const pastAndTodayDays = weeks.flat().filter((day) => day.state !== 'future')

    expect(pastAndTodayDays.filter((day) => day.state === 'filled').map((day) => day.jour)).toEqual([
      '2026-03-29',
      '2026-11-20',
    ])
    expect(pastAndTodayDays.filter((day) => day.state === 'empty')).toHaveLength(pastAndTodayDays.length - 2)
  })

  it("marque filled le jour d'aujourd'hui quand son standup est renseigné", () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, ['2026-11-27'])

    expect(weeks[52]?.[5]).toMatchObject({ jour: '2026-11-27', state: 'filled' })
  })

  it('donne à un jour renseigné sa date en toutes lettres, pour le libellé du carré', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, ['2026-11-20'])

    expect(weeks[51]?.[5]).toEqual({ jour: '2026-11-20', state: 'filled', label: 'vendredi 20 novembre 2026' })
  })
})

describe('buildCalendar — CA13 les jours futurs de la semaine en cours sont vides', () => {
  it("marque future les jours après aujourd'hui, et seulement eux", () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, [])
    const futureDays = weeks.flat().filter((day) => day.state === 'future')

    expect(futureDays.map((day) => day.jour)).toEqual(['2026-11-28'])
    expect(weeks[52]?.[5]?.state).toBe('empty')
  })

  it("lit aujourd'hui en Europe/Paris : à 00h30 à Paris (encore la veille en UTC), le jour courant n'est pas futur", () => {
    const halfPastMidnightInParisOnFriday = new Date('2026-11-26T23:30:00Z')

    const { weeks } = buildCalendar(halfPastMidnightInParisOnFriday, ['2026-11-27'])

    expect(weeks[52]?.[5]).toMatchObject({ jour: '2026-11-27', state: 'filled' })
    expect(weeks[52]?.[6]).toMatchObject({ jour: '2026-11-28', state: 'future' })
  })

  it("ne marque aucun jour futur quand aujourd'hui est samedi", () => {
    const saturdayNoonInParis = new Date('2026-11-28T11:00:00Z')

    const { weeks } = buildCalendar(saturdayNoonInParis, [])

    expect(weeks.flat().some((day) => day.state === 'future')).toBe(false)
    expect(weeks[52]?.[6]?.jour).toBe('2026-11-28')
  })

  it("marque future les 6 jours après le dimanche quand aujourd'hui est dimanche", () => {
    const sundayNoonInParis = new Date('2026-11-22T11:00:00Z')

    const { weeks } = buildCalendar(sundayNoonInParis, [])

    expect(weeks[52]?.map((day) => day.state)).toEqual(['empty', 'future', 'future', 'future', 'future', 'future', 'future'])
  })

  it("laisse future un jour après aujourd'hui même s'il figure dans les jours reçus", () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, ['2026-11-28'])

    expect(weeks[52]?.[6]).toMatchObject({ jour: '2026-11-28', state: 'future' })
  })
})

describe('buildCalendar — CA37 dates pièges sans case décalée, dupliquée ni manquante', () => {
  it.each([
    { trap: "passage à l'heure d'été, le 29 mars 2026 à 03h00 Paris", now: new Date('2026-03-29T01:30:00Z'), today: '2026-03-29', weekday: 0 },
    { trap: "passage à l'heure d'été, 00h30 Paris le 29 mars 2026", now: new Date('2026-03-28T23:30:00Z'), today: '2026-03-29', weekday: 0 },
    { trap: "passage à l'heure d'hiver, le 25 octobre 2026 à 02h30 Paris", now: new Date('2026-10-25T01:30:00Z'), today: '2026-10-25', weekday: 0 },
    { trap: "lendemain du passage à l'heure d'hiver, 00h30 Paris le 26 octobre 2026", now: new Date('2026-10-25T23:30:00Z'), today: '2026-10-26', weekday: 1 },
    { trap: 'le 29 février 2028', now: new Date('2028-02-29T11:00:00Z'), today: '2028-02-29', weekday: 2 },
    { trap: 'le 1er mars 2028, lendemain du 29 février', now: new Date('2028-03-01T11:00:00Z'), today: '2028-03-01', weekday: 3 },
  ])('construit 371 jours consécutifs et sans doublon, ancrés sur aujourd’hui ($trap)', ({ now, today, weekday }) => {
    const { weeks } = buildCalendar(now, [])
    const allDays = weeks.flat()

    expect(weeks).toHaveLength(53)
    expect(weeks.every((week) => week.length === 7)).toBe(true)
    expect(new Set(allDays.map((day) => day.jour)).size).toBe(371)
    expect(areConsecutiveDays(allDays)).toBe(true)
    expect(weeks[52]?.[weekday]?.jour).toBe(today)
  })

  it('garde 7 jours consécutifs dans les semaines qui contiennent les 2 changements d’heure', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, [])
    const springForwardWeek = weeks.find((week) => week[0]?.jour === '2026-03-29')
    const fallBackWeek = weeks.find((week) => week[0]?.jour === '2026-10-25')

    expect(springForwardWeek?.map((day) => day.jour)).toEqual([
      '2026-03-29', '2026-03-30', '2026-03-31', '2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04',
    ])
    expect(fallBackWeek?.map((day) => day.jour)).toEqual([
      '2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31',
    ])
  })

  it('place le 29 février 2028 une seule fois, entre le 28 février et le 1er mars', () => {
    const tuesdayNoonInParis = new Date('2028-03-07T11:00:00Z')

    const { weeks } = buildCalendar(tuesdayNoonInParis, ['2028-02-29'])
    const leapWeek = weeks.find((week) => week.some((day) => day.jour === '2028-02-29'))

    expect(leapWeek?.map((day) => day.jour)).toEqual([
      '2028-02-27', '2028-02-28', '2028-02-29', '2028-03-01', '2028-03-02', '2028-03-03', '2028-03-04',
    ])
    expect(weeks.flat().filter((day) => day.state === 'filled').map((day) => day.jour)).toEqual(['2028-02-29'])
  })

  it('pose le carré renseigné du jour du changement d’heure sur ce jour-là, sans décalage', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    const { weeks } = buildCalendar(fridayNoonInParis, ['2026-10-25'])

    expect(weeks.flat().filter((day) => day.state === 'filled').map((day) => day.jour)).toEqual(['2026-10-25'])
  })
})

describe('calendarViewFor — CA43 calendrier vide distinct de l’échec de chargement', () => {
  it('affiche la grille de 53 semaines sans aucun carré renseigné quand le serveur ne renvoie aucun standup', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')
    const noStandupResponse = { count: 0, jours: [] }

    const emptyCalendarView = calendarViewFor(fridayNoonInParis, { response: noStandupResponse, hasFailed: false })

    expect(emptyCalendarView).toMatchObject({ status: 'ready', count: 0 })
    const weeks = emptyCalendarView.status === 'ready' ? emptyCalendarView.weeks : []
    expect(weeks).toHaveLength(53)
    expect(weeks.flat().every((day) => day.state === 'empty' || day.state === 'future')).toBe(true)
    expect(weeks.flat().filter((day) => day.state === 'empty')).toHaveLength(370)
  })

  it('affiche l’état erreur, sans grille, quand le chargement échoue', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    expect(calendarViewFor(fridayNoonInParis, { hasFailed: true })).toEqual({ status: 'error' })
  })

  it('affiche l’état de chargement tant que la réponse n’est pas arrivée', () => {
    const fridayNoonInParis = new Date('2026-11-27T11:00:00Z')

    expect(calendarViewFor(fridayNoonInParis, { hasFailed: false })).toEqual({ status: 'loading' })
  })
})
