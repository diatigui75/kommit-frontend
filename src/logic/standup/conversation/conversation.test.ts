import { describe, expect, it } from 'vitest'
import {
  addAssistantMessage,
  addUserMessage,
  conversationBodyFor,
  isConversationUnfinished,
} from '@/logic/standup/conversation/conversation'
import type { Message } from '@/types/apiContract'

const firstExchange: Message[] = [
  { role: 'user', content: 'J’ai terminé la migration de l’auth.' },
  { role: 'assistant', content: 'As-tu rencontré des blocages ?' },
]

describe('addUserMessage — CA2 le texte de l’accueil devient le premier message', () => {
  it('fait du texte tapé sur l’accueil le premier message, avec le rôle user', () => {
    const emptyConversation: Message[] = []
    const homeText = 'J’ai terminé la migration de l’auth.'

    expect(addUserMessage(emptyConversation, homeText)).toEqual([
      { role: 'user', content: 'J’ai terminé la migration de l’auth.' },
    ])
  })

  it('garde le texte tel que tapé, sans le trimer', () => {
    const emptyConversation: Message[] = []
    const homeTextWithSpaces = '  Migration finie  '

    expect(addUserMessage(emptyConversation, homeTextWithSpaces)).toEqual([
      { role: 'user', content: '  Migration finie  ' },
    ])
  })

  it('ajoute le nouveau message à la fin de l’historique existant', () => {
    const reply = 'Pas de blocage, RAS'

    expect(addUserMessage(firstExchange, reply)).toEqual([
      ...firstExchange,
      { role: 'user', content: 'Pas de blocage, RAS' },
    ])
  })

  it('ne modifie pas l’historique reçu', () => {
    const history: Message[] = [...firstExchange]

    addUserMessage(history, 'Pas de blocage, RAS')

    expect(history).toEqual(firstExchange)
  })
})

describe('addAssistantMessage — CA2 la réponse de l’IA rejoint l’historique du tour suivant', () => {
  it('ajoute la réponse complète de l’IA à la fin de l’historique, avec le rôle assistant', () => {
    const conversationAwaitingReply: Message[] = [{ role: 'user', content: 'J’ai terminé la migration de l’auth.' }]
    const assistantReply = 'As-tu rencontré des blocages ?'

    expect(addAssistantMessage(conversationAwaitingReply, assistantReply)).toEqual(firstExchange)
  })

  it('ne modifie pas l’historique reçu', () => {
    const conversationAwaitingReply: Message[] = [{ role: 'user', content: 'J’ai terminé la migration de l’auth.' }]

    addAssistantMessage(conversationAwaitingReply, 'As-tu rencontré des blocages ?')

    expect(conversationAwaitingReply).toEqual([{ role: 'user', content: 'J’ai terminé la migration de l’auth.' }])
  })
})

describe('conversationBodyFor — CA2 tout l’historique est renvoyé à chaque tour (serveur sans état)', () => {
  it('envoie le premier message seul au premier tour', () => {
    const firstTurn: Message[] = [{ role: 'user', content: 'J’ai terminé la migration de l’auth.' }]

    expect(conversationBodyFor(firstTurn)).toEqual({
      messages: [{ role: 'user', content: 'J’ai terminé la migration de l’auth.' }],
    })
  })

  it('envoie tout l’historique, messages de l’IA compris, aux tours suivants', () => {
    const secondTurn: Message[] = [...firstExchange, { role: 'user', content: 'Pas de blocage, RAS' }]

    expect(conversationBodyFor(secondTurn)).toEqual({
      messages: [
        { role: 'user', content: 'J’ai terminé la migration de l’auth.' },
        { role: 'assistant', content: 'As-tu rencontré des blocages ?' },
        { role: 'user', content: 'Pas de blocage, RAS' },
      ],
    })
  })
})

describe('conversationBodyFor — CA29 Réessayer renvoie l’historique conservé', () => {
  it('renvoie le même historique après une erreur, sans message ajouté ni retiré', () => {
    const historyKeptAfterError: Message[] = [...firstExchange, { role: 'user', content: 'Pas de blocage, RAS' }]

    expect(conversationBodyFor(historyKeptAfterError)).toEqual({ messages: historyKeptAfterError })
  })
})

describe('isConversationUnfinished — CA7, CA44 confirmation avant de perdre la conversation', () => {
  it('vaut true en pleine conversation, standup pas encore enregistré', () => {
    const notSaved = false

    expect(isConversationUnfinished(firstExchange, notSaved)).toBe(true)
  })

  it('vaut true dès le premier message envoyé, avant toute réponse de l’IA', () => {
    const onlyFirstMessage: Message[] = [{ role: 'user', content: 'J’ai terminé la migration de l’auth.' }]
    const notSaved = false

    expect(isConversationUnfinished(onlyFirstMessage, notSaved)).toBe(true)
  })

  it('vaut true quand le récap est reçu mais pas validé (CA44)', () => {
    const conversationWithSummaryNotValidated: Message[] = [
      ...firstExchange,
      { role: 'user', content: 'Pas de blocage, RAS' },
      { role: 'assistant', content: 'Voici le résumé de ton daily. Tu valides ?' },
    ]
    const notSaved = false

    expect(isConversationUnfinished(conversationWithSummaryNotValidated, notSaved)).toBe(true)
  })

  it('vaut false une fois le standup enregistré', () => {
    const saved = true

    expect(isConversationUnfinished(firstExchange, saved)).toBe(false)
  })

  it('vaut false quand aucun message n’a été envoyé', () => {
    const emptyConversation: Message[] = []
    const notSaved = false

    expect(isConversationUnfinished(emptyConversation, notSaved)).toBe(false)
  })
})
