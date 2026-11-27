import { InfoIcon } from 'lucide-react'
import { standupContent } from '@/data/standup'

// Note « Astuce » penchée en haut à droite de la carte de saisie (maquette F2, valeurs estimées).
export default function TipNote() {
  return (
    <aside className="pointer-events-none absolute -top-12 -right-12 hidden w-48 rotate-3 flex-col gap-1 rounded-[4px] border border-tip-border bg-tip-bg p-3 shadow-card lg:flex">
      <p className="flex items-center gap-1 text-[10px] leading-4 font-semibold tracking-[1px] text-primary uppercase">
        <InfoIcon className="size-3.5" aria-hidden />
        {standupContent.tip.title}
      </p>
      <p className="text-xs leading-4 text-grey-text">{standupContent.tip.text}</p>
    </aside>
  )
}
