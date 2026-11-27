import { homeContent } from '@/data/home'
import type { Session } from '@/types/apiContract'

export type Greeting = {
  title: string
  titleAccent: string
}

export function isVisitor(session: Session): boolean {
  return session === null
}

// Pendant une soumission, la page part elle-même vers l'accueil avec l'origine du toast : pas de redirection en double.
export function shouldLeaveAuthPage(session: Session | undefined, isSubmitting: boolean): boolean {
  return session !== undefined && !isVisitor(session) && !isSubmitting
}

export function composeGreeting(name: string): Greeting {
  return {
    title: homeContent.connected.title,
    titleAccent: `${name}${homeContent.connected.titleAccentSuffix}`,
  }
}
