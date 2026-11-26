import { API_URL, requestJson } from '@/lib/api/apiClient'
import type {
  GetCalendrierQuery,
  GetCalendrierResponse,
  GetStandupResponse,
  GetTodayResponse,
  Jour,
  Message,
  PostStandupBody,
  PostStandupResponse,
  SseEvent,
} from '@/types/apiContract'

export const todayQueryKey = ['standups', 'today'] as const
export const calendarQueryKey = (query: GetCalendrierQuery) => ['standups', 'calendar', query.from, query.to] as const
export const standupQueryKey = (jour: Jour) => ['standups', 'jour', jour] as const

export const fetchToday = () => requestJson<GetTodayResponse>('/standups/today', 'GET')

export const fetchCalendar = ({ from, to }: GetCalendrierQuery) =>
  requestJson<GetCalendrierResponse>(`/standups?from=${from}&to=${to}`, 'GET')

export const fetchStandup = (jour: Jour) => requestJson<GetStandupResponse>(`/standups/${jour}`, 'GET')

export const postStandup = (body: PostStandupBody) => requestJson<PostStandupResponse>('/standups', 'POST', body)

// Format supposé sur le fil (le contrat ne le fixe pas) : un `SseEvent` en JSON par ligne `data:`, blocs séparés par une ligne vide.
const parseEventBlock = (block: string): SseEvent | null => {
  const data = block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')

  return data === '' ? null : (JSON.parse(data) as SseEvent)
}

// POST /standups/conversation : le fil complet part, chaque événement SSE reçu est passé à `onEvent`.
// Une erreur HTTP avant le flux rejette avec l'`ApiError` reçue ; un échec réseau avec une Error.
export async function streamConversation(messages: Message[], onEvent: (event: SseEvent) => void): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/standups/conversation`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ messages }),
    })
  } catch {
    throw new Error('Le serveur ne répond pas.')
  }

  if (!response.ok || !response.body) throw await response.json().catch(() => null)

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += value.replaceAll('\r\n', '\n')

    let separator = buffer.indexOf('\n\n')
    while (separator !== -1) {
      const event = parseEventBlock(buffer.slice(0, separator))
      if (event) onEvent(event)
      buffer = buffer.slice(separator + 2)
      separator = buffer.indexOf('\n\n')
    }
  }

  const lastEvent = parseEventBlock(buffer)
  if (lastEvent) onEvent(lastEvent)
}
