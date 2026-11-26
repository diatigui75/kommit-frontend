import { dailyContent } from '@/data/daily'
import { summaryItemsToDisplay } from '@/logic/daily/summaryItems/summaryItems'
import type { StandupSummary } from '@/types/apiContract'

// `lines` est ce qui s'affiche : les items, ou « Aucun » pour une catégorie vide (CA10).
export type SummaryBlock = {
  category: keyof StandupSummary
  label: string
  lines: string[]
  isEmpty: boolean
}

const CATEGORIES = ['fait', 'blocages', 'prevu'] as const

export function summaryBlocksFor(summary: StandupSummary): SummaryBlock[] {
  return CATEGORIES.map((category) => ({
    category,
    label: dailyContent.summary[category],
    lines: summaryItemsToDisplay(summary[category]),
    isEmpty: summary[category].length === 0,
  }))
}
