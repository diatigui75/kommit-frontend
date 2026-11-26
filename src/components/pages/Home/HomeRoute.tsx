import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import HomePage from '@/components/pages/Home/HomePage'
import { useDailyStandup } from '@/components/pages/Home/useDailyStandup'
import { fetchSession, sessionQueryKey, signOut } from '@/lib/api/auth'
import { arrivalToastFor, type ArrivalOrigin } from '@/logic/auth/arrivalToast/arrivalToast'
import { authErrorDisplayFor } from '@/logic/auth/error/error'
import { isVisitor } from '@/logic/auth/session/session'

type ArrivalState = { arrivalOrigin?: ArrivalOrigin } | null

// Câble l'accueil : session (RM1, RM2), toast d'arrivée (RM3, RM4, RM24, RM25), déconnexion (RM5, échec en toast d'erreur), daily (KOM-19, KOM-22).
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
  const daily = useDailyStandup(firstName)

  return (
    <HomePage
      firstName={firstName}
      daily={daily}
      onSignOut={() => signOutMutation.mutate()}
      isSessionPending={sessionQuery.isPending}
      isSignOutPending={signOutMutation.isPending}
    />
  )
}
