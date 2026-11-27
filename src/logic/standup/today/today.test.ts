import { describe, expect, it } from 'vitest'
import { hasTodayStandup, homeHeadingFor, isTodaySquareFilled } from '@/logic/standup/today/today'
import type { GetTodayResponse } from '@/types/apiContract'

const todayNotDone: GetTodayResponse = { done: false, standup: null }

const todayDone: GetTodayResponse = {
  done: true,
  standup: {
    id: 'standup-1',
    jour: '2026-11-27',
    summary: { fait: ['Migration de l’auth'], blocages: [], prevu: ['Pousser en DEV'] },
  },
}

describe('homeHeadingFor — CA1, CA8 titre selon l’état du jour', () => {
  it('donne le titre « à faire » avec le prénom quand le standup du jour n’est pas fait', () => {
    const firstName = 'Marc'

    expect(homeHeadingFor(todayNotDone, firstName)).toEqual({
      status: 'toDo',
      title: "Qu'as-tu fait de beau aujourd'hui, ",
      titleAccent: 'Marc ?',
    })
  })

  it('donne le titre « déjà fait » quand le standup du jour est enregistré', () => {
    const firstName = 'Marc'

    expect(homeHeadingFor(todayDone, firstName)).toEqual({
      status: 'done',
      title: 'Bravo, tu as renseigné ton standup du jour !',
    })
  })
})

describe('homeHeadingFor — CA42 pas de titre tant que l’état du jour est inconnu', () => {
  it('renvoie l’état de chargement, sans aucun titre, quand l’état du jour n’est pas encore arrivé', () => {
    const unknownToday = undefined

    expect(homeHeadingFor(unknownToday, 'Marc')).toEqual({ status: 'loading' })
  })
})

describe('hasTodayStandup — CA9 standup existe pour aujourd’hui (alerte de remplacement)', () => {
  it('vaut true quand le standup du jour est déjà fait, ce qui déclenche l’alerte avant de démarrer', () => {
    const doneToday = todayDone

    expect(hasTodayStandup(doneToday)).toBe(true)
  })

  it('vaut false quand le standup du jour n’est pas fait, la conversation démarre directement', () => {
    const notDoneToday = todayNotDone

    expect(hasTodayStandup(notDoneToday)).toBe(false)
  })
})

describe('isTodaySquareFilled — CA6, CA25 le carré du jour ne passe au vert qu’une fois la modale fermée', () => {
  it('reste vide tant que la modale est ouverte, même après l’enregistrement', () => {
    const savedButStillOpen = { wasDoneBeforeOpening: false, isSavedDuringConversation: true, isConversationOpen: true }

    expect(isTodaySquareFilled(savedButStillOpen)).toBe(false)
  })

  it('passe au vert une fois le standup enregistré et la modale fermée', () => {
    const savedAndClosed = { wasDoneBeforeOpening: false, isSavedDuringConversation: true, isConversationOpen: false }

    expect(isTodaySquareFilled(savedAndClosed)).toBe(true)
  })

  it('reste vide quand la modale est fermée sans enregistrement et qu’aucun standup n’existait', () => {
    const closedWithoutSaving = { wasDoneBeforeOpening: false, isSavedDuringConversation: false, isConversationOpen: false }

    expect(isTodaySquareFilled(closedWithoutSaving)).toBe(false)
  })

  it('reste vert pendant une nouvelle conversation quand le standup du jour existait déjà', () => {
    const redoingExistingStandup = { wasDoneBeforeOpening: true, isSavedDuringConversation: false, isConversationOpen: true }

    expect(isTodaySquareFilled(redoingExistingStandup)).toBe(true)
  })
})
