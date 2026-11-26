import { describe, expect, it } from 'vitest'
import { dailyHeadingFor, shouldConfirmReplacement } from '@/logic/daily/todayStatus/todayStatus'
import type { GetTodayResponse } from '@/types/apiContract'

const fullTitleOf = (heading: ReturnType<typeof dailyHeadingFor>) =>
  heading.kind === 'title' ? `${heading.title}${heading.titleAccent}` : null

const standupOfToday = {
  id: 's1',
  jour: '2026-11-26',
  summary: { fait: ['Revue de la PR auth'], blocages: [], prevu: ['Brancher le chat'] },
}

describe('dailyHeadingFor — CA1 standup du jour pas encore fait', () => {
  it('affiche « Qu\'as-tu fait de beau aujourd\'hui, {prénom} ? » avec le prénom de la session', () => {
    const notDoneToday: GetTodayResponse = { done: false, standup: null }
    const firstName = 'Marc'

    const headingNotDone = dailyHeadingFor(notDoneToday, firstName)

    expect(headingNotDone.kind).toBe('title')
    expect(fullTitleOf(headingNotDone)).toBe("Qu'as-tu fait de beau aujourd'hui, Marc ?")
  })
})

describe('dailyHeadingFor — CA8 standup du jour déjà fait', () => {
  it('affiche « Bravo, tu as renseigné ton standup du jour ! »', () => {
    const doneToday: GetTodayResponse = { done: true, standup: standupOfToday }
    const firstName = 'Marc'

    const headingDone = dailyHeadingFor(doneToday, firstName)

    expect(headingDone.kind).toBe('title')
    expect(fullTitleOf(headingDone)).toBe('Bravo, tu as renseigné ton standup du jour !')
  })
})

describe('dailyHeadingFor — CA42 état du jour inconnu, loader à la place du titre', () => {
  it("renvoie le loader tant que l'état du jour n'est pas connu", () => {
    const unknownToday = undefined
    const firstName = 'Marc'

    expect(dailyHeadingFor(unknownToday, firstName)).toEqual({ kind: 'loader' })
  })
})

describe('shouldConfirmReplacement — CA9 alerte de remplacement si le standup du jour existe', () => {
  it("demande confirmation avant de démarrer quand le standup du jour est déjà fait", () => {
    const doneToday: GetTodayResponse = { done: true, standup: standupOfToday }

    expect(shouldConfirmReplacement(doneToday)).toBe(true)
  })

  it("démarre sans alerte quand le standup du jour n'est pas encore fait", () => {
    const notDoneToday: GetTodayResponse = { done: false, standup: null }

    expect(shouldConfirmReplacement(notDoneToday)).toBe(false)
  })
})
