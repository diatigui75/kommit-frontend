import type { StandupSummary } from '@/types/apiContract'

// `lines` est ce qui s'affiche : les items, ou « Aucun » pour une catégorie vide (CA10).
export type SummaryBlock = {
  category: keyof StandupSummary
  label: string
  lines: string[]
  isEmpty: boolean
}

export function summaryBlocksFor(_summary: StandupSummary): SummaryBlock[] {
  return []
}
