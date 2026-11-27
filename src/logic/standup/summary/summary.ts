import type { PostStandupBody, StandupSummary } from '@/types/apiContract'

export type SummarySection = {
  label: string
  lines: string[]
}

export function summarySectionsFor(_summary: StandupSummary): SummarySection[] {
  return []
}

export function standupBodyFor(_summary: StandupSummary): PostStandupBody {
  return { summary: { fait: [], blocages: [], prevu: [] } }
}
