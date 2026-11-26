import { describe, expect, it } from 'vitest'
import { isApiError } from '@/logic/apiError/apiError'

describe('isApiError', () => {
  it('reconnaît une ApiError du serveur', () => {
    const serverError = { code: 'STANDUP_NOT_FOUND', message: "Ce standup n'existe plus" }

    expect(isApiError(serverError)).toBe(true)
  })

  it("ne reconnaît pas l'Error d'un serveur injoignable", () => {
    const unreachableServer = new Error('Le serveur ne répond pas.')

    expect(isApiError(unreachableServer)).toBe(false)
  })

  it('ne reconnaît pas une réponse vide', () => {
    const emptyPayload = null

    expect(isApiError(emptyPayload)).toBe(false)
  })
})
