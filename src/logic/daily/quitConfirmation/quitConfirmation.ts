import type { Message } from '@/types/apiContract'

export type ConversationProgress = {
  messages: Message[]
  isSaved: boolean
}

// Un échange commencé et non enregistré serait perdu : on confirme avant de fermer (CA7, CA44).
export function isConversationUnfinished(progress: ConversationProgress): boolean {
  return progress.messages.length > 0 && !progress.isSaved
}
