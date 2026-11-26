import type { ApiError, SseEvent, StandupSummary } from '@/types/apiContract'

// Ce qu'a produit le tour de l'IA en cours : texte accumulé, récap reçu, erreur reçue.
export type StreamTurn = {
  reply: string
  summary: StandupSummary | null
  error: ApiError | null
}

export const emptyStreamTurn: StreamTurn = { reply: '', summary: null, error: null }

export function applySseEvent(_turn: StreamTurn, _event: SseEvent): StreamTurn {
  return { reply: '', summary: null, error: null }
}

export function isAwaitingFirstToken(_turn: StreamTurn, _isStreaming: boolean): boolean {
  return false
}
