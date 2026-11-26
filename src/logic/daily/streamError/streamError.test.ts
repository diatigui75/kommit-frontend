import { describe, expect, it } from 'vitest'
import { streamErrorDisplayFor } from '@/logic/daily/streamError/streamError'
import type { ApiError } from '@/types/apiContract'

describe('streamErrorDisplayFor — CA31 quota Groq, message distinct d\'une erreur métier', () => {
  it('affiche le message du serveur pour LLM_QUOTA_EXCEEDED, classé en panne du LLM', () => {
    const quotaExceeded: ApiError = { code: 'LLM_QUOTA_EXCEEDED', message: "Quota de l'assistant atteint, réessaie plus tard." }

    expect(streamErrorDisplayFor(quotaExceeded)).toEqual({
      kind: 'llm',
      message: "Quota de l'assistant atteint, réessaie plus tard.",
    })
  })
})

describe('streamErrorDisplayFor — CA31 provider indisponible, message distinct d\'une erreur métier', () => {
  it('affiche le message du serveur pour LLM_UNAVAILABLE, classé en panne du LLM', () => {
    const providerDown: ApiError = { code: 'LLM_UNAVAILABLE', message: "L'assistant est indisponible pour le moment." }

    expect(streamErrorDisplayFor(providerDown)).toEqual({
      kind: 'llm',
      message: "L'assistant est indisponible pour le moment.",
    })
  })
})

describe('streamErrorDisplayFor — CA29 erreur métier du flux', () => {
  it('affiche le message du serveur pour VALIDATION_ERROR, classé en erreur métier', () => {
    const blankMessageRejected: ApiError = { code: 'VALIDATION_ERROR', message: 'Le message ne peut pas être vide' }

    expect(streamErrorDisplayFor(blankMessageRejected)).toEqual({
      kind: 'business',
      message: 'Le message ne peut pas être vide',
    })
  })
})

describe('streamErrorDisplayFor — CA32 récap non conforme', () => {
  it('affiche le message du serveur pour SUMMARY_MALFORMED', () => {
    const malformedSummary: ApiError = { code: 'SUMMARY_MALFORMED', message: "Le récap n'a pas pu être généré." }

    expect(streamErrorDisplayFor(malformedSummary).message).toBe("Le récap n'a pas pu être généré.")
  })
})
