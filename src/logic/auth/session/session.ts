import type { Session } from '@/types/apiContract'

export type Greeting = {
  title: string
  titleAccent: string
}

export function isVisitor(_session: Session): boolean {
  return false
}

export function composeGreeting(_name: string): Greeting {
  return { title: '', titleAccent: '' }
}
