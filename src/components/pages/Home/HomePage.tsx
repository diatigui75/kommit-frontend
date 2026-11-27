import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { LoaderCircleIcon, LogOutIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import DailyInputCard from '@/components/pages/Home/DailyInputCard'
import PageHeading from '@/components/pages/Home/PageHeading'
import YearCalendar from '@/components/pages/Home/YearCalendar'
import PageLayout from '@/components/ui/PageLayout'
import { homeContent } from '@/data/home'
import { layoutContent } from '@/data/layout'
import { standupContent } from '@/data/standup'
import { composeGreeting } from '@/logic/auth/session/session'

export type TodayStatus = 'unknown' | 'todo' | 'done'

type HomePageProps = {
  firstName?: string
  onSignOut?: () => void
  isSessionPending?: boolean
  isSignOutPending?: boolean
  todayStatus?: TodayStatus
  draft?: string
  onDraftChange?: (value: string) => void
  onLaunch?: () => void
  isLaunchDisabled?: boolean
  calendarCount?: number
  calendarWeeks?: boolean[][]
  dialogs?: ReactNode
}

// Sans firstName, accueil visiteur (RM1) ; avec, accueil connecté et daily du jour (RM2, CA1, CA8, CA42).
export default function HomePage({
  firstName,
  onSignOut,
  isSessionPending = false,
  isSignOutPending = false,
  todayStatus = 'unknown',
  draft = '',
  onDraftChange = () => undefined,
  onLaunch = () => undefined,
  isLaunchDisabled = true,
  calendarCount = 0,
  calendarWeeks = [],
  dialogs,
}: HomePageProps) {
  if (isSessionPending) return <PageLayout>{null}</PageLayout>

  if (firstName) {
    const greeting = composeGreeting(firstName)

    return (
      <PageLayout
        navbarActions={
          <Button variant="tertiary" onClick={onSignOut} disabled={isSignOutPending}>
            <LogOutIcon aria-hidden />
            {layoutContent.signoutLabel}
          </Button>
        }
      >
        <div className="py-8">
          {todayStatus === 'unknown' && (
            <div className="flex justify-center py-12" role="status" aria-label="Chargement du daily du jour">
              <LoaderCircleIcon className="size-8 animate-spin text-primary" aria-hidden />
            </div>
          )}
          {todayStatus === 'todo' && (
            <PageHeading
              title={greeting.title}
              titleAccent={greeting.titleAccent}
              subtitle={homeContent.connected.subtitle}
            />
          )}
          {todayStatus === 'done' && (
            <PageHeading
              title=""
              titleAccent={standupContent.home.alreadyDoneTitle}
              subtitle={standupContent.home.alreadyDoneSubtitle}
            />
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-12 pb-8">
          <DailyInputCard
            value={draft}
            onChange={onDraftChange}
            onLaunch={onLaunch}
            isLaunchDisabled={isLaunchDisabled}
          />
          <YearCalendar count={calendarCount} weeks={calendarWeeks} />
        </div>
        {dialogs}
      </PageLayout>
    )
  }

  return (
    <PageLayout
      navbarActions={
        <>
          <Link to="/signin" className={buttonVariants({ variant: 'secondary' })}>
            {layoutContent.signinLabel}
          </Link>
          <Link to="/signup" className={buttonVariants({ variant: 'primary' })}>
            {layoutContent.signupLabel}
          </Link>
        </>
      }
    >
      <div className="py-8">
        <PageHeading
          title={homeContent.visitor.title}
          titleAccent={homeContent.visitor.titleAccent}
          subtitle={homeContent.visitor.subtitle}
        />
      </div>
    </PageLayout>
  )
}
