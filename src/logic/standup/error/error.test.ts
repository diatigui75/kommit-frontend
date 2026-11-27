import { describe, expect, it } from 'vitest'
import { standupErrorDisplayFor } from '@/logic/standup/error/error'
import type { ApiError } from '@/types/apiContract'

describe('standupErrorDisplayFor — CA31 provider indisponible, classé en panne', () => {
  it('affiche le message du serveur pour LLM_UNAVAILABLE, classé à part des erreurs métier', () => {
    const providerDown: ApiError = { code: 'LLM_UNAVAILABLE', message: 'L’assistant est indisponible pour le moment' }

    expect(standupErrorDisplayFor(providerDown)).toEqual({
      kind: 'outage',
      message: 'L’assistant est indisponible pour le moment',
    })
  })
})

describe('standupErrorDisplayFor — CA32 quota Groq dépassé, classé en panne', () => {
  it('affiche le message du serveur pour LLM_QUOTA_EXCEEDED, classé à part des erreurs métier', () => {
    const quotaExceeded: ApiError = { code: 'LLM_QUOTA_EXCEEDED', message: 'Le quota de l’assistant est atteint' }

    expect(standupErrorDisplayFor(quotaExceeded)).toEqual({
      kind: 'outage',
      message: 'Le quota de l’assistant est atteint',
    })
  })

  it('donne 2 messages distincts pour LLM_QUOTA_EXCEEDED et LLM_UNAVAILABLE', () => {
    const quotaExceeded: ApiError = { code: 'LLM_QUOTA_EXCEEDED', message: 'Le quota de l’assistant est atteint' }
    const providerDown: ApiError = { code: 'LLM_UNAVAILABLE', message: 'L’assistant est indisponible pour le moment' }

    const quotaMessage = standupErrorDisplayFor(quotaExceeded).message
    const unavailableMessage = standupErrorDisplayFor(providerDown).message

    expect(quotaMessage).not.toBe(unavailableMessage)
  })
})

describe('standupErrorDisplayFor — CA29 erreur du flux, message du serveur', () => {
  it('affiche le message du serveur pour SUMMARY_MALFORMED', () => {
    const malformedSummary: ApiError = { code: 'SUMMARY_MALFORMED', message: 'Le résumé produit n’est pas conforme' }

    expect(standupErrorDisplayFor(malformedSummary)).toMatchObject({
      message: 'Le résumé produit n’est pas conforme',
    })
  })

  it('affiche le message du serveur pour INTERNAL_ERROR, classé en panne', () => {
    const serverFailure: ApiError = { code: 'INTERNAL_ERROR', message: 'Une erreur est survenue côté serveur' }

    expect(standupErrorDisplayFor(serverFailure)).toEqual({
      kind: 'outage',
      message: 'Une erreur est survenue côté serveur',
    })
  })

  it('classe VALIDATION_ERROR en erreur métier, avec le message du serveur', () => {
    const blankMessageRejected: ApiError = { code: 'VALIDATION_ERROR', message: 'Le message ne peut pas être vide' }

    expect(standupErrorDisplayFor(blankMessageRejected)).toEqual({
      kind: 'business',
      message: 'Le message ne peut pas être vide',
    })
  })
})
