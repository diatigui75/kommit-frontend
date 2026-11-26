import type { PostStandupBody, StandupSummary } from '@/types/apiContract'

export function standupBodyFor(_summary: StandupSummary): PostStandupBody {
  return { summary: { fait: [], blocages: [], prevu: [] } }
}
