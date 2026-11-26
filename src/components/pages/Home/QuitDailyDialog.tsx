import { CircleAlertIcon, DoorOpenIcon, XIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { dailyContent } from '@/data/daily'

type QuitDailyDialogProps = {
  isOpen: boolean
  onContinue: () => void
  onQuit: () => void
}

// Confirmation avant de quitter un daily non validé. La croix revient au chat, comme « Poursuivre ».
export default function QuitDailyDialog({ isOpen, onContinue, onQuit }: QuitDailyDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onContinue()}>
      <AlertDialogContent>
        <Button
          variant="icon"
          type="button"
          aria-label={dailyContent.quit.closeLabel}
          onClick={onContinue}
          className="absolute top-2 right-2"
        >
          <XIcon aria-hidden />
        </Button>
        <CircleAlertIcon className="size-6 text-primary" aria-hidden />
        <AlertDialogTitle>{dailyContent.quit.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {dailyContent.quit.text.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </AlertDialogDescription>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" type="button" onClick={onContinue}>
            {dailyContent.quit.continueLabel}
          </Button>
          <Button variant="danger" type="button" onClick={onQuit}>
            {dailyContent.quit.quitLabel}
            <DoorOpenIcon aria-hidden />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
