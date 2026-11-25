import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import SignupPage from '@/components/pages/Signup/SignupPage'
import { fetchSession, sessionQueryKey, signUp } from '@/lib/api/auth'
import { normalizeEmail } from '@/logic/auth/email/email'
import { authErrorDisplayFor, type AuthErrorDisplay } from '@/logic/auth/error/error'
import { isSignupSubmitDisabled } from '@/logic/auth/submitButton/submitButton'
import { invalidSignupFields, type SignupValues, visibleSignupFieldErrors } from '@/logic/auth/validation/validation'

// Câble le signup : validation à la soumission (RM10, RM11, RM20, RM30), appel serveur, erreurs (RM9, RM18).
export default function SignupRoute() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [values, setValues] = useState<SignupValues>({ firstName: '', email: '', password: '' })
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false)
  const [serverError, setServerError] = useState<AuthErrorDisplay | null>(null)

  const signupMutation = useMutation({
    mutationFn: signUp,
    onSuccess: async () => {
      // La session est relue avant de quitter la page, pour que l'accueil affiche le prénom et le toast (RM8, RM3).
      // Si cette relecture échoue, on part quand même : l'accueil relira la session lui-même.
      await queryClient.fetchQuery({ queryKey: sessionQueryKey, queryFn: fetchSession }).catch(() => undefined)
      navigate('/', { state: { arrivalOrigin: 'signup' } })
    },
    onError: (error) => setServerError(authErrorDisplayFor(error)),
  })

  const handleSubmit = () => {
    if (signupMutation.isPending) return

    setHasBeenSubmitted(true)
    setServerError(null)
    if (invalidSignupFields(values).length > 0) return

    signupMutation.mutate({
      name: values.firstName.trim(),
      email: normalizeEmail(values.email),
      password: values.password,
    })
  }

  const fieldErrors = visibleSignupFieldErrors(values, hasBeenSubmitted)
  const serverEmailError = serverError?.target === 'email' ? serverError.message : undefined

  return (
    <SignupPage
      values={values}
      onFieldChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
      onSubmit={handleSubmit}
      firstNameError={fieldErrors.firstName}
      emailError={fieldErrors.email ?? serverEmailError}
      passwordError={fieldErrors.password}
      formError={serverError?.target === 'form' ? serverError.message : undefined}
      isSubmitDisabled={isSignupSubmitDisabled({ ...values, isPending: signupMutation.isPending })}
      isPending={signupMutation.isPending}
    />
  )
}
