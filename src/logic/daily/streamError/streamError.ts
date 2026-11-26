import type { ApiError } from '@/types/apiContract'

// On affiche le `message` du serveur (choix de KOM-07) ; `kind` sépare les pannes du LLM des erreurs métier.
// SUMMARY_MALFORMED et INTERNAL_ERROR se réessaient comme une panne du LLM.
export type StreamErrorDisplay = {
  kind: 'llm' | 'business'
  message: string
}

const businessCodes: ReadonlySet<ApiError['code']> = new Set(['VALIDATION_ERROR', 'STANDUP_NOT_FOUND'])

export function streamErrorDisplayFor(error: ApiError): StreamErrorDisplay {
  return { kind: businessCodes.has(error.code) ? 'business' : 'llm', message: error.message }
}
