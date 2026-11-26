import { describe, expect, it } from 'vitest'
import { todayInParis } from '@/logic/daily/today/today'

describe("todayInParis — CA11 « aujourd'hui » calculé en Europe/Paris depuis l'horloge injectée", () => {
  it('rend le jour de Paris en pleine journée', () => {
    const middayInParis = new Date('2026-05-13T10:00:00Z')

    expect(todayInParis(middayInParis)).toBe('2026-05-13')
  })

  it("passe au lendemain à 00h30 heure d'été de Paris, quand il est encore la veille en UTC", () => {
    const halfPastMidnightSummer = new Date('2026-05-13T22:30:00Z')

    expect(todayInParis(halfPastMidnightSummer)).toBe('2026-05-14')
  })

  it("passe au lendemain à 00h30 heure d'hiver de Paris, quand il est encore la veille en UTC", () => {
    const halfPastMidnightWinter = new Date('2026-01-15T23:30:00Z')

    expect(todayInParis(halfPastMidnightWinter)).toBe('2026-01-16')
  })

  it("reste sur la veille à 23h59 heure d'hiver de Paris", () => {
    const lastSecondOfWinterDay = new Date('2026-01-15T22:59:59Z')

    expect(todayInParis(lastSecondOfWinterDay)).toBe('2026-01-15')
  })
})

describe("todayInParis — CA37 changement d'heure du 29 mars", () => {
  it('rend le 29 mars à 00h30, avant le changement', () => {
    const halfPastMidnightBeforeChange = new Date('2026-03-28T23:30:00Z')

    expect(todayInParis(halfPastMidnightBeforeChange)).toBe('2026-03-29')
  })

  it('rend encore le 28 mars à 23h59 la veille', () => {
    const lastSecondBeforeChangeDay = new Date('2026-03-28T22:59:59Z')

    expect(todayInParis(lastSecondBeforeChangeDay)).toBe('2026-03-28')
  })

  it("rend encore le 29 mars à 23h59, à l'heure d'été", () => {
    const lastSecondOfChangeDay = new Date('2026-03-29T21:59:59Z')

    expect(todayInParis(lastSecondOfChangeDay)).toBe('2026-03-29')
  })

  it("rend le 30 mars à 00h30, à l'heure d'été", () => {
    const halfPastMidnightAfterChange = new Date('2026-03-29T22:30:00Z')

    expect(todayInParis(halfPastMidnightAfterChange)).toBe('2026-03-30')
  })
})

describe("todayInParis — CA37 changement d'heure du 25 octobre", () => {
  it("rend le 25 octobre à 00h30, encore à l'heure d'été", () => {
    const halfPastMidnightBeforeChange = new Date('2026-10-24T22:30:00Z')

    expect(todayInParis(halfPastMidnightBeforeChange)).toBe('2026-10-25')
  })

  it('rend encore le 24 octobre à 23h59 la veille', () => {
    const lastSecondBeforeChangeDay = new Date('2026-10-24T21:59:59Z')

    expect(todayInParis(lastSecondBeforeChangeDay)).toBe('2026-10-24')
  })

  it("rend encore le 25 octobre à 23h59, à l'heure d'hiver", () => {
    const lastSecondOfChangeDay = new Date('2026-10-25T22:59:59Z')

    expect(todayInParis(lastSecondOfChangeDay)).toBe('2026-10-25')
  })

  it("rend le 26 octobre à 00h30, à l'heure d'hiver", () => {
    const halfPastMidnightAfterChange = new Date('2026-10-25T23:30:00Z')

    expect(todayInParis(halfPastMidnightAfterChange)).toBe('2026-10-26')
  })
})

describe('todayInParis — CA37 29 février', () => {
  it('rend le 29 février à 00h30', () => {
    const halfPastMidnightLeapDay = new Date('2028-02-28T23:30:00Z')

    expect(todayInParis(halfPastMidnightLeapDay)).toBe('2028-02-29')
  })

  it('rend encore le 29 février à 23h59', () => {
    const lastSecondOfLeapDay = new Date('2028-02-29T22:59:59Z')

    expect(todayInParis(lastSecondOfLeapDay)).toBe('2028-02-29')
  })

  it('rend le 1er mars à 00h30 le lendemain', () => {
    const halfPastMidnightAfterLeapDay = new Date('2028-02-29T23:30:00Z')

    expect(todayInParis(halfPastMidnightAfterLeapDay)).toBe('2028-03-01')
  })
})
