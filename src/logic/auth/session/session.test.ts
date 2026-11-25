import { describe, expect, it } from 'vitest'
import { composeGreeting, isVisitor } from '@/logic/auth/session/session'
import type { Session } from '@/types/apiContract'

describe('isVisitor — RM1 accueil, visiteur non connecté', () => {
  it("donne l'état visiteur quand la session est null", () => {
    const noSession: Session = null

    expect(isVisitor(noSession)).toBe(true)
  })

  it("ne donne pas l'état visiteur quand une session est ouverte", () => {
    const marcSession: Session = { user: { id: 'u1', name: 'Marc', email: 'marc@test.dev' } }

    expect(isVisitor(marcSession)).toBe(false)
  })
})

describe('composeGreeting — RM2 accueil, utilisateur connecté', () => {
  it('compose le titre avec le prénom de la session, prénom et « ? » en accent', () => {
    const firstName = 'Marc'

    expect(composeGreeting(firstName)).toEqual({
      title: "Qu'as-tu fait de beau aujourd'hui, ",
      titleAccent: 'Marc ?',
    })
  })

  it('reprend un prénom composé tel quel', () => {
    const composedFirstName = 'Jean-Marc'

    expect(composeGreeting(composedFirstName).titleAccent).toBe('Jean-Marc ?')
  })
})
