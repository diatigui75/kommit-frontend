import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { calendarQueryKey, fetchCalendar, fetchStandupOfDay, standupOfDayQueryKey } from '@/lib/api/standup'
import { authContent } from '@/data/auth'
import { calendarRangeFor, calendarViewFor } from '@/logic/standup/calendar/calendar'
import { summaryLoadErrorFor } from '@/logic/standup/error/error'
import type { ApiError, Jour } from '@/types/apiContract'

const isApiError = (error: unknown): error is ApiError =>
  error !== null && typeof error === 'object' && 'code' in error

// Câble le calendrier de l'accueil (KOM-22) : fenêtre de 53 semaines, résumé d'un jour en lecture seule.
export function useStandupCalendar(isConnected: boolean) {
  const queryClient = useQueryClient()
  // L'instant est figé au montage : la fenêtre et sa clé de cache ne bougent pas à chaque rendu.
  const [now] = useState(() => new Date())
  const range = useMemo(() => calendarRangeFor(now), [now])

  const calendarQuery = useQuery({
    queryKey: calendarQueryKey(range),
    queryFn: () => fetchCalendar(range),
    enabled: isConnected,
    retry: 1,
  })
  const view = calendarViewFor(now, { response: calendarQuery.data, hasFailed: calendarQuery.isError })

  const [selectedJour, setSelectedJour] = useState<Jour | null>(null)
  const summaryQuery = useQuery({
    queryKey: standupOfDayQueryKey(selectedJour ?? ''),
    queryFn: () => fetchStandupOfDay(selectedJour ?? ''),
    enabled: selectedJour !== null,
    retry: false,
  })

  // Un résumé introuvable ne laisse jamais de modale vide : message, fermeture, calendrier rechargé (CA45).
  useEffect(() => {
    if (!summaryQuery.isError || selectedJour === null) return

    const error = summaryQuery.error
    const reaction = isApiError(error)
      ? summaryLoadErrorFor(error)
      : { message: authContent.outageMessage, shouldCloseDialog: true, shouldRefreshCalendar: false }
    toast.error(reaction.message)
    if (reaction.shouldCloseDialog) setSelectedJour(null)
    if (reaction.shouldRefreshCalendar) void queryClient.invalidateQueries({ queryKey: calendarQueryKey(range) })
  }, [summaryQuery.isError, summaryQuery.error, selectedJour, queryClient, range])

  const selectedLabel =
    view.status === 'ready' ? (view.weeks.flat().find((day) => day.jour === selectedJour)?.label ?? '') : ''

  return {
    view,
    onSelectDay: setSelectedJour,
    summaryDialog: {
      open: selectedJour !== null && !summaryQuery.isError,
      dateLabel: selectedLabel,
      summary: summaryQuery.data?.summary ?? null,
      onClose: () => setSelectedJour(null),
    },
  }
}
