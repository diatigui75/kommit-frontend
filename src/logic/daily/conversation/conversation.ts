import type { Message } from '@/types/apiContract'

// Le texte de l'accueil devient le 1er message de l'utilisateur (CA2).
export function startConversation(text: string): Message[] {
  return [{ role: 'user', content: text }]
}

// Le serveur est sans état : chaque tour renvoie tout l'historique.
export function addUserMessage(messages: Message[], text: string): Message[] {
  return [...messages, { role: 'user', content: text }]
}
