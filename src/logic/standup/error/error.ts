import type { ApiError } from '@/types/apiContract'

export type StandupErrorDisplay = {
  kind: 'business' | 'outage'
  message: string
}

export function standupErrorDisplayFor(_error: ApiError): StandupErrorDisplay {
  return { kind: 'business', message: '' }
}
