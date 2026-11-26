import { useQuery } from '@tanstack/react-query'
import { useDailyConversation } from '@/components/pages/Home/useDailyConversation'
import { useStandupCalendar } from '@/components/pages/Home/useStandupCalendar'
import { todayInParis } from '@/logic/daily/today/today'
import { dailyHeadingFor } from '@/logic/daily/todayStatus/todayStatus'
import { fetchToday, todayQueryKey } from '@/lib/api/standup'
import type { GetTodayResponse } from '@/types/apiContract'

// Daily de l'accueil connecté : état du jour et titre (CA1, CA8, CA42), plus la conversation et le calendrier.
export function useDailyStandup(firstName: string | undefined) {
  const isConnected = firstName !== undefined
  const today = todayInParis(new Date())

  const todayQuery = useQuery({ queryKey: todayQueryKey, queryFn: fetchToday, enabled: isConnected, retry: false })
  // Si l'état du jour est illisible, on propose la saisie plutôt qu'un loader sans fin.
  const todayStatus: GetTodayResponse | undefined = todayQuery.isError ? { done: false, standup: null } : todayQuery.data

  return {
    heading: dailyHeadingFor(todayStatus, firstName ?? ''),
    isDailyFilled: todayStatus?.done ?? false,
    ...useDailyConversation(todayStatus),
    ...useStandupCalendar(isConnected, today),
  }
}

export type DailyStandup = ReturnType<typeof useDailyStandup>
