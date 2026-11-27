import { describe, expect, it } from 'vitest'
import { isSendDisabled, isValidateDisabled } from '@/logic/standup/buttons/buttons'
import type { ApiError, StandupSummary } from '@/types/apiContract'

const receivedSummary: StandupSummary = { fait: ['Migration de l’auth'], blocages: [], prevu: ['Pousser en DEV'] }

describe('isSendDisabled — CA39 zone vide, pas de démarrage (accueil et modale)', () => {
  it('désactive l’envoi quand la zone de saisie est vide', () => {
    const emptyInput = { text: '', isStreaming: false }

    expect(isSendDisabled(emptyInput)).toBe(true)
  })

  it('désactive l’envoi quand la zone ne contient que des espaces', () => {
    const blankInput = { text: '   ', isStreaming: false }

    expect(isSendDisabled(blankInput)).toBe(true)
  })

  it('désactive l’envoi quand la zone ne contient que des retours à la ligne et tabulations', () => {
    const whitespaceInput = { text: '\n\t \n', isStreaming: false }

    expect(isSendDisabled(whitespaceInput)).toBe(true)
  })

  it('active l’envoi dès qu’un caractère non blanc est saisi', () => {
    const filledInput = { text: 'Migration finie', isStreaming: false }

    expect(isSendDisabled(filledInput)).toBe(false)
  })

  it('active l’envoi quand le texte est entouré d’espaces', () => {
    const paddedInput = { text: '  Migration finie  ', isStreaming: false }

    expect(isSendDisabled(paddedInput)).toBe(false)
  })
})

describe('isSendDisabled — CA40 pas de second envoi pendant que l’IA écrit', () => {
  it('désactive l’envoi pendant que l’IA écrit, même avec un texte saisi', () => {
    const typingWhileStreaming = { text: 'Pas de blocage, RAS', isStreaming: true }

    expect(isSendDisabled(typingWhileStreaming)).toBe(true)
  })
})

describe('isValidateDisabled — CA6, CA25 Valider actif seulement une fois le summary reçu', () => {
  it('désactive Valider tant qu’aucun summary n’est arrivé', () => {
    const noSummaryYet = { summary: null, isSaving: false, streamError: null }

    expect(isValidateDisabled(noSummaryYet)).toBe(true)
  })

  it('active Valider une fois le summary reçu', () => {
    const summaryReceived = { summary: receivedSummary, isSaving: false, streamError: null }

    expect(isValidateDisabled(summaryReceived)).toBe(false)
  })
})

describe('isValidateDisabled — CA27 re-clic Valider ignoré pendant l’enregistrement', () => {
  it('désactive Valider tant que la requête de validation est en cours', () => {
    const savingInProgress = { summary: receivedSummary, isSaving: true, streamError: null }

    expect(isValidateDisabled(savingInProgress)).toBe(true)
  })
})

describe('isValidateDisabled — CA32 SUMMARY_MALFORMED ne laisse jamais valider', () => {
  it('désactive Valider après un SUMMARY_MALFORMED, même si un récap précédent avait été reçu', () => {
    const malformedSummary: ApiError = { code: 'SUMMARY_MALFORMED', message: 'Le résumé produit n’est pas conforme' }
    const previousSummaryThenMalformed = { summary: receivedSummary, isSaving: false, streamError: malformedSummary }

    expect(isValidateDisabled(previousSummaryThenMalformed)).toBe(true)
  })

  it('désactive Valider après un SUMMARY_MALFORMED sans récap reçu', () => {
    const malformedSummary: ApiError = { code: 'SUMMARY_MALFORMED', message: 'Le résumé produit n’est pas conforme' }
    const malformedWithoutSummary = { summary: null, isSaving: false, streamError: malformedSummary }

    expect(isValidateDisabled(malformedWithoutSummary)).toBe(true)
  })
})
