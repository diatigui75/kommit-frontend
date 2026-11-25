import { describe, expect, it } from 'vitest'
import { isSigninSubmitDisabled, isSignupSubmitDisabled } from '@/logic/auth/submitButton/submitButton'

describe('isSigninSubmitDisabled — RM32 bouton « Me connecter » grisé si champs vides', () => {
  it('désactive le bouton quand les 2 champs sont vides', () => {
    const emptyForm = { email: '', password: '', isPending: false }

    expect(isSigninSubmitDisabled(emptyForm)).toBe(true)
  })

  it("désactive le bouton quand seul l'email est rempli", () => {
    const formWithoutPassword = { email: 'marc@test.dev', password: '', isPending: false }

    expect(isSigninSubmitDisabled(formWithoutPassword)).toBe(true)
  })

  it('désactive le bouton quand seul le mot de passe est rempli', () => {
    const formWithoutEmail = { email: '', password: 'motdepasse', isPending: false }

    expect(isSigninSubmitDisabled(formWithoutEmail)).toBe(true)
  })

  it("désactive le bouton quand l'email n'est fait que d'espaces", () => {
    const formWithBlankEmail = { email: '   ', password: 'motdepasse', isPending: false }

    expect(isSigninSubmitDisabled(formWithBlankEmail)).toBe(true)
  })

  it("désactive le bouton quand le mot de passe n'est fait que d'espaces", () => {
    const formWithBlankPassword = { email: 'marc@test.dev', password: '        ', isPending: false }

    expect(isSigninSubmitDisabled(formWithBlankPassword)).toBe(true)
  })

  it('active le bouton quand les 2 champs sont remplis', () => {
    const filledForm = { email: 'marc@test.dev', password: 'motdepasse', isPending: false }

    expect(isSigninSubmitDisabled(filledForm)).toBe(false)
  })
})

describe('isSigninSubmitDisabled — RM10, RM11, RM20 aucun contrôle de format au signin', () => {
  it('active le bouton avec un email mal formé et un mot de passe de moins de 8 caractères', () => {
    const malformedCredentials = { email: 'marc', password: 'abc', isPending: false }

    expect(isSigninSubmitDisabled(malformedCredentials)).toBe(false)
  })
})

describe('isSignupSubmitDisabled — RM33 bouton « Créer un compte » grisé si champ requis vide', () => {
  it('désactive le bouton quand les 3 champs sont vides', () => {
    const emptyForm = { firstName: '', email: '', password: '', isPending: false }

    expect(isSignupSubmitDisabled(emptyForm)).toBe(true)
  })

  it('désactive le bouton quand le prénom est vide', () => {
    const formWithoutFirstName = { firstName: '', email: 'marc@test.dev', password: 'motdepasse', isPending: false }

    expect(isSignupSubmitDisabled(formWithoutFirstName)).toBe(true)
  })

  it("désactive le bouton quand l'email est vide", () => {
    const formWithoutEmail = { firstName: 'Marc', email: '', password: 'motdepasse', isPending: false }

    expect(isSignupSubmitDisabled(formWithoutEmail)).toBe(true)
  })

  it('désactive le bouton quand le mot de passe est vide', () => {
    const formWithoutPassword = { firstName: 'Marc', email: 'marc@test.dev', password: '', isPending: false }

    expect(isSignupSubmitDisabled(formWithoutPassword)).toBe(true)
  })

  it("désactive le bouton quand le prénom n'est fait que d'espaces", () => {
    const formWithBlankFirstName = { firstName: '   ', email: 'marc@test.dev', password: 'motdepasse', isPending: false }

    expect(isSignupSubmitDisabled(formWithBlankFirstName)).toBe(true)
  })

  it("désactive le bouton quand l'email n'est fait que d'espaces", () => {
    const formWithBlankEmail = { firstName: 'Marc', email: '   ', password: 'motdepasse', isPending: false }

    expect(isSignupSubmitDisabled(formWithBlankEmail)).toBe(true)
  })

  it("désactive le bouton quand le mot de passe n'est fait que d'espaces", () => {
    const formWithBlankPassword = { firstName: 'Marc', email: 'marc@test.dev', password: '        ', isPending: false }

    expect(isSignupSubmitDisabled(formWithBlankPassword)).toBe(true)
  })

  it('active le bouton quand les 3 champs sont remplis', () => {
    const filledForm = { firstName: 'Marc', email: 'marc@test.dev', password: 'motdepasse', isPending: false }

    expect(isSignupSubmitDisabled(filledForm)).toBe(false)
  })

  it('active le bouton avec des champs remplis mais mal formés (la validation se fait à la soumission)', () => {
    const malformedForm = { firstName: 'Marc', email: 'marc', password: 'abc', isPending: false }

    expect(isSignupSubmitDisabled(malformedForm)).toBe(false)
  })
})

describe('isSigninSubmitDisabled / isSignupSubmitDisabled — RM17 bouton désactivé pendant la requête', () => {
  it('désactive le bouton « Me connecter » pendant un appel signin, champs remplis', () => {
    const pendingSignin = { email: 'marc@test.dev', password: 'motdepasse', isPending: true }

    expect(isSigninSubmitDisabled(pendingSignin)).toBe(true)
  })

  it('désactive le bouton « Créer un compte » pendant un appel signup, champs remplis', () => {
    const pendingSignup = { firstName: 'Marc', email: 'marc@test.dev', password: 'motdepasse', isPending: true }

    expect(isSignupSubmitDisabled(pendingSignup)).toBe(true)
  })
})

describe('isSigninSubmitDisabled / isSignupSubmitDisabled — RM19 action re-tentable après une erreur', () => {
  it("réactive le bouton « Me connecter » une fois l'appel en échec terminé", () => {
    const signinAfterFailure = { email: 'marc@test.dev', password: 'motdepasse', isPending: false }

    expect(isSigninSubmitDisabled(signinAfterFailure)).toBe(false)
  })

  it("réactive le bouton « Créer un compte » une fois l'appel en échec terminé", () => {
    const signupAfterFailure = { firstName: 'Marc', email: 'marc@test.dev', password: 'motdepasse', isPending: false }

    expect(isSignupSubmitDisabled(signupAfterFailure)).toBe(false)
  })
})
