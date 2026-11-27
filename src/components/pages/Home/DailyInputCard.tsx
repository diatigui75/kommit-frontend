import { SendIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import TipNote from '@/components/pages/Home/TipNote'
import { standupContent } from '@/data/standup'

type DailyInputCardProps = {
  value: string
  onChange: (value: string) => void
  onLaunch: () => void
  isLaunchDisabled: boolean
}

// Carte de saisie de l'accueil connecté (maquette F2) : la note Astuce n'apparaît que zone vide.
export default function DailyInputCard({ value, onChange, onLaunch, isLaunchDisabled }: DailyInputCardProps) {
  return (
    <form
      className="relative flex w-full max-w-[880px] flex-col items-end gap-4 rounded-lg border border-card-border bg-white p-6 shadow-card sm:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        onLaunch()
      }}
    >
      {value === '' && <TipNote />}
      <Textarea
        aria-label={standupContent.input.label}
        placeholder={standupContent.input.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button type="submit" variant="launch" disabled={isLaunchDisabled}>
        {standupContent.input.launchLabel}
        <SendIcon aria-hidden />
      </Button>
    </form>
  )
}
