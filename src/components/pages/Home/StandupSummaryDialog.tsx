import { BotIcon, ClockIcon, LoaderCircleIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import ChatMessage from '@/components/pages/Home/ChatMessage'
import SummaryBlock from '@/components/pages/Home/SummaryBlock'
import { standupContent } from '@/data/standup'
import type { StandupSummary } from '@/types/apiContract'

type StandupSummaryDialogProps = {
  open: boolean
  dateLabel: string
  summary: StandupSummary | null
  onClose: () => void
}

const { chat, summaryDialog } = standupContent

// Résumé d'un daily passé, en lecture seule (maquette F2, capture 15 ; CA14, CA30) : chargement tant qu'il n'est pas arrivé (CA46).
export default function StandupSummaryDialog({ open, dateLabel, summary, onClose }: StandupSummaryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent closeLabel={summaryDialog.closeLabel}>
        <header className="flex items-center gap-3 border-b border-field-border px-6 py-4 pr-14">
          <span className="flex size-10 items-center justify-center rounded-lg bg-linear-to-r from-primary to-blue-end">
            <BotIcon className="size-[22px] text-white" aria-hidden />
          </span>
          <div className="flex flex-col">
            <DialogTitle>{chat.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1 text-grey-text">
              <ClockIcon className="size-3" aria-hidden />
              {summaryDialog.datePrefix}
              {dateLabel}
            </DialogDescription>
          </div>
        </header>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
          {summary ? (
            <ChatMessage role="assistant">
              <p>
                {summaryDialog.intro}
                {dateLabel}
              </p>
              <SummaryBlock summary={summary} />
            </ChatMessage>
          ) : (
            <div className="flex justify-center py-6" role="status" aria-label={summaryDialog.loadingLabel}>
              <LoaderCircleIcon className="size-6 animate-spin text-primary" aria-hidden />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
