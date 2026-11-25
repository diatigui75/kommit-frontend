import { describe, expect, it } from 'vitest'
import { authErrorDisplayFor } from '@/logic/auth/error/error'
import type { ApiError } from '@/types/apiContract'

const outageDisplay = {
  kind: 'outage',
  target: 'form',
  message: 'Le serveur ne répond pas. Réessaie dans un instant.',
}

describe('authErrorDisplayFor — RM9, RM13 erreur métier, message selon le code', () => {
  it('affiche le message du serveur sous le champ Email pour EMAIL_ALREADY_EXISTS', () => {
    const emailTaken: ApiError = { code: 'EMAIL_ALREADY_EXISTS', message: 'Un compte avec cet email existe déjà' }

    expect(authErrorDisplayFor(emailTaken)).toEqual({
      kind: 'business',
      target: 'email',
      message: 'Un compte avec cet email existe déjà',
    })
  })

  it('affiche le message générique du serveur en message global pour INVALID_CREDENTIALS', () => {
    const badCredentials: ApiError = { code: 'INVALID_CREDENTIALS', message: 'Email ou mot de passe incorrect' }

    expect(authErrorDisplayFor(badCredentials)).toEqual({
      kind: 'business',
      target: 'form',
      message: 'Email ou mot de passe incorrect',
    })
  })
})

describe('authErrorDisplayFor — TOO_MANY_ATTEMPTS message du serveur tel quel', () => {
  it('affiche le message du serveur sans transformation, en message global', () => {
    const tooManyAttempts: ApiError = {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Trop de tentatives. Réessaie dans quelques minutes.',
    }

    expect(authErrorDisplayFor(tooManyAttempts)).toEqual({
      kind: 'business',
      target: 'form',
      message: 'Trop de tentatives. Réessaie dans quelques minutes.',
    })
  })
})

describe('authErrorDisplayFor — VALIDATION_ERROR au signup, message du serveur en haut du formulaire', () => {
  it('affiche le message du serveur en message global', () => {
    const rejectedSignup: ApiError = { code: 'VALIDATION_ERROR', message: 'Le mot de passe doit contenir au moins 8 caractères' }

    expect(authErrorDisplayFor(rejectedSignup)).toEqual({
      kind: 'business',
      target: 'form',
      message: 'Le mot de passe doit contenir au moins 8 caractères',
    })
  })
})

describe('authErrorDisplayFor — RM18, RM19 panne serveur, message du serveur distinct des erreurs métier', () => {
  it('affiche le message du serveur pour INTERNAL_ERROR, classé en panne, en message global', () => {
    const serverFailure: ApiError = { code: 'INTERNAL_ERROR', message: 'Une erreur est survenue côté serveur' }

    expect(authErrorDisplayFor(serverFailure)).toEqual({
      kind: 'outage',
      target: 'form',
      message: 'Une erreur est survenue côté serveur',
    })
  })
})

describe('authErrorDisplayFor — RM18, RM19 serveur injoignable, message du front faute de message du serveur', () => {
  it('classe le serveur injoignable en panne, avec le message du front, en message global', () => {
    const unreachableServer = new Error('Le serveur ne répond pas.')

    expect(authErrorDisplayFor(unreachableServer)).toEqual(outageDisplay)
  })
})

describe('authErrorDisplayFor — RM18 erreur inconnue, panne avec le message du front', () => {
  it('classe en panne une erreur JavaScript autre que l’échec réseau', () => {
    const unexpectedError = new TypeError("Cannot read properties of undefined (reading 'code')")

    expect(authErrorDisplayFor(unexpectedError)).toEqual(outageDisplay)
  })

  it('classe en panne un objet portant un code absent du contrat', () => {
    const unknownCodeError = { code: 'SOMETHING_ELSE', message: 'Erreur inattendue' }

    expect(authErrorDisplayFor(unknownCodeError)).toEqual(outageDisplay)
  })

  it('classe en panne une valeur qui n’a pas la forme d’une erreur', () => {
    const nonErrorValue = 'boom'

    expect(authErrorDisplayFor(nonErrorValue)).toEqual(outageDisplay)
  })

  it('classe en panne une erreur vide', () => {
    const missingError = undefined

    expect(authErrorDisplayFor(missingError)).toEqual(outageDisplay)
  })
})
