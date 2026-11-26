import type { ApiError } from '@/types/apiContract'

// Une erreur rejetée par lib/api est une ApiError du serveur, ou une Error quand il est injoignable.
export const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as ApiError).code === 'string' &&
  typeof (error as ApiError).message === 'string'
