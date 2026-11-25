import { homeContent } from '@/data/home'

export type ArrivalOrigin = 'signup' | 'signin'

export function arrivalToastFor(origin: ArrivalOrigin | null, name: string): string | null {
  const { arrivalToast } = homeContent

  if (origin === 'signup') return `${arrivalToast.signupStart}${name}${arrivalToast.signupEnd}`
  if (origin === 'signin') return `${arrivalToast.signinStart}${name}${arrivalToast.signinEnd}`

  return null
}
