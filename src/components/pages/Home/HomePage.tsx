import { useMutation } from '@tanstack/react-query'
import { DatabaseIcon, ServerIcon } from 'lucide-react'
import ConnectionCard, { type ConnectionStatus } from '@/components/pages/Home/ConnectionCard'
import { homeContent } from '@/data/home'
import { fetchDbHealth, fetchHealth } from '@/lib/api/health'

export default function HomePage() {
  const serverCheck = useMutation({ mutationFn: fetchHealth })
  const databaseCheck = useMutation({ mutationFn: fetchDbHealth })

  const serverStatus: ConnectionStatus | null = serverCheck.isSuccess
    ? { isOk: true, message: homeContent.server.success }
    : serverCheck.isError
      ? { isOk: false, message: serverCheck.error.message }
      : null

  const databaseStatus: ConnectionStatus | null = databaseCheck.isSuccess
    ? databaseCheck.data.status === 'ok'
      ? { isOk: true, message: homeContent.database.success }
      : { isOk: false, message: homeContent.database.unreachable }
    : databaseCheck.isError
      ? { isOk: false, message: databaseCheck.error.message }
      : null

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{homeContent.title}</h1>
          <p className="mt-2 text-muted-foreground">{homeContent.subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ConnectionCard
            title={homeContent.server.title}
            description={homeContent.server.description}
            icon={ServerIcon}
            buttonLabel={homeContent.server.button}
            pendingButtonLabel={homeContent.server.pendingButton}
            isPending={serverCheck.isPending}
            status={serverStatus}
            onCheck={() => serverCheck.mutate()}
          />
          <ConnectionCard
            title={homeContent.database.title}
            description={homeContent.database.description}
            icon={DatabaseIcon}
            buttonLabel={homeContent.database.button}
            pendingButtonLabel={homeContent.database.pendingButton}
            isPending={databaseCheck.isPending}
            status={databaseStatus}
            onCheck={() => databaseCheck.mutate()}
          />
        </div>
      </div>
    </main>
  )
}
