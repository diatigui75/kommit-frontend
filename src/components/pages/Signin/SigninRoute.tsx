import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SigninPage from '@/components/pages/Signin/SigninPage'
import { fetchSession, sessionQueryKey, signIn } from '@/lib/api/auth'
import { normalizeEmail } from '@/logic/auth/email/email'
import { authErrorDisplayFor } from '@/logic/auth/error/error'
import { shouldLeaveAuthPage } from '@/logic/auth/session/session'
import { isSigninSubmitDisabled } from '@/logic/auth/submitButton/submitButton'

// Câble le signin : aucun contrôle de format (RM20), appel serveur, erreur en message global (RM13, RM18).
export default function SigninRoute() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [values, setValues] = useState({ email: '', password: '' })
  const [formError, setFormError] = useState<string | undefined>(undefined)
  // Garde synchrone : isPending n'est à jour qu'au rendu suivant, 2 soumissions dans le même instant le liraient à false.
  const isSubmittingRef = useRef(false)
  const sessionQuery = useQuery({ queryKey: sessionQueryKey, queryFn: fetchSession, retry: false })

  const signinMutation = useMutation({
    mutationFn: signIn,
    onSuccess: async () => {
      // La session est relue avant de quitter la page, pour que l'accueil affiche le prénom et le toast (RM12, RM4).
      // Si cette relecture échoue, on part quand même : l'accueil relira la session lui-même.
      await queryClient.fetchQuery({ queryKey: sessionQueryKey, queryFn: fetchSession }).catch(() => undefined)
      navigate('/', { state: { arrivalOrigin: 'signin' } })
    },
    onError: (error) => {
      isSubmittingRef.current = false
      setFormError(authErrorDisplayFor(error).message)
    },
  })

  const handleSubmit = () => {
    if (isSubmittingRef.current) return

    isSubmittingRef.current = true
    setFormError(undefined)
    signinMutation.mutate({ email: normalizeEmail(values.email), password: values.password })
  }

  if (shouldLeaveAuthPage(sessionQuery.data, signinMutation.isPending || signinMutation.isSuccess)) {
    return <Navigate to="/" replace />
  }

  return (
    <SigninPage
      values={values}
      onFieldChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
      onSubmit={handleSubmit}
      formError={formError}
      isSubmitDisabled={isSigninSubmitDisabled({ ...values, isPending: signinMutation.isPending })}
      isPending={signinMutation.isPending}
    />
  )
}
