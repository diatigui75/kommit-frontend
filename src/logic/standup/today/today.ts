import { standupContent } from '@/data/standup'
import { composeGreeting } from '@/logic/auth/session/session'
import type { GetTodayResponse } from '@/types/apiContract'

export type HomeHeading =
  | { status: 'loading' }
  | { status: 'toDo'; title: string; titleAccent: string }
  | { status: 'done'; title: string }

export type TodaySquareState = {
  wasDoneBeforeOpening: boolean
  isSavedDuringConversation: boolean
  isConversationOpen: boolean
}

export function hasTodayStandup(today: GetTodayResponse): boolean {
  return today.done
}

// Tant que l'état du jour n'est pas connu, aucun titre : l'un ne doit jamais basculer en l'autre (CA42).
export function homeHeadingFor(today: GetTodayResponse | undefined, name: string): HomeHeading {
  if (today === undefined) return { status: 'loading' }
  if (hasTodayStandup(today)) return { status: 'done', title: standupContent.home.alreadyDoneTitle }

  return { status: 'toDo', ...composeGreeting(name) }
}

// Un standup enregistré pendant la conversation ne colore le carré qu'une fois la modale fermée (CA25).
export function isTodaySquareFilled(state: TodaySquareState): boolean {
  if (state.wasDoneBeforeOpening) return true

  return state.isSavedDuringConversation && !state.isConversationOpen
}
