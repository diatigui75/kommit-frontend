import { describe, expect, it } from 'vitest'
import { appendTokens, isWaitingIndicatorVisible, readSseChunk } from '@/logic/standup/sse/sse'
import type { SseEvent } from '@/types/apiContract'

describe('readSseChunk — CA4 lecture du flux en SseEvent', () => {
  it('lit un événement token complet', () => {
    const noRest = ''
    const tokenChunk = 'data: {"type":"token","text":"Bon"}\n\n'

    expect(readSseChunk(noRest, tokenChunk)).toEqual({
      events: [{ type: 'token', text: 'Bon' }],
      rest: '',
    })
  })

  it('lit plusieurs événements arrivés dans le même morceau, dans l’ordre', () => {
    const noRest = ''
    const twoTokensChunk = 'data: {"type":"token","text":"Bon"}\n\ndata: {"type":"token","text":"jour"}\n\n'

    expect(readSseChunk(noRest, twoTokensChunk).events).toEqual([
      { type: 'token', text: 'Bon' },
      { type: 'token', text: 'jour' },
    ])
  })

  it('garde en reste un événement coupé en fin de morceau, sans l’émettre', () => {
    const noRest = ''
    const cutChunk = 'data: {"type":"token","text":"Bon"}\n\ndata: {"type":"tok'

    expect(readSseChunk(noRest, cutChunk)).toEqual({
      events: [{ type: 'token', text: 'Bon' }],
      rest: 'data: {"type":"tok',
    })
  })

  it('reconstitue un événement coupé entre 2 morceaux', () => {
    const restFromPreviousChunk = 'data: {"type":"tok'
    const nextChunk = 'en","text":"jour"}\n\n'

    expect(readSseChunk(restFromPreviousChunk, nextChunk)).toEqual({
      events: [{ type: 'token', text: 'jour' }],
      rest: '',
    })
  })

  it('lit un événement summary avec ses 3 listes', () => {
    const noRest = ''
    const summaryChunk =
      'data: {"type":"summary","summary":{"fait":["Migration de l’auth"],"blocages":[],"prevu":["Pousser en DEV"]}}\n\n'

    expect(readSseChunk(noRest, summaryChunk).events).toEqual([
      { type: 'summary', summary: { fait: ['Migration de l’auth'], blocages: [], prevu: ['Pousser en DEV'] } },
    ])
  })

  it('lit un événement error avec son ApiError', () => {
    const noRest = ''
    const errorChunk = 'data: {"type":"error","error":{"code":"LLM_UNAVAILABLE","message":"Le service est indisponible"}}\n\n'

    expect(readSseChunk(noRest, errorChunk).events).toEqual([
      { type: 'error', error: { code: 'LLM_UNAVAILABLE', message: 'Le service est indisponible' } },
    ])
  })
})

describe('appendTokens — CA4 concaténation des tokens au fil de l’eau', () => {
  it('ajoute le texte des tokens reçus à la réponse en cours, dans l’ordre', () => {
    const replySoFar = 'Excellent '
    const tokenEvents: SseEvent[] = [
      { type: 'token', text: 'travail' },
      { type: 'token', text: ' !' },
    ]

    expect(appendTokens(replySoFar, tokenEvents)).toBe('Excellent travail !')
  })

  it('ignore les événements summary et error, qui ne s’écrivent pas dans le fil', () => {
    const replySoFar = 'Voici'
    const mixedEvents: SseEvent[] = [
      { type: 'token', text: ' le résumé' },
      { type: 'summary', summary: { fait: ['Migration'], blocages: [], prevu: [] } },
      { type: 'error', error: { code: 'SUMMARY_MALFORMED', message: 'Résumé non conforme' } },
    ]

    expect(appendTokens(replySoFar, mixedEvents)).toBe('Voici le résumé')
  })

  it('renvoie la réponse inchangée quand aucun événement n’est reçu', () => {
    const replySoFar = 'Excellent'
    const noEvents: SseEvent[] = []

    expect(appendTokens(replySoFar, noEvents)).toBe('Excellent')
  })
})

describe('isWaitingIndicatorVisible — CA34 indicateur d’attente avant le premier octet', () => {
  it('est visible quand le flux est lancé et qu’aucun token n’est encore arrivé', () => {
    const waitingFirstToken = { isStreaming: true, receivedText: '' }

    expect(isWaitingIndicatorVisible(waitingFirstToken)).toBe(true)
  })

  it('disparaît dès le premier token reçu', () => {
    const firstTokenReceived = { isStreaming: true, receivedText: 'Bon' }

    expect(isWaitingIndicatorVisible(firstTokenReceived)).toBe(false)
  })

  it('est caché quand aucun flux n’est en cours', () => {
    const idle = { isStreaming: false, receivedText: '' }

    expect(isWaitingIndicatorVisible(idle)).toBe(false)
  })
})
