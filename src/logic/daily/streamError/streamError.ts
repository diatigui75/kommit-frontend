import type { ApiError } from '@/types/apiContract'

// On affiche le `message` du serveur (choix de KOM-07) ; `kind` sépare les pannes du LLM des erreurs métier.
export type StreamErrorDisplay = {
  kind: 'llm' | 'business'
  message: string
}

export function streamErrorDisplayFor(_error: ApiError): StreamErrorDisplay {
  return { kind: 'business', message: '' }
}
