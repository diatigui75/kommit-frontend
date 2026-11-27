import type { Message, PostConversationBody } from '@/types/apiContract'

export function addUserMessage(messages: Message[], text: string): Message[] {
  return [...messages, { role: 'user', content: text }]
}

export function addAssistantMessage(messages: Message[], text: string): Message[] {
  return [...messages, { role: 'assistant', content: text }]
}

// Le serveur est sans état : tout l'historique repart à chaque tour.
export function conversationBodyFor(messages: Message[]): PostConversationBody {
  return { messages: [...messages] }
}

// Un récap reçu mais non validé est perdu à la fermeture : il faut confirmer aussi dans ce cas (CA44).
export function isConversationUnfinished(messages: Message[], isSaved: boolean): boolean {
  return messages.length > 0 && !isSaved
}
