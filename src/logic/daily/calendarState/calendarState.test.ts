import { describe, expect, it } from 'vitest'
import { calendarStateFor } from '@/logic/daily/calendarState/calendarState'
import type { ApiError } from '@/types/apiContract'

describe('calendarStateFor — CA11 compteur renvoyé par le serveur, jamais recalculé', () => {
  it('rend les jours renseignés et le compteur du serveur', () => {
    const calendarResponse = { count: 2, jours: ['2026-05-11', '2026-05-12'] }

    expect(calendarStateFor({ status: 'success', data: calendarResponse })).toEqual({
      kind: 'ready',
      count: 2,
      recordedJours: ['2026-05-11', '2026-05-12'],
    })
  })

  it('garde le compteur du serveur même quand il diffère du nombre de jours reçus', () => {
    const countDifferentFromJours = { count: 5, jours: ['2026-05-11'] }

    expect(calendarStateFor({ status: 'success', data: countDifferentFromJours })).toEqual({
      kind: 'ready',
      count: 5,
      recordedJours: ['2026-05-11'],
    })
  })
})

describe('calendarStateFor — CA43 échec distinct du calendrier vide', () => {
  it('affiche la grille, sans jour renseigné, quand le serveur répond sans standup', () => {
    const emptyCalendarResponse = { count: 0, jours: [] }

    expect(calendarStateFor({ status: 'success', data: emptyCalendarResponse })).toEqual({
      kind: 'ready',
      count: 0,
      recordedJours: [],
    })
  })

  it("n'affiche pas la grille mais le message du serveur quand le chargement échoue", () => {
    const serverFailure: ApiError = { code: 'INTERNAL_ERROR', message: 'Une erreur est survenue côté serveur' }

    expect(calendarStateFor({ status: 'error', error: serverFailure })).toEqual({
      kind: 'error',
      message: 'Une erreur est survenue côté serveur',
    })
  })

  it("n'affiche pas la grille mais un message non vide quand le serveur est injoignable", () => {
    const unreachableServer = new Error('Le serveur ne répond pas.')

    const calendarState = calendarStateFor({ status: 'error', error: unreachableServer })

    expect(calendarState.kind).toBe('error')
    expect(calendarState.kind === 'error' && calendarState.message.trim()).not.toBe('')
  })
})
