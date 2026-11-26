import type { PostStandupBody, StandupSummary } from '@/types/apiContract'

// Le dernier récap reçu repart tel quel, sans date : le serveur impose le jour (CA26).
export function standupBodyFor(summary: StandupSummary): PostStandupBody {
  return { summary }
}
