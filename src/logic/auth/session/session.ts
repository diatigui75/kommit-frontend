import { homeContent } from '@/data/home'
import type { Session } from '@/types/apiContract'

export type Greeting = {
  title: string
  titleAccent: string
}

export function isVisitor(session: Session): boolean {
  return session === null
}

export function composeGreeting(name: string): Greeting {
  return {
    title: homeContent.connected.title,
    titleAccent: `${name}${homeContent.connected.titleAccentSuffix}`,
  }
}
