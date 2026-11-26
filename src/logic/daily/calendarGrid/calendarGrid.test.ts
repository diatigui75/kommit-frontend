import { describe, expect, it } from 'vitest'
import { calendarGrid, WEEK_COUNT } from '@/logic/daily/calendarGrid/calendarGrid'

describe('calendarGrid', () => {
  it('rend 53 semaines de 7 jours', () => {
    const wednesday = '2026-05-13'

    const { weeks } = calendarGrid(wednesday, [])

    expect(weeks).toHaveLength(WEEK_COUNT)
    expect(weeks.every((days) => days.length === 7)).toBe(true)
  })

  it("place aujourd'hui dans la dernière semaine, à son jour, et laisse vides les jours à venir", () => {
    const wednesday = '2026-05-13'

    const lastWeek = calendarGrid(wednesday, []).weeks.at(-1)

    expect(lastWeek?.[2]).toEqual({ jour: '2026-05-13', isRecorded: false })
    expect(lastWeek?.slice(3)).toEqual([null, null, null, null])
  })

  it('commence la fenêtre un lundi', () => {
    const wednesday = '2026-05-13'

    const firstDay = calendarGrid(wednesday, []).weeks[0][0]

    expect(firstDay).toEqual({ jour: '2025-05-12', isRecorded: false })
  })

  it('marque les jours renseignés', () => {
    const wednesday = '2026-05-13'
    const recordedJours = ['2026-05-11']

    const lastWeek = calendarGrid(wednesday, recordedJours).weeks.at(-1)

    expect(lastWeek?.[0]).toEqual({ jour: '2026-05-11', isRecorded: true })
  })

  it('repère la semaine où commence chaque mois', () => {
    const wednesday = '2026-05-13'

    const { months } = calendarGrid(wednesday, [])

    expect(months.at(-1)).toEqual({ monthIndex: 4, week: 50 })
  })
})
