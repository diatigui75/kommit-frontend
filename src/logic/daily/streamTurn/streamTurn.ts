import type { ApiError, SseEvent, StandupSummary } from '@/types/apiContract'

// Ce qu'a produit le tour de l'IA en cours : texte accumulé, récap reçu, erreur reçue.
export type StreamTurn = {
  reply: string
  summary: StandupSummary | null
  error: ApiError | null
}

export const emptyStreamTurn: StreamTurn = { reply: '', summary: null, error: null }

export function applySseEvent(turn: StreamTurn, event: SseEvent): StreamTurn {
  if (event.type === 'token') return { ...turn, reply: turn.reply + event.text }
  if (event.type === 'summary') return { ...turn, summary: event.summary }
  return { ...turn, error: event.error }
}

// Indicateur d'attente entre l'envoi et le 1er token (CA34).
export function isAwaitingFirstToken(turn: StreamTurn, isStreaming: boolean): boolean {
  return isStreaming && turn.reply === '' && turn.error === null
}
