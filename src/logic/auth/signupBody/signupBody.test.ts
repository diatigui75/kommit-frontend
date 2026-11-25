import { describe, expect, it } from 'vitest'
import { signupBodyFor } from '@/logic/auth/signupBody/signupBody'

describe('signupBodyFor — RM20, RM21 corps envoyé au signup', () => {
  it('retire les espaces autour du prénom et normalise l’email', () => {
    const paddedValues = { firstName: '  Marc  ', email: ' MARC@Test.dev ', password: 'motdepasse' }

    expect(signupBodyFor(paddedValues)).toEqual({ name: 'Marc', email: 'marc@test.dev', password: 'motdepasse' })
  })

  it('laisse le mot de passe intact, espaces compris', () => {
    const passwordWithSpaces = { firstName: 'Marc', email: 'marc@test.dev', password: ' mot de passe ' }

    expect(signupBodyFor(passwordWithSpaces).password).toBe(' mot de passe ')
  })
})
