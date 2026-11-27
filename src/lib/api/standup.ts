import { postTextStream, requestJson } from '@/lib/api/apiClient'
import type { GetTodayResponse, PostConversationBody, PostStandupBody, Standup } from '@/types/apiContract'

export const todayStandupQueryKey = ['standups', 'today'] as const

export const fetchTodayStandup = () => requestJson<GetTodayResponse>('/standups/today', 'GET')

export const saveStandup = (body: PostStandupBody) => requestJson<Standup>('/standups', 'POST', body)

// Morceaux de texte bruts du flux SSE, découpés en événements par la logique du standup.
export const streamConversation = (body: PostConversationBody, signal: AbortSignal) =>
  postTextStream('/standups/conversation', body, signal)
