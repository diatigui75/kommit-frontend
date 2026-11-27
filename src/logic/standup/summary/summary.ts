import { standupContent } from '@/data/standup'
import type { PostStandupBody, StandupSummary } from '@/types/apiContract'

export type SummarySection = {
  label: string
  lines: string[]
}

const SECTIONS = ['fait', 'blocages', 'prevu'] as const

// « Aucun » n'existe qu'à l'affichage : jamais un item du récap envoyé au serveur (CA10).
export function summarySectionsFor(summary: StandupSummary): SummarySection[] {
  return SECTIONS.map((section) => ({
    label: standupContent.summary[section],
    lines: summary[section].length === 0 ? [standupContent.summary.empty] : [...summary[section]],
  }))
}

// Le récap reçu repart tel quel, sans date : le serveur impose le jour (CA26).
export function standupBodyFor(summary: StandupSummary): PostStandupBody {
  return { summary }
}
