import { useEffect, useRef, useState } from 'react'
import { SendIcon } from 'lucide-react'
import AssistantHeader from '@/components/pages/Home/AssistantHeader'
import ChatMessage, { type ChatEntry } from '@/components/pages/Home/ChatMessage'
import QuickReplies from '@/components/pages/Home/QuickReplies'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { dailyContent } from '@/data/daily'
import { isSendDisabled } from '@/logic/daily/composer/composer'
import type { StreamErrorDisplay } from '@/logic/daily/streamError/streamError'

type DailyChatDialogProps = {
  isOpen: boolean
  entries: ChatEntry[]
  quickReplies?: string[]
  isAwaitingReply: boolean
  isStreaming: boolean
  error: StreamErrorDisplay | null
  onRetry: () => void
  isValidateDisabled: boolean
  onValidate: () => void
  onClose: () => void
  onSend: (text: string) => void
}

// Modale du chat. La croix, Échap et le clic dehors passent par onClose, qui demande confirmation (CA7, CA44).
export default function DailyChatDialog({
  isOpen,
  entries,
  quickReplies = [],
  isAwaitingReply,
  isStreaming,
  error,
  onRetry,
  isValidateDisabled,
  onValidate,
  onClose,
  onSend,
}: DailyChatDialogProps) {
  const [draft, setDraft] = useState('')
  const threadEndRef = useRef<HTMLDivElement>(null)
  const isDraftSendDisabled = isSendDisabled({ text: draft, isStreaming })

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' })
  }, [entries, isAwaitingReply, error])

  function send(text: string) {
    if (isSendDisabled({ text, isStreaming })) return
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
          {isAwaitingReply && (
            <p role="status" className="self-start rounded-xl bg-bubble px-4 py-3 text-xs leading-5 text-grey-blue">
              {dailyContent.assistant.typingLabel}
            </p>
          )}
          {error && (
            <div role="alert" className="flex flex-col items-start gap-2 self-start text-xs leading-5 text-destructive">
              {error.message}
              {error.kind === 'llm' && (
                <Button variant="outline" type="button" onClick={onRetry} disabled={isStreaming}>
                  {dailyContent.assistant.retryLabel}
                </Button>
              )}
            </div>
          )}
          {quickReplies.length > 0 && <QuickReplies replies={quickReplies} onPick={send} />}
          <div ref={threadEndRef} />
        </div>
        <div className="flex justify-end px-3 pt-1">
          <Button variant="launch" type="button" disabled={isValidateDisabled} onClick={onValidate}>
            {dailyContent.assistant.validateLabel}
          </Button>
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
            disabled={isDraftSendDisabled}
            aria-label={dailyContent.assistant.sendLabel}
            className="cursor-pointer text-primary hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <SendIcon className="size-4" aria-hidden />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
