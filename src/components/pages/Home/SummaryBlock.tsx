import { standupContent } from '@/data/standup'
import type { StandupSummary } from '@/types/apiContract'

const SECTIONS = ['fait', 'blocages', 'prevu'] as const

// Récap du daily en lecture seule (CA5, CA10) : une catégorie vide affiche « Aucun », rendu en texte brut (CA30).
export default function SummaryBlock({ summary }: { summary: StandupSummary }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-field-border bg-white p-4">
      {SECTIONS.map((section) => (
        <div key={section} className="flex flex-col gap-1">
          <h3 className="text-[10px] leading-4 font-bold tracking-[1px] text-primary uppercase">
            {standupContent.summary[section]}
          </h3>
          <ul className="list-disc pl-5 text-sm leading-5 text-foreground">
            {summary[section].length === 0 ? (
              <li>{standupContent.summary.empty}</li>
            ) : (
              summary[section].map((item, index) => <li key={index}>{item}</li>)
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}
