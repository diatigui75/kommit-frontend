import type { SseEvent } from '@/types/apiContract'

export type SseReadResult = {
  events: SseEvent[]
  rest: string
}

export type WaitingState = {
  isStreaming: boolean
  receivedText: string
}

export function readSseChunk(_rest: string, _chunk: string): SseReadResult {
  return { events: [], rest: '' }
}

export function appendTokens(_text: string, _events: SseEvent[]): string {
  return ''
}

export function isWaitingIndicatorVisible(_state: WaitingState): boolean {
  return false
}
