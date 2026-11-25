import { describe, expect, it } from 'vitest'
import { arrivalToastFor } from '@/logic/auth/arrivalToast/arrivalToast'

describe('arrivalToastFor — RM3, RM4 affichage du toast', () => {
  it('souhaite la bienvenue après une création de compte', () => {
    const origin = 'signup'
    const firstName = 'Marc'

    expect(arrivalToastFor(origin, firstName)).toBe('Bienvenue Marc, ton compte est créé.')
  })

  it('salue le retour après une connexion', () => {
    const origin = 'signin'
    const firstName = 'Marc'

    expect(arrivalToastFor(origin, firstName)).toBe('Content de te revoir Marc.')
  })
})

describe('arrivalToastFor — RM24, RM25 non-affichage du toast', () => {
  it("n'affiche aucun toast sans origine (rechargement, retour, ouverture directe)", () => {
    const noOrigin = null
    const firstName = 'Marc'

    expect(arrivalToastFor(noOrigin, firstName)).toBeNull()
  })
})
