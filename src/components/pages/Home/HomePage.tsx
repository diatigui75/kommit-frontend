import { Link } from 'react-router'
import { LoaderCircleIcon, LogOutIcon } from 'lucide-react'
import DailyChatDialog from '@/components/pages/Home/DailyChatDialog'
import DailyEntryCard from '@/components/pages/Home/DailyEntryCard'
import PageHeading from '@/components/pages/Home/PageHeading'
import PastDailyDialog from '@/components/pages/Home/PastDailyDialog'
import QuitDailyDialog from '@/components/pages/Home/QuitDailyDialog'
import ReplaceDailyDialog from '@/components/pages/Home/ReplaceDailyDialog'
import type { DailyStandup } from '@/components/pages/Home/useDailyStandup'
import YearCalendar from '@/components/pages/Home/YearCalendar'
import { Button, buttonVariants } from '@/components/ui/button'
import PageLayout from '@/components/ui/PageLayout'
import { dailyContent } from '@/data/daily'
import { homeContent } from '@/data/home'
import { layoutContent } from '@/data/layout'
import type { Jour } from '@/types/apiContract'

type HomePageProps = {
  firstName?: string
  onSignOut?: () => void
  isSessionPending?: boolean
  isSignOutPending?: boolean
  daily?: DailyStandup
}

function formatJour(jour: Jour): string {
  return new Date(`${jour}T00:00:00Z`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// Sans firstName, accueil visiteur (RM1) ; avec, accueil connecté avec saisie du daily, calendrier et modales (KOM-19, KOM-22).
export default function HomePage({
  firstName,
  onSignOut,
  isSessionPending = false,
  isSignOutPending = false,
  daily,
}: HomePageProps) {
  if (isSessionPending) return <PageLayout>{null}</PageLayout>

  if (firstName && daily) {
    const subtitle = daily.isDailyFilled ? dailyContent.alreadyFilled.subtitle : homeContent.connected.subtitle

    return (
      <PageLayout
        navbarActions={
          <Button variant="tertiary" onClick={onSignOut} disabled={isSignOutPending}>
            <LogOutIcon aria-hidden />
            {layoutContent.signoutLabel}
          </Button>
        }
      >
        <div className="flex w-full flex-col items-center gap-10 py-8">
          {daily.heading.kind === 'loader' ? (
            <LoaderCircleIcon className="my-12 size-8 animate-spin text-grey-blue" aria-label={dailyContent.headingLoader} />
          ) : (
            <PageHeading title={daily.heading.title} titleAccent={daily.heading.titleAccent} subtitle={subtitle} />
          )}
          <DailyEntryCard {...daily.entry} />
          <YearCalendar {...daily.calendar} />
        </div>
        <DailyChatDialog {...daily.chat} />
        <QuitDailyDialog {...daily.quit} />
        <ReplaceDailyDialog {...daily.replace} />
        <PastDailyDialog
          state={daily.pastDaily.state}
          dateLabel={daily.pastDaily.jour ? formatJour(daily.pastDaily.jour) : ''}
          onClose={daily.pastDaily.onClose}
        />
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
