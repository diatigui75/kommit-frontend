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

export function hasTodayStandup(_today: GetTodayResponse): boolean {
  return false
}

export function homeHeadingFor(_today: GetTodayResponse | undefined, _name: string): HomeHeading {
  return { status: 'loading' }
}

export function isTodaySquareFilled(_state: TodaySquareState): boolean {
  return false
}
