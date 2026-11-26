import { describe, expect, it } from 'vitest'
import { isSendDisabled } from '@/logic/daily/composer/composer'

describe('isSendDisabled — CA39 zone vide ou blanche, pas de démarrage (accueil et chat)', () => {
  it('désactive l\'envoi quand la zone est vide', () => {
    const emptyComposer = { text: '', isStreaming: false }

    expect(isSendDisabled(emptyComposer)).toBe(true)
  })

  it("désactive l'envoi quand la zone n'est faite que d'espaces", () => {
    const blankComposer = { text: '   ', isStreaming: false }

    expect(isSendDisabled(blankComposer)).toBe(true)
  })

  it("désactive l'envoi quand la zone n'est faite que de retours à la ligne et de tabulations", () => {
    const whitespaceComposer = { text: '\n\t \n', isStreaming: false }

    expect(isSendDisabled(whitespaceComposer)).toBe(true)
  })

  it("active l'envoi quand la zone contient du texte", () => {
    const filledComposer = { text: "Hier j'ai fini la PR auth", isStreaming: false }

    expect(isSendDisabled(filledComposer)).toBe(false)
  })

  it("active l'envoi quand le texte est entouré d'espaces", () => {
    const paddedComposer = { text: '  RAS  ', isStreaming: false }

    expect(isSendDisabled(paddedComposer)).toBe(false)
  })
})

describe('isSendDisabled — CA40 pas de second envoi pendant que l\'IA écrit', () => {
  it("désactive l'envoi pendant le flux, même avec du texte saisi", () => {
    const composerDuringStream = { text: 'Et aussi un blocage sur la CI', isStreaming: true }

    expect(isSendDisabled(composerDuringStream)).toBe(true)
  })

  it("réactive l'envoi une fois le flux terminé", () => {
    const composerAfterStream = { text: 'Et aussi un blocage sur la CI', isStreaming: false }

    expect(isSendDisabled(composerAfterStream)).toBe(false)
  })
})
