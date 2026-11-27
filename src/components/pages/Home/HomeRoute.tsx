import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import HomePage from '@/components/pages/Home/HomePage'
import StandupChatDialog from '@/components/pages/Home/StandupChatDialog'
import StandupConfirmDialog from '@/components/pages/Home/StandupConfirmDialog'
import StandupSummaryDialog from '@/components/pages/Home/StandupSummaryDialog'
import YearCalendar from '@/components/pages/Home/YearCalendar'
import { useStandupCalendar } from '@/components/pages/Home/useStandupCalendar'
import { useDailyStandup } from '@/components/pages/Home/useDailyStandup'
import { standupContent } from '@/data/standup'
import { fetchSession, sessionQueryKey, signOut } from '@/lib/api/auth'
import { arrivalToastFor, type ArrivalOrigin } from '@/logic/auth/arrivalToast/arrivalToast'
import { authErrorDisplayFor } from '@/logic/auth/error/error'
import { isVisitor } from '@/logic/auth/session/session'
import { homeHeadingFor } from '@/logic/standup/today/today'

type ArrivalState = { arrivalOrigin?: ArrivalOrigin } | null

// Câble l'accueil : session (RM1, RM2), toast d'arrivée (RM3, RM4, RM24, RM25), déconnexion (RM5, échec en toast d'erreur).
export default function HomeRoute() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Une session illisible (expirée, serveur en panne) donne l'accueil visiteur, sans message (RM31).
  const sessionQuery = useQuery({ queryKey: sessionQueryKey, queryFn: fetchSession, retry: false })
  const session = sessionQuery.data ?? null

  const arrivalOrigin = (location.state as ArrivalState)?.arrivalOrigin ?? null

  useEffect(() => {
    if (!arrivalOrigin || sessionQuery.isPending) return

    const message = session ? arrivalToastFor(arrivalOrigin, session.user.name) : null
    if (message) toast.success(message, { id: 'arrival-toast' })

    // L'origine est effacée de l'historique : un rechargement ou un « retour » ne la retrouve plus (RM24).
    navigate(location.pathname, { replace: true, state: null })
  }, [arrivalOrigin, session, sessionQuery.isPending, navigate, location.pathname])

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.setQueryData(sessionQueryKey, null),
    onError: (error) => {
      toast.error(authErrorDisplayFor(error).message)
      void queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    },
  })

  const firstName = isVisitor(session) ? undefined : session?.user.name
  const daily = useDailyStandup(firstName !== undefined)
  const calendar = useStandupCalendar(firstName !== undefined)
  const heading = homeHeadingFor(daily.today, firstName ?? '')

  return (
    <HomePage
      firstName={firstName}
      onSignOut={() => signOutMutation.mutate()}
      isSessionPending={sessionQuery.isPending}
      isSignOutPending={signOutMutation.isPending}
      todayStatus={daily.isTodayFailed ? 'todo' : heading.status === 'loading' ? 'unknown' : heading.status === 'done' ? 'done' : 'todo'}
      draft={daily.draft}
      onDraftChange={daily.setDraft}
      onLaunch={daily.launch}
      isLaunchDisabled={daily.isLaunchDisabled}
      calendar={<YearCalendar view={calendar.view} onSelectDay={calendar.onSelectDay} />}
      dialogs={
        <>
          <StandupChatDialog {...daily.chat}>
            <StandupConfirmDialog
              {...daily.quitConfirm}
              title={standupContent.quit.title}
              description={standupContent.quit.description}
              cancelLabel={standupContent.quit.continueLabel}
              confirmLabel={standupContent.quit.quitLabel}
            />
          </StandupChatDialog>
          <StandupConfirmDialog
            {...daily.replaceConfirm}
            title={standupContent.replace.title}
            description={standupContent.replace.description}
            cancelLabel={standupContent.replace.cancelLabel}
            confirmLabel={standupContent.replace.confirmLabel}
          />
          <StandupSummaryDialog {...calendar.summaryDialog} />
        </>
      }
    />
  )
}
