import { describe, expect, it } from 'vitest'
import { invalidSignupFields, visibleSignupFieldErrors } from '@/logic/auth/validation/validation'

const validSignup = { firstName: 'Marc', email: 'marc@test.dev', password: 'motdepasse' }

describe('invalidSignupFields — RM10, RM11, RM20 critères de validation du signup', () => {
  it("ne signale aucun champ quand les 3 critères sont respectés", () => {
    const signupValues = validSignup

    expect(invalidSignupFields(signupValues)).toEqual([])
  })

  it('signale le prénom vide', () => {
    const emptyFirstName = { ...validSignup, firstName: '' }

    expect(invalidSignupFields(emptyFirstName)).toEqual(['firstName'])
  })

  it("signale le prénom fait uniquement d'espaces (vide après trim)", () => {
    const blankFirstName = { ...validSignup, firstName: '   ' }

    expect(invalidSignupFields(blankFirstName)).toEqual(['firstName'])
  })

  it("accepte un prénom entouré d'espaces", () => {
    const paddedFirstName = { ...validSignup, firstName: '  Marc  ' }

    expect(invalidSignupFields(paddedFirstName)).toEqual([])
  })

  it('signale un email sans @', () => {
    const emailWithoutAt = { ...validSignup, email: 'marc.test.dev' }

    expect(invalidSignupFields(emailWithoutAt)).toEqual(['email'])
  })

  it('signale un email sans domaine', () => {
    const emailWithoutDomain = { ...validSignup, email: 'marc@' }

    expect(invalidSignupFields(emailWithoutDomain)).toEqual(['email'])
  })

  it("signale un email sans extension de domaine", () => {
    const emailWithoutTld = { ...validSignup, email: 'marc@test' }

    expect(invalidSignupFields(emailWithoutTld)).toEqual(['email'])
  })

  it('signale un email sans partie locale', () => {
    const emailWithoutLocalPart = { ...validSignup, email: '@test.dev' }

    expect(invalidSignupFields(emailWithoutLocalPart)).toEqual(['email'])
  })

  it('signale un email vide', () => {
    const emptyEmail = { ...validSignup, email: '' }

    expect(invalidSignupFields(emptyEmail)).toEqual(['email'])
  })

  it('signale un mot de passe de 7 caractères', () => {
    const sevenCharPassword = { ...validSignup, password: 'abcdefg' }

    expect(invalidSignupFields(sevenCharPassword)).toEqual(['password'])
  })

  it('accepte un mot de passe de exactement 8 caractères', () => {
    const eightCharPassword = { ...validSignup, password: 'abcdefgh' }

    expect(invalidSignupFields(eightCharPassword)).toEqual([])
  })

  it('signale les 3 champs quand aucun critère n’est respecté', () => {
    const allInvalid = { firstName: ' ', email: 'marc', password: 'abc' }

    expect(invalidSignupFields(allInvalid)).toEqual(['firstName', 'email', 'password'])
  })
})

describe('visibleSignupFieldErrors — RM30 affichage des erreurs au signup', () => {
  const invalidSignup = { firstName: 'Marc', email: 'marc', password: 'abc' }

  it("n'affiche aucune erreur avant la 1re soumission, même sur une saisie invalide", () => {
    const hasBeenSubmitted = false

    expect(visibleSignupFieldErrors(invalidSignup, hasBeenSubmitted)).toEqual({})
  })

  it('affiche les erreurs de format à la 1re soumission', () => {
    const hasBeenSubmitted = true

    expect(visibleSignupFieldErrors(invalidSignup, hasBeenSubmitted)).toEqual({
      email: 'Renseigne un email valide.',
      password: 'Ton mot de passe doit contenir au moins 8 caractères.',
    })
  })

  it("retire l'erreur d'un champ corrigé pendant la saisie, après la 1re soumission", () => {
    const signupWithFixedEmail = { ...invalidSignup, email: 'marc@test.dev' }
    const hasBeenSubmitted = true

    expect(visibleSignupFieldErrors(signupWithFixedEmail, hasBeenSubmitted)).toEqual({
      password: 'Ton mot de passe doit contenir au moins 8 caractères.',
    })
  })

  it("ajoute l'erreur d'un champ rendu invalide pendant la saisie, après la 1re soumission", () => {
    const signupWithBrokenFirstName = { ...invalidSignup, firstName: '' }
    const hasBeenSubmitted = true

    expect(visibleSignupFieldErrors(signupWithBrokenFirstName, hasBeenSubmitted)).toEqual({
      firstName: 'Renseigne ton prénom.',
      email: 'Renseigne un email valide.',
      password: 'Ton mot de passe doit contenir au moins 8 caractères.',
    })
  })
})

describe('visibleSignupFieldErrors — RM10, RM11, RM20 message de chaque erreur de format', () => {
  const hasBeenSubmitted = true

  it("affiche « Renseigne ton prénom. » pour un prénom fait uniquement d'espaces", () => {
    const blankFirstName = { ...validSignup, firstName: '   ' }

    expect(visibleSignupFieldErrors(blankFirstName, hasBeenSubmitted)).toEqual({ firstName: 'Renseigne ton prénom.' })
  })

  it('affiche « Renseigne un email valide. » pour un email sans extension de domaine', () => {
    const emailWithoutTld = { ...validSignup, email: 'marc@test' }

    expect(visibleSignupFieldErrors(emailWithoutTld, hasBeenSubmitted)).toEqual({ email: 'Renseigne un email valide.' })
  })

  it('affiche le message des 8 caractères pour un mot de passe de 7 caractères', () => {
    const sevenCharPassword = { ...validSignup, password: 'abcdefg' }

    expect(visibleSignupFieldErrors(sevenCharPassword, hasBeenSubmitted)).toEqual({
      password: 'Ton mot de passe doit contenir au moins 8 caractères.',
    })
  })
})
