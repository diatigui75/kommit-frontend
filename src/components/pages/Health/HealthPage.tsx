import { useMutation } from '@tanstack/react-query'
import { DatabaseIcon, ServerIcon } from 'lucide-react'
import ConnectionCard, { type ConnectionStatus } from '@/components/pages/Health/ConnectionCard'
import { healthContent } from '@/data/health'
import { fetchDbHealth, fetchHealth } from '@/lib/api/health'

export default function HealthPage() {
  const serverCheck = useMutation({ mutationFn: fetchHealth })
  const databaseCheck = useMutation({ mutationFn: fetchDbHealth })

  const serverStatus: ConnectionStatus | null = serverCheck.isSuccess
    ? { isOk: true, message: healthContent.server.success }
    : serverCheck.isError
      ? { isOk: false, message: serverCheck.error.message }
      : null

  const databaseStatus: ConnectionStatus | null = databaseCheck.isSuccess
    ? databaseCheck.data.status === 'ok'
      ? { isOk: true, message: healthContent.database.success }
      : { isOk: false, message: healthContent.database.unreachable }
    : databaseCheck.isError
      ? { isOk: false, message: databaseCheck.error.message }
      : null

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{healthContent.title}</h1>
          <p className="mt-2 text-muted-foreground">{healthContent.subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ConnectionCard
            title={healthContent.server.title}
            description={healthContent.server.description}
            icon={ServerIcon}
            buttonLabel={healthContent.server.button}
            pendingButtonLabel={healthContent.server.pendingButton}
            isPending={serverCheck.isPending}
            status={serverStatus}
            onCheck={() => serverCheck.mutate()}
          />
          <ConnectionCard
            title={healthContent.database.title}
            description={healthContent.database.description}
            icon={DatabaseIcon}
            buttonLabel={healthContent.database.button}
            pendingButtonLabel={healthContent.database.pendingButton}
            isPending={databaseCheck.isPending}
            status={databaseStatus}
            onCheck={() => databaseCheck.mutate()}
          />
        </div>
      </div>
    </main>
  )
}
