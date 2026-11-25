export type SignupValues = {
  firstName: string
  email: string
  password: string
}

export type SignupField = keyof SignupValues

// Message d'erreur à afficher sous chaque champ invalide, absent si le champ est valide.
export type SignupFieldErrors = Partial<Record<SignupField, string>>

export function invalidSignupFields(_values: SignupValues): SignupField[] {
  return []
}

export function visibleSignupFieldErrors(_values: SignupValues, _hasBeenSubmitted: boolean): SignupFieldErrors {
  return {}
}
