import { SendIcon } from 'lucide-react'
import TipNote from '@/components/pages/Home/TipNote'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { dailyContent } from '@/data/daily'

type DailyEntryCardProps = {
  value: string
  onChange: (value: string) => void
  isLaunchDisabled: boolean
  onLaunch: () => void
}

// Carte de saisie du daily, bouton inactif sur une zone vide ou blanche (CA39). La note ASTUCE disparaît dès qu'on tape.
export default function DailyEntryCard({ value, onChange, isLaunchDisabled, onLaunch }: DailyEntryCardProps) {
  const isEmpty = value.trim() === ''

  return (
    <section className="relative w-full max-w-[600px] rounded-lg border border-card-border bg-white px-6 pt-6 pb-4 shadow-card">
      {isEmpty && <TipNote />}
      <Textarea
        aria-label={dailyContent.entry.label}
        placeholder={dailyContent.entry.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="mt-4 flex justify-end border-t border-border pt-4">
        <Button variant="launch" type="button" disabled={isLaunchDisabled} onClick={onLaunch}>
          {dailyContent.entry.launchLabel}
          <SendIcon aria-hidden />
        </Button>
      </div>
    </section>
  )
}
