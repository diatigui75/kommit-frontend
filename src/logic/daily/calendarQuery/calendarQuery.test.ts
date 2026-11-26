import { describe, expect, it } from 'vitest'
import { calendarQueryFor } from '@/logic/daily/calendarQuery/calendarQuery'

describe('calendarQueryFor — CA11 bornes de la requête du calendrier', () => {
  it("demande du premier dimanche de la fenêtre jusqu'à aujourd'hui", () => {
    const wednesday = '2026-05-13'

    expect(calendarQueryFor(wednesday)).toEqual({ from: '2025-05-11', to: '2026-05-13' })
  })

  it("demande une fenêtre qui commence le jour même 52 semaines plus tôt quand aujourd'hui est un dimanche", () => {
    const sunday = '2026-05-17'

    expect(calendarQueryFor(sunday)).toEqual({ from: '2025-05-18', to: '2026-05-17' })
  })
})

describe('calendarQueryFor — CA37 dates pièges', () => {
  it.each([
    { label: "29 mars (passage à l'heure d'été)", today: '2026-03-29', from: '2025-03-30' },
    { label: "25 octobre (passage à l'heure d'hiver)", today: '2026-10-25', from: '2025-10-26' },
    { label: '29 février', today: '2028-02-29', from: '2027-02-28' },
  ])("borne la requête sans décalage quand aujourd'hui est le $label", ({ today, from }) => {
    expect(calendarQueryFor(today)).toEqual({ from, to: today })
  })
})
