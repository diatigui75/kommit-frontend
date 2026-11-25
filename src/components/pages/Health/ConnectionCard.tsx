import type { ComponentType } from 'react'
import { CircleCheckIcon, CircleXIcon, LoaderCircleIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type ConnectionStatus = {
  isOk: boolean
  message: string
}

type ConnectionCardProps = {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  buttonLabel: string
  pendingButtonLabel: string
  isPending: boolean
  status: ConnectionStatus | null
  onCheck: () => void
}

// Carte d'une vérification : bouton, état en cours et résultat ok ou en échec.
export default function ConnectionCard({
  title,
  description,
  icon: Icon,
  buttonLabel,
  pendingButtonLabel,
  isPending,
  status,
  onCheck,
}: ConnectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex min-h-6 items-center">
          {status && !isPending && (
            <Badge variant={status.isOk ? 'success' : 'destructive'}>
              {status.isOk ? <CircleCheckIcon /> : <CircleXIcon />}
              {status.message}
            </Badge>
          )}
        </div>
        <Button onClick={onCheck} disabled={isPending} className="w-full">
          {isPending && <LoaderCircleIcon className="animate-spin" />}
          {isPending ? pendingButtonLabel : buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
