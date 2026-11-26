import { summaryBlocksFor } from '@/logic/daily/summaryBlocks/summaryBlocks'
import type { StandupSummary } from '@/types/apiContract'

// Encart HIER / BLOCAGES / À VENIR dessiné depuis le JSON du résumé (CA5), « Aucun » pour une catégorie vide (CA10).
export default function DailySummary({ summary }: { summary: StandupSummary }) {
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-md border border-border bg-summary p-3">
      {summaryBlocksFor(summary).map((block) => (
        <div key={block.category}>
          <h3 className="text-[9px] font-bold tracking-[1px] text-blue-text uppercase">{block.label}</h3>
          <ul className="mt-1 list-disc pl-6 text-xs leading-5 text-grey-text">
            {block.lines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
