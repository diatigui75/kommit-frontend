import { CircleAlertIcon, DoorOpenIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type StandupConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

// Confirmation du daily (maquette F2) : quitter une conversation non validée (CA7) ou refaire un daily existant (CA9).
export default function StandupConfirmDialog({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: StandupConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <AlertDialogContent>
        <CircleAlertIcon className="size-8 text-primary" aria-hidden />
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <div className="flex flex-col gap-4 pt-2 sm:flex-row">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
            <DoorOpenIcon aria-hidden />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
