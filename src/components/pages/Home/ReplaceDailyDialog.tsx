import { CircleAlertIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { dailyContent } from '@/data/daily'

type ReplaceDailyDialogProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

// Alerte avant de relancer un daily déjà enregistré, qui serait remplacé à la validation (CA9). Même forme que la popup quitter.
export default function ReplaceDailyDialog({ isOpen, onCancel, onConfirm }: ReplaceDailyDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <CircleAlertIcon className="size-6 text-primary" aria-hidden />
        <AlertDialogTitle>{dailyContent.replace.title}</AlertDialogTitle>
        <AlertDialogDescription>{dailyContent.replace.text}</AlertDialogDescription>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" type="button" onClick={onCancel}>
            {dailyContent.replace.cancelLabel}
          </Button>
          <Button variant="launch" type="button" onClick={onConfirm}>
            {dailyContent.replace.confirmLabel}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
