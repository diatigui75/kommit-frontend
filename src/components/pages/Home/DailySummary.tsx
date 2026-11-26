import { dailyContent } from '@/data/daily'
import type { StandupSummary } from '@/types/apiContract'

const SECTIONS = ['fait', 'blocages', 'prevu'] as const

// Encart HIER / BLOCAGES / À VENIR. Une catégorie vide affiche « Aucun » (contrat : liste vide).
export default function DailySummary({ summary }: { summary: StandupSummary }) {
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-md border border-border bg-summary p-3">
      {SECTIONS.map((section) => (
        <div key={section}>
          <h3 className="text-[9px] font-bold tracking-[1px] text-blue-text uppercase">
            {dailyContent.summary[section]}
          </h3>
          <ul className="mt-1 list-disc pl-6 text-xs leading-5 text-grey-text">
            {summary[section].length === 0 ? (
              <li>{dailyContent.summary.empty}</li>
            ) : (
              summary[section].map((item) => <li key={item}>{item}</li>)
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}
