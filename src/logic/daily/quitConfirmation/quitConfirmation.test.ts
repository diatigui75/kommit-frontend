import { describe, expect, it } from 'vitest'
import { isConversationUnfinished } from '@/logic/daily/quitConfirmation/quitConfirmation'
import type { Message } from '@/types/apiContract'

const threadWithSummaryReply: Message[] = [
  { role: 'user', content: 'Hier : PR auth, pas de blocage, aujourd’hui : chat' },
  { role: 'assistant', content: 'Voici ton récap' },
]

describe('isConversationUnfinished — CA7, CA44 confirmation avant de perdre la conversation', () => {
  it('demande confirmation dès le 1er message envoyé, standup pas enregistré', () => {
    const firstMessageOnly: Message[] = [{ role: 'user', content: 'Hier : PR auth' }]

    expect(isConversationUnfinished({ messages: firstMessageOnly, isSaved: false })).toBe(true)
  })

  it('demande confirmation quand le récap est reçu mais pas validé', () => {
    const progressWithUnvalidatedSummary = { messages: threadWithSummaryReply, isSaved: false }

    expect(isConversationUnfinished(progressWithUnvalidatedSummary)).toBe(true)
  })

  it("ferme sans confirmation quand aucun message n'a été envoyé", () => {
    const noMessage: Message[] = []

    expect(isConversationUnfinished({ messages: noMessage, isSaved: false })).toBe(false)
  })

  it('ferme sans confirmation une fois le standup enregistré', () => {
    const savedProgress = { messages: threadWithSummaryReply, isSaved: true }

    expect(isConversationUnfinished(savedProgress)).toBe(false)
  })
})
