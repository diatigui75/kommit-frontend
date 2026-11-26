import { useState } from 'react'
import { Link } from 'react-router'
import { LogOutIcon } from 'lucide-react'
import type { ChatEntry } from '@/components/pages/Home/ChatMessage'
import DailyChatDialog from '@/components/pages/Home/DailyChatDialog'
import DailyEntryCard from '@/components/pages/Home/DailyEntryCard'
import { demoReply, demoStart, userEntry } from '@/components/pages/Home/demoConversation'
import PageHeading from '@/components/pages/Home/PageHeading'
import PastDailyDialog from '@/components/pages/Home/PastDailyDialog'
import QuitDailyDialog from '@/components/pages/Home/QuitDailyDialog'
import YearCalendar from '@/components/pages/Home/YearCalendar'
import { Button, buttonVariants } from '@/components/ui/button'
import PageLayout from '@/components/ui/PageLayout'
import { dailyContent } from '@/data/daily'
import { homeContent } from '@/data/home'
import { layoutContent } from '@/data/layout'
import { composeGreeting } from '@/logic/auth/session/session'
import type { Jour, Standup } from '@/types/apiContract'

type HomePageProps = {
  firstName?: string
  onSignOut?: () => void
  isSessionPending?: boolean
  isSignOutPending?: boolean
  isDailyFilled?: boolean
  today?: Jour
  standups?: Standup[]
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

// Sans firstName, accueil visiteur (RM1) ; avec, accueil connecté (RM2) avec saisie du daily, calendrier et modales F2.
export default function HomePage({
  firstName,
  onSignOut,
  isSessionPending = false,
  isSignOutPending = false,
  isDailyFilled = false,
  today = new Date().toISOString().slice(0, 10),
  standups = [],
}: HomePageProps) {
  const [draft, setDraft] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isQuitOpen, setIsQuitOpen] = useState(false)
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [openJour, setOpenJour] = useState<Jour | null>(null)

  if (isSessionPending) return <PageLayout>{null}</PageLayout>

  if (firstName) {
    const greeting = isDailyFilled
      ? {
          title: dailyContent.alreadyFilled.title,
          titleAccent: `${firstName}${dailyContent.alreadyFilled.titleAccentSuffix}`,
        }
      : composeGreeting(firstName)
    const subtitle = isDailyFilled ? dailyContent.alreadyFilled.subtitle : homeContent.connected.subtitle
    const openStandup = standups.find((standup) => standup.jour === openJour) ?? null

    function launch() {
      const turn = demoStart(draft)
      setEntries(turn.entries)
      setQuickReplies(turn.quickReplies)
      setIsChatOpen(true)
    }

    function send(text: string) {
      const turn = demoReply(text, entries)
      setEntries([...entries, userEntry(text), ...turn.entries])
      setQuickReplies(turn.quickReplies)
    }

    function quit() {
      setIsQuitOpen(false)
      setIsChatOpen(false)
    }

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
          <PageHeading title={greeting.title} titleAccent={greeting.titleAccent} subtitle={subtitle} />
          <DailyEntryCard value={draft} onChange={setDraft} onLaunch={launch} />
          <YearCalendar
            today={today}
            count={standups.length}
            recordedJours={standups.map((standup) => standup.jour)}
            onOpenDay={setOpenJour}
          />
        </div>
        <DailyChatDialog
          isOpen={isChatOpen}
          entries={entries}
          quickReplies={quickReplies}
          onClose={() => setIsQuitOpen(true)}
          onSend={send}
        />
        <QuitDailyDialog isOpen={isQuitOpen} onContinue={() => setIsQuitOpen(false)} onQuit={quit} />
        <PastDailyDialog
          standup={openStandup}
          dateLabel={openJour ? formatJour(openJour) : ''}
          onClose={() => setOpenJour(null)}
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
