import type { Message } from '@/types/apiContract'

export function startConversation(_text: string): Message[] {
  return []
}

// Le serveur est sans état : chaque tour renvoie tout l'historique.
export function addUserMessage(_messages: Message[], _text: string): Message[] {
  return []
}
