import { useState, type ReactNode } from 'react'
import { BotIcon, LoaderCircleIcon, SendIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import ChatMessage from '@/components/pages/Home/ChatMessage'
import SummaryBlock from '@/components/pages/Home/SummaryBlock'
import { standupContent } from '@/data/standup'
import { isSendDisabled } from '@/logic/standup/buttons/buttons'
import { isWaitingIndicatorVisible } from '@/logic/standup/sse/sse'
import type { Message, StandupSummary } from '@/types/apiContract'

type StandupChatDialogProps = {
  open: boolean
  messages: Message[]
  streamingText: string
  isStreaming: boolean
  summary: StandupSummary | null
  errorMessage: string | null
  isValidateDisabled: boolean
  onRequestClose: () => void
  onSend: (text: string) => void
  onValidate: () => void
  onRetry: () => void
  children?: ReactNode
}

const { chat } = standupContent

// Modale de conversation du daily (maquette F2) : la fermeture (×, Échap, voile) passe par onRequestClose (CA7, CA44).
export default function StandupChatDialog({
  open,
  messages,
  streamingText,
  isStreaming,
  summary,
  errorMessage,
  isValidateDisabled,
  onRequestClose,
  onSend,
  onValidate,
  onRetry,
  children,
}: StandupChatDialogProps) {
  const [draft, setDraft] = useState('')
  const isDraftSendDisabled = isSendDisabled({ text: draft, isStreaming })

  const send = () => {
    if (isDraftSendDisabled) return
    onSend(draft)
    setDraft('')
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onRequestClose()}>
      <DialogContent closeLabel={chat.closeLabel}>
        <header className="flex items-center gap-3 border-b border-field-border px-6 py-4 pr-14">
          <span className="flex size-10 items-center justify-center rounded-lg bg-linear-to-r from-primary to-blue-end">
            <BotIcon className="size-[22px] text-white" aria-hidden />
          </span>
          <div className="flex flex-col">
            <DialogTitle>{chat.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1 text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              {chat.status}
            </DialogDescription>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6" aria-live="polite">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role}>
              {message.content}
            </ChatMessage>
          ))}
          {isWaitingIndicatorVisible({ isStreaming, receivedText: streamingText }) && (
            <ChatMessage role="assistant">
              <span className="flex items-center gap-2 text-grey-text">
                <LoaderCircleIcon className="size-4 animate-spin" aria-hidden />
                {chat.waitingLabel}
              </span>
            </ChatMessage>
          )}
          {streamingText !== '' && <ChatMessage role="assistant">{streamingText}</ChatMessage>}
          {summary && (
            <ChatMessage role="assistant">
              <p>{chat.summaryIntro}</p>
              <SummaryBlock summary={summary} />
              <div className="flex flex-wrap gap-2">
                <Button variant="chip" onClick={onValidate} disabled={isValidateDisabled}>
                  {chat.validateLabel}
                </Button>
                <Button variant="chip" onClick={() => document.getElementById('standup-message')?.focus()}>
                  {chat.addInfoLabel}
                </Button>
              </div>
            </ChatMessage>
          )}
          {errorMessage && (
            <div role="alert" className="flex flex-col items-start gap-2 self-start text-sm text-danger">
              <p>{errorMessage}</p>
              <Button variant="chip" onClick={onRetry}>
                {chat.retryLabel}
              </Button>
            </div>
          )}
        </div>

        <form
          className="border-t border-field-border px-6 py-4"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <div className="flex h-[43px] items-center gap-2 rounded-[4px] border border-b-2 border-field-border bg-field px-3">
            <input
              id="standup-message"
              aria-label={chat.messagePlaceholder}
              placeholder={chat.messagePlaceholder}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
            />
            <button
              type="submit"
              aria-label={chat.sendLabel}
              disabled={isDraftSendDisabled}
              className="cursor-pointer text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon className="size-5" aria-hidden />
            </button>
          </div>
        </form>
        {children}
      </DialogContent>
    </Dialog>
  )
}
