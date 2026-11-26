import { dailyContent } from '@/data/daily'

// Items d'une catégorie du résumé ; une catégorie vide affiche « Aucun » (CA30).
export function summaryItemsToDisplay(items: string[]): string[] {
  return items.length === 0 ? [dailyContent.summary.empty] : [...items]
}
