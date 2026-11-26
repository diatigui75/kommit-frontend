import AssistantHeader from '@/components/pages/Home/AssistantHeader'
import DailySummary from '@/components/pages/Home/DailySummary'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { dailyContent } from '@/data/daily'
import type { Standup } from '@/types/apiContract'

type PastDailyDialogProps = {
  standup: Standup | null
  dateLabel: string
  onClose: () => void
}

// Résumé d'un daily passé, en lecture seule : pas de champ de saisie.
export default function PastDailyDialog({ standup, dateLabel, onClose }: PastDailyDialogProps) {
  return (
    <Dialog open={standup !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <AssistantHeader dateLabel={dateLabel} onClose={onClose} />
        {standup && (
          <div className="px-4 py-4">
            <div className="max-w-[80%] rounded-xl bg-bubble px-4 py-3 text-xs leading-5 text-foreground">
              {dailyContent.pastDaily.intro}
              {dateLabel}
              <DailySummary summary={standup.summary} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
