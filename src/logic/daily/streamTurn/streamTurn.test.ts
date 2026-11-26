import { describe, expect, it } from 'vitest'
import { applySseEvent, emptyStreamTurn, isAwaitingFirstToken, type StreamTurn } from '@/logic/daily/streamTurn/streamTurn'
import type { ApiError, StandupSummary } from '@/types/apiContract'

const firstSummary: StandupSummary = { fait: ['PR auth'], blocages: [], prevu: ['Chat'] }
const updatedSummary: StandupSummary = { fait: ['PR auth'], blocages: ['CI rouge'], prevu: ['Chat'] }
const llmDown: ApiError = { code: 'LLM_UNAVAILABLE', message: "L'assistant est indisponible pour le moment." }

describe('applySseEvent — CA4 les tokens s\'accumulent dans la réponse de l\'IA', () => {
  it('ajoute le texte du 1er token à une réponse vide', () => {
    const firstToken = { type: 'token', text: 'As-tu' } as const

    expect(applySseEvent(emptyStreamTurn, firstToken).reply).toBe('As-tu')
  })

  it('concatène les tokens dans leur ordre d\'arrivée, espaces compris', () => {
    const tokens = [
      { type: 'token', text: 'As-tu' },
      { type: 'token', text: ' eu des ' },
      { type: 'token', text: 'blocages ?' },
    ] as const

    const turnAfterTokens = tokens.reduce<StreamTurn>((turn, token) => applySseEvent(turn, token), emptyStreamTurn)

    expect(turnAfterTokens.reply).toBe('As-tu eu des blocages ?')
  })

  it('ne modifie pas le tour reçu', () => {
    const turn: StreamTurn = { reply: 'As-tu', summary: null, error: null }
    const originalTurn: StreamTurn = { reply: 'As-tu', summary: null, error: null }

    applySseEvent(turn, { type: 'token', text: ' eu' })

    expect(turn).toEqual(originalTurn)
  })
})

describe('applySseEvent — CA5, CA26 le récap reçu est gardé tel quel', () => {
  it("garde le récap de l'événement summary, sans toucher à la réponse", () => {
    const turnWithReply: StreamTurn = { reply: 'Voici ton récap', summary: null, error: null }

    expect(applySseEvent(turnWithReply, { type: 'summary', summary: firstSummary })).toEqual({
      reply: 'Voici ton récap',
      summary: firstSummary,
      error: null,
    })
  })

  it('remplace un récap précédent par le dernier reçu', () => {
    const turnWithFirstSummary: StreamTurn = { reply: '', summary: firstSummary, error: null }

    expect(applySseEvent(turnWithFirstSummary, { type: 'summary', summary: updatedSummary }).summary).toEqual(
      updatedSummary,
    )
  })
})

describe('applySseEvent — CA29 une erreur du flux ne fait pas perdre le fil', () => {
  it("garde l'erreur reçue et le texte déjà reçu", () => {
    const turnWithReply: StreamTurn = { reply: 'As-tu eu', summary: null, error: null }

    expect(applySseEvent(turnWithReply, { type: 'error', error: llmDown })).toEqual({
      reply: 'As-tu eu',
      summary: null,
      error: llmDown,
    })
  })

  it("ne produit aucun récap après SUMMARY_MALFORMED (CA32)", () => {
    const malformedSummary: ApiError = { code: 'SUMMARY_MALFORMED', message: "Le récap n'a pas pu être généré." }

    expect(applySseEvent(emptyStreamTurn, { type: 'error', error: malformedSummary }).summary).toBeNull()
  })
})

describe('isAwaitingFirstToken — CA34 indicateur d\'attente avant le 1er octet', () => {
  it("affiche l'indicateur quand le flux est lancé et que rien n'est encore arrivé", () => {
    const isStreaming = true

    expect(isAwaitingFirstToken(emptyStreamTurn, isStreaming)).toBe(true)
  })

  it("retire l'indicateur dès le 1er token reçu", () => {
    const turnWithFirstToken: StreamTurn = { reply: 'As', summary: null, error: null }
    const isStreaming = true

    expect(isAwaitingFirstToken(turnWithFirstToken, isStreaming)).toBe(false)
  })

  it("retire l'indicateur quand une erreur arrive avant tout token", () => {
    const turnWithError: StreamTurn = { reply: '', summary: null, error: llmDown }
    const isStreaming = true

    expect(isAwaitingFirstToken(turnWithError, isStreaming)).toBe(false)
  })

  it("n'affiche pas l'indicateur quand aucun flux n'est en cours", () => {
    const isStreaming = false

    expect(isAwaitingFirstToken(emptyStreamTurn, isStreaming)).toBe(false)
  })
})
