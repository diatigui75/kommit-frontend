import { LoaderCircleIcon } from 'lucide-react'
import AssistantHeader from '@/components/pages/Home/AssistantHeader'
import DailySummary from '@/components/pages/Home/DailySummary'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { dailyContent } from '@/data/daily'
import type { SummaryDialogState } from '@/logic/daily/summaryDialog/summaryDialog'

type PastDailyDialogProps = {
  isOpen: boolean
  state: SummaryDialogState
  dateLabel: string
  onClose: () => void
}

// Résumé d'un daily passé, en lecture seule (CA14), avec un chargement pendant la requête (CA46).
export default function PastDailyDialog({ isOpen, state, dateLabel, onClose }: PastDailyDialogProps) {
  return (
    <Dialog open={isOpen && (state.kind === 'loading' || state.kind === 'summary')} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <AssistantHeader dateLabel={dateLabel} onClose={onClose} />
        <div className="px-4 py-4">
          {state.kind === 'summary' ? (
            <div className="max-w-[80%] rounded-xl bg-bubble px-4 py-3 text-xs leading-5 text-foreground">
              {dailyContent.pastDaily.intro}
              {dateLabel}
              <DailySummary summary={state.standup.summary} />
            </div>
          ) : (
            <LoaderCircleIcon
              className="mx-auto size-5 animate-spin text-grey-blue"
              aria-label={dailyContent.pastDaily.loadingLabel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
