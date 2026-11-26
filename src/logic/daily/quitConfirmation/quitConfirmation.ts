import type { Message } from '@/types/apiContract'

export type ConversationProgress = {
  messages: Message[]
  isSaved: boolean
}

export function isConversationUnfinished(_progress: ConversationProgress): boolean {
  return false
}
