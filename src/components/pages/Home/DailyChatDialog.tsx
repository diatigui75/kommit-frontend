import { useEffect, useRef, useState } from 'react'
import { SendIcon } from 'lucide-react'
import AssistantHeader from '@/components/pages/Home/AssistantHeader'
import ChatMessage, { type ChatEntry } from '@/components/pages/Home/ChatMessage'
import QuickReplies from '@/components/pages/Home/QuickReplies'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { dailyContent } from '@/data/daily'

type DailyChatDialogProps = {
  isOpen: boolean
  entries: ChatEntry[]
  quickReplies: string[]
  onClose: () => void
  onSend: (text: string) => void
}

// Modale du chat. La croix, Échap et le clic dehors passent par onClose, qui demande confirmation.
export default function DailyChatDialog({ isOpen, entries, quickReplies, onClose, onSend }: DailyChatDialogProps) {
  const [draft, setDraft] = useState('')
  const threadEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' })
  }, [entries, quickReplies])

  function send(text: string) {
    if (text.trim() === '') return
    onSend(text)
    setDraft('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[min(640px,calc(100svh-2rem))]">
        <AssistantHeader onClose={onClose} />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
          {entries.map((entry) => (
            <ChatMessage key={entry.id} entry={entry} />
          ))}
          {quickReplies.length > 0 && <QuickReplies replies={quickReplies} onPick={send} />}
          <div ref={threadEndRef} />
        </div>
        <form
          className="m-3 flex items-center gap-2 rounded-md bg-field px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault()
            send(draft)
          }}
        >
          <input
            aria-label={dailyContent.assistant.messagePlaceholder}
            placeholder={dailyContent.assistant.messagePlaceholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="flex-1 bg-transparent text-xs leading-5 text-grey-text outline-none placeholder:text-placeholder"
          />
          <button
            type="submit"
            aria-label={dailyContent.assistant.sendLabel}
            className="cursor-pointer text-primary hover:opacity-70"
          >
            <SendIcon className="size-4" aria-hidden />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
