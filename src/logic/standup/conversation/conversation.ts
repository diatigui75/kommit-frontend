import type { Message, PostConversationBody } from '@/types/apiContract'

export function addUserMessage(_messages: Message[], _text: string): Message[] {
  return []
}

export function addAssistantMessage(_messages: Message[], _text: string): Message[] {
  return []
}

export function conversationBodyFor(_messages: Message[]): PostConversationBody {
  return { messages: [] }
}

export function isConversationUnfinished(_messages: Message[], _isSaved: boolean): boolean {
  return false
}
