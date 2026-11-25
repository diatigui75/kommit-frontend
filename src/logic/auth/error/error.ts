import { authContent } from '@/data/auth'
import type { ApiError } from '@/types/apiContract'

// Métier : on affiche le `message` du serveur, à l'emplacement choisi par le code.
// Panne (RM18) : message du serveur pour INTERNAL_ERROR, texte du front si injoignable ou erreur inconnue.
export type AuthErrorDisplay =
  | { kind: 'business'; target: 'email' | 'form'; message: string }
  | { kind: 'outage'; target: 'form'; message: string }

const businessCodes: ReadonlySet<ApiError['code']> = new Set([
  'EMAIL_ALREADY_EXISTS',
  'INVALID_CREDENTIALS',
  'TOO_MANY_ATTEMPTS',
  'VALIDATION_ERROR',
])

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as ApiError).code === 'string' &&
  typeof (error as ApiError).message === 'string'

export function authErrorDisplayFor(error: unknown): AuthErrorDisplay {
  if (isApiError(error)) {
    if (error.code === 'EMAIL_ALREADY_EXISTS') {
      return { kind: 'business', target: 'email', message: error.message }
    }
    if (businessCodes.has(error.code)) {
      return { kind: 'business', target: 'form', message: error.message }
    }
    if (error.code === 'INTERNAL_ERROR') {
      return { kind: 'outage', target: 'form', message: error.message }
    }
  }

  return { kind: 'outage', target: 'form', message: authContent.outageMessage }
}
