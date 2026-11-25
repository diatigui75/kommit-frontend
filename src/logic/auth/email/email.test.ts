import { describe, expect, it } from 'vitest'
import { normalizeEmail } from '@/logic/auth/email/email'

describe('normalizeEmail — RM21 email insensible à la casse et aux espaces', () => {
  it('ramène un email en minuscules et sans espaces autour', () => {
    const paddedUppercaseEmail = ' MARC@x.com '

    expect(normalizeEmail(paddedUppercaseEmail)).toBe('marc@x.com')
  })

  it('laisse inchangé un email déjà normalisé', () => {
    const normalizedEmail = 'marc@x.com'

    expect(normalizeEmail(normalizedEmail)).toBe('marc@x.com')
  })

  it('met en minuscules un email en casse mixte, sans espaces', () => {
    const mixedCaseEmail = 'Marc.Dupont@Test.Dev'

    expect(normalizeEmail(mixedCaseEmail)).toBe('marc.dupont@test.dev')
  })
})
