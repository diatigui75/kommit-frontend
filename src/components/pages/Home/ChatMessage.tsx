import { cn } from 'cn'
import DailySummary from '@/components/pages/Home/DailySummary'
import type { Message, StandupSummary } from '@/types/apiContract'

export type ChatEntry = Message & {
  id: string
  summary?: StandupSummary
}

// Bulle du fil : utilisateur à droite en bleu plein, assistant à gauche en bleu clair, avec le résumé s'il y en a un.
export default function ChatMessage({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === 'user'

  return (
    <div
      className={cn(
        'max-w-[80%] rounded-xl px-4 py-3 text-xs leading-5 whitespace-pre-line',
        isUser ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-bubble text-foreground',
      )}
    >
      {entry.content}
      {entry.summary && <DailySummary summary={entry.summary} />}
    </div>
  )
}
