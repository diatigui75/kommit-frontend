import { describe, expect, it } from 'vitest'
import { calendarWeeksFor, parisWeekdayIndex } from '@/logic/standup/calendar/calendar'

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
