import { describe, expect, it } from 'vitest'
import { addUserMessage, startConversation } from '@/logic/daily/conversation/conversation'
import type { Message } from '@/types/apiContract'

describe('startConversation — CA2 le texte de l\'accueil devient le 1er message', () => {
  it("ouvre le fil avec le texte saisi, en message de l'utilisateur", () => {
    const homeText = "Hier j'ai fini la PR auth, aujourd'hui je branche le chat"

    expect(startConversation(homeText)).toEqual([
      { role: 'user', content: "Hier j'ai fini la PR auth, aujourd'hui je branche le chat" },
    ])
  })

  it('garde un texte sur plusieurs lignes tel quel', () => {
    const multilineText = 'Hier : PR auth\nBlocage : aucun\nAujourd’hui : chat'

    expect(startConversation(multilineText)).toEqual([{ role: 'user', content: multilineText }])
  })
})

describe('addUserMessage — serveur sans état, tout l\'historique part à chaque tour', () => {
  it("ajoute le nouveau message à la fin du fil existant", () => {
    const thread: Message[] = [
      { role: 'user', content: 'Hier : PR auth' },
      { role: 'assistant', content: 'As-tu eu des blocages ?' },
    ]
    const answer = 'Pas de blocage'

    expect(addUserMessage(thread, answer)).toEqual([
      { role: 'user', content: 'Hier : PR auth' },
      { role: 'assistant', content: 'As-tu eu des blocages ?' },
      { role: 'user', content: 'Pas de blocage' },
    ])
  })

  it('ne modifie pas le fil reçu', () => {
    const thread: Message[] = [{ role: 'user', content: 'Hier : PR auth' }]
    const originalThread: Message[] = [{ role: 'user', content: 'Hier : PR auth' }]

    addUserMessage(thread, 'Pas de blocage')

    expect(thread).toEqual(originalThread)
  })
})
