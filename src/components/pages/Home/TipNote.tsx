import { InfoIcon } from 'lucide-react'
import { dailyContent } from '@/data/daily'

// Note ASTUCE en post-it penché, qui déborde du coin haut droit de la carte de saisie.
export default function TipNote() {
  return (
    <aside className="pointer-events-none absolute -top-7 -right-6 hidden w-[100px] rotate-3 flex-col gap-1 rounded-sm border border-tip-border bg-tip p-2 text-[9px] leading-3 text-grey-text shadow-card md:flex">
      <span className="flex items-center gap-1 font-bold tracking-[1px] text-blue-text uppercase">
        <InfoIcon className="size-3" aria-hidden />
        {dailyContent.tip.title}
      </span>
      {dailyContent.tip.text}
    </aside>
  )
}
