import { describe, expect, it } from 'vitest'
import { calendarGrid, WEEK_COUNT, type CalendarGrid } from '@/logic/daily/calendarGrid/calendarGrid'

const DAYS_IN_FULL_WEEKS = (WEEK_COUNT - 1) * 7

const filledJours = ({ weeks }: CalendarGrid) =>
  weeks.flat().flatMap((day) => (day === null ? [] : [day.jour]))

describe('calendarGrid — CA11 fenêtre de 53 semaines commençant le dimanche', () => {
  it('rend 53 semaines de 7 jours', () => {
    const wednesday = '2026-05-13'

    const { weeks } = calendarGrid(wednesday, [])

    expect(weeks).toHaveLength(WEEK_COUNT)
    expect(weeks.every((days) => days.length === 7)).toBe(true)
  })

  it('commence la fenêtre le dimanche, 52 semaines avant celui de la semaine en cours', () => {
    const wednesday = '2026-05-13'

    const firstDay = calendarGrid(wednesday, []).weeks[0][0]

    expect(firstDay).toEqual({ jour: '2025-05-11', isRecorded: false })
  })

  it('ouvre la dernière semaine sur le dimanche de la semaine en cours', () => {
    const wednesday = '2026-05-13'

    const lastWeek = calendarGrid(wednesday, []).weeks.at(-1)

    expect(lastWeek?.[0]).toEqual({ jour: '2026-05-10', isRecorded: false })
  })

  it('repère la semaine où commence chaque mois', () => {
    const wednesday = '2026-05-13'

    const { months } = calendarGrid(wednesday, [])

    expect(months.at(-1)).toEqual({ monthIndex: 4, week: 50 })
  })
})

describe('calendarGrid — CA12 jour renvoyé par le serveur, case renseignée', () => {
  it('marque les jours renseignés', () => {
    const wednesday = '2026-05-13'
    const recordedJours = ['2026-05-11']

    const lastWeek = calendarGrid(wednesday, recordedJours).weeks.at(-1)

    expect(lastWeek?.[1]).toEqual({ jour: '2026-05-11', isRecorded: true })
  })

  it('laisse non renseigné un jour absent de la réponse', () => {
    const wednesday = '2026-05-13'
    const recordedJours = ['2026-05-11']

    const lastWeek = calendarGrid(wednesday, recordedJours).weeks.at(-1)

    expect(lastWeek?.[2]).toEqual({ jour: '2026-05-12', isRecorded: false })
  })
})

describe('calendarGrid — CA43 réponse sans jour, grille pleine de cases grises', () => {
  it("rend toutes les cases jusqu'à aujourd'hui, aucune renseignée", () => {
    const wednesday = '2026-05-13'
    const noRecordedJours: string[] = []

    const days = calendarGrid(wednesday, noRecordedJours).weeks.flat().filter((day) => day !== null)

    expect(days).toHaveLength(DAYS_IN_FULL_WEEKS + 4)
    expect(days.every((day) => !day.isRecorded)).toBe(true)
  })
})

describe('calendarGrid — CA13 jours futurs de la semaine en cours vides', () => {
  it("place aujourd'hui dans la dernière semaine, à son jour, et laisse vides les jours à venir", () => {
    const wednesday = '2026-05-13'

    const lastWeek = calendarGrid(wednesday, []).weeks.at(-1)

    expect(lastWeek?.[3]).toEqual({ jour: '2026-05-13', isRecorded: false })
    expect(lastWeek?.slice(4)).toEqual([null, null, null])
  })

  it("ne laisse aucun jour vide quand aujourd'hui est un samedi", () => {
    const saturday = '2026-05-16'

    const lastWeek = calendarGrid(saturday, []).weeks.at(-1)

    expect(lastWeek?.[6]).toEqual({ jour: '2026-05-16', isRecorded: false })
    expect(lastWeek?.includes(null)).toBe(false)
  })

  it("laisse vides les 6 jours suivants quand aujourd'hui est un dimanche", () => {
    const sunday = '2026-05-17'

    const lastWeek = calendarGrid(sunday, []).weeks.at(-1)

    expect(lastWeek?.[0]).toEqual({ jour: '2026-05-17', isRecorded: false })
    expect(lastWeek?.slice(1)).toEqual([null, null, null, null, null, null])
  })
})

describe('calendarGrid — CA37 dates pièges, aucune case décalée, dupliquée ni manquante', () => {
  it("aujourd'hui le 29 mars (passage à l'heure d'été) : la fenêtre se termine sur ce dimanche", () => {
    const daylightSavingStart = '2026-03-29'

    const grid = calendarGrid(daylightSavingStart, [])

    expect(grid.weeks[0][0]).toEqual({ jour: '2025-03-30', isRecorded: false })
    expect(grid.weeks.at(-1)).toEqual([{ jour: '2026-03-29', isRecorded: false }, null, null, null, null, null, null])
  })

  it("aujourd'hui le 25 octobre (passage à l'heure d'hiver) : la fenêtre se termine sur ce dimanche", () => {
    const daylightSavingEnd = '2026-10-25'

    const grid = calendarGrid(daylightSavingEnd, [])

    expect(grid.weeks[0][0]).toEqual({ jour: '2025-10-26', isRecorded: false })
    expect(grid.weeks.at(-1)).toEqual([{ jour: '2026-10-25', isRecorded: false }, null, null, null, null, null, null])
  })

  it("aujourd'hui le 29 février : il est à sa place de mardi et la fenêtre commence le bon dimanche", () => {
    const leapDay = '2028-02-29'

    const grid = calendarGrid(leapDay, [])

    expect(grid.weeks[0][0]).toEqual({ jour: '2027-02-28', isRecorded: false })
    expect(grid.weeks.at(-1)?.[2]).toEqual({ jour: '2028-02-29', isRecorded: false })
    expect(grid.weeks.at(-1)?.slice(3)).toEqual([null, null, null, null])
  })

  it('pose le 29 mars et le 25 octobre sur un dimanche, sans trou ni doublon autour', () => {
    const thursdayAfterBothChanges = '2026-11-26'
    const recordedJours = ['2026-03-28', '2026-03-29', '2026-03-30', '2026-10-24', '2026-10-25', '2026-10-26']

    const { weeks } = calendarGrid(thursdayAfterBothChanges, recordedJours)

    expect(weeks[17][6]).toEqual({ jour: '2026-03-28', isRecorded: true })
    expect(weeks[18][0]).toEqual({ jour: '2026-03-29', isRecorded: true })
    expect(weeks[18][1]).toEqual({ jour: '2026-03-30', isRecorded: true })
    expect(weeks[47][6]).toEqual({ jour: '2026-10-24', isRecorded: true })
    expect(weeks[48][0]).toEqual({ jour: '2026-10-25', isRecorded: true })
    expect(weeks[48][1]).toEqual({ jour: '2026-10-26', isRecorded: true })
  })

  it('pose le 29 février sur un mardi, entre le 28 février et le 1er mars', () => {
    const wednesdayAfterLeapDay = '2028-11-15'
    const recordedJours = ['2028-02-28', '2028-02-29', '2028-03-01']

    const { weeks } = calendarGrid(wednesdayAfterLeapDay, recordedJours)

    expect(weeks[15].slice(1, 4)).toEqual([
      { jour: '2028-02-28', isRecorded: true },
      { jour: '2028-02-29', isRecorded: true },
      { jour: '2028-03-01', isRecorded: true },
    ])
  })

  it.each([
    { label: 'les 2 changements d’heure de 2026', today: '2026-11-26', firstJour: '2025-11-23', filledInLastWeek: 5 },
    { label: 'le 29 février 2028', today: '2028-11-15', firstJour: '2027-11-14', filledInLastWeek: 4 },
  ])('sur une fenêtre contenant $label, chaque jour apparaît une seule fois, dans l’ordre', ({ today, firstJour, filledInLastWeek }) => {
    const expectedDayCount = DAYS_IN_FULL_WEEKS + filledInLastWeek

    const jours = filledJours(calendarGrid(today, []))

    expect(jours).toHaveLength(expectedDayCount)
    expect(new Set(jours).size).toBe(expectedDayCount)
    expect(jours).toEqual([...jours].sort())
    expect(jours[0]).toBe(firstJour)
    expect(jours.at(-1)).toBe(today)
  })
})
