import { postTextStream, requestJson } from '@/lib/api/apiClient'
import type {
  GetCalendrierQuery,
  GetCalendrierResponse,
  GetStandupResponse,
  GetTodayResponse,
  Jour,
  PostConversationBody,
  PostStandupBody,
  Standup,
} from '@/types/apiContract'

// Racine commune : invalider standupsQueryKey recharge l'état du jour et le calendrier.
export const standupsQueryKey = ['standups'] as const
export const todayStandupQueryKey = ['standups', 'today'] as const
export const calendarQueryKey = (range: GetCalendrierQuery) => ['standups', 'calendar', range.from, range.to] as const
export const standupOfDayQueryKey = (jour: Jour) => ['standups', 'day', jour] as const

export const fetchCalendar = (range: GetCalendrierQuery) =>
  requestJson<GetCalendrierResponse>(`/standups?from=${range.from}&to=${range.to}`, 'GET')

export const fetchStandupOfDay = (jour: Jour) => requestJson<GetStandupResponse>(`/standups/${jour}`, 'GET')

export const fetchTodayStandup = () => requestJson<GetTodayResponse>('/standups/today', 'GET')

export const saveStandup = (body: PostStandupBody) => requestJson<Standup>('/standups', 'POST', body)

// Morceaux de texte bruts du flux SSE, découpés en événements par la logique du standup.
export const streamConversation = (body: PostConversationBody, signal: AbortSignal) =>
  postTextStream('/standups/conversation', body, signal)
