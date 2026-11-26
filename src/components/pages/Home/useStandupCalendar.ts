import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { calendarQueryFor } from '@/logic/daily/calendarQuery/calendarQuery'
import { calendarStateFor } from '@/logic/daily/calendarState/calendarState'
import { summaryDialogStateFor } from '@/logic/daily/summaryDialog/summaryDialog'
import { calendarQueryKey, fetchCalendar, fetchStandup, standupQueryKey } from '@/lib/api/standup'
import type { Jour } from '@/types/apiContract'

// Calendrier des 53 semaines (CA11, CA43) et modale du résumé d'un jour passé (CA14, CA45, CA46).
export function useStandupCalendar(isConnected: boolean, today: Jour) {
  const queryClient = useQueryClient()
  const calendarQuery = calendarQueryFor(today)
  const [selectedJour, setSelectedJour] = useState<Jour | null>(null)
  // Fermer la modale ne vide pas le jour choisi : le résumé et la date restent affichés pendant l'animation.
  const [isPastDailyOpen, setIsPastDailyOpen] = useState(false)

  const calendar = useQuery({
    queryKey: calendarQueryKey(calendarQuery),
    queryFn: () => fetchCalendar(calendarQuery),
    enabled: isConnected,
    retry: false,
  })

  const standupQuery = useQuery({
    queryKey: standupQueryKey(selectedJour ?? ''),
    queryFn: () => fetchStandup(selectedJour as Jour),
    enabled: selectedJour !== null,
    retry: false,
  })
  const pastDaily = summaryDialogStateFor({
    selectedJour,
    status: standupQuery.status,
    data: standupQuery.data,
    error: standupQuery.error,
  })

  // Standup disparu : pas de modale, le message du serveur et un calendrier rechargé (CA45).
  useEffect(() => {
    if (pastDaily.kind !== 'standupGone') return
    toast.error(pastDaily.message)
    setSelectedJour(null)
    setIsPastDailyOpen(false)
    void queryClient.invalidateQueries({ queryKey: ['standups'] })
  }, [pastDaily, queryClient])

  return {
    calendar: {
      today,
      state: calendarStateFor({ status: calendar.status, data: calendar.data, error: calendar.error }),
      onOpenDay: (jour: Jour) => {
        setSelectedJour(jour)
        setIsPastDailyOpen(true)
      },
    },
    pastDaily: {
      isOpen: isPastDailyOpen,
      state: pastDaily,
      jour: selectedJour,
      onClose: () => setIsPastDailyOpen(false),
    },
  }
}
