import { BotIcon, CalendarIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { dailyContent } from '@/data/daily'

type AssistantHeaderProps = {
  // Sans date, statut « Live Sync Active » du chat ; avec, date du daily passé.
  dateLabel?: string
  onClose: () => void
}

// En-tête des modales du daily : avatar, nom de l'assistant, statut ou date, croix.
export default function AssistantHeader({ dateLabel, onClose }: AssistantHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <BotIcon className="size-5" aria-hidden />
      </span>
      <div className="flex flex-1 flex-col">
        <DialogTitle>{dailyContent.assistant.name}</DialogTitle>
        <DialogDescription className="flex items-center gap-1 text-[10px]">
          {dateLabel ? (
            <>
              <CalendarIcon className="size-3" aria-hidden />
              {dailyContent.assistant.datePrefix}
              {dateLabel}
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              <span className="text-success">{dailyContent.assistant.liveStatus}</span>
            </>
          )}
        </DialogDescription>
      </div>
      <Button variant="icon" type="button" aria-label={dailyContent.assistant.closeLabel} onClick={onClose}>
        <XIcon aria-hidden />
      </Button>
    </header>
  )
}
