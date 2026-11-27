import type { SseEvent } from '@/types/apiContract'

export type SseReadResult = {
  events: SseEvent[]
  rest: string
}

export type WaitingState = {
  isStreaming: boolean
  receivedText: string
}

const EVENT_SEPARATOR = '\n\n'
const DATA_PREFIX = 'data: '

// Un morceau du flux peut couper un événement : la partie incomplète est rendue en reste pour le morceau suivant.
export function readSseChunk(rest: string, chunk: string): SseReadResult {
  const blocks = (rest + chunk).split(EVENT_SEPARATOR)
  const incomplete = blocks.pop() ?? ''
  const events = blocks
    .map((block) =>
      block
        .split('\n')
        .filter((line) => line.startsWith(DATA_PREFIX))
        .map((line) => line.slice(DATA_PREFIX.length))
        .join('\n'),
    )
    .filter((data) => data !== '')
    .map((data) => JSON.parse(data) as SseEvent)

  return { events, rest: incomplete }
}

export function appendTokens(text: string, events: SseEvent[]): string {
  return events.reduce((reply, event) => (event.type === 'token' ? reply + event.text : reply), text)
}

export function isWaitingIndicatorVisible(state: WaitingState): boolean {
  return state.isStreaming && state.receivedText === ''
}
