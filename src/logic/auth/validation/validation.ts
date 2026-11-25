import { signupContent } from '@/data/signup'

export type SignupValues = {
  firstName: string
  email: string
  password: string
}

export type SignupField = keyof SignupValues

// Message d'erreur à afficher sous chaque champ invalide, absent si le champ est valide.
export type SignupFieldErrors = Partial<Record<SignupField, string>>

const PASSWORD_MIN_LENGTH = 8

// Partie locale, @, domaine avec au moins une extension : `marc@test` est refusé.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function invalidSignupFields({ firstName, email, password }: SignupValues): SignupField[] {
  const invalidFields: SignupField[] = []

  if (firstName.trim() === '') invalidFields.push('firstName')
  if (!EMAIL_PATTERN.test(email.trim())) invalidFields.push('email')
  if (password.length < PASSWORD_MIN_LENGTH) invalidFields.push('password')

  return invalidFields
}

export function visibleSignupFieldErrors(values: SignupValues, hasBeenSubmitted: boolean): SignupFieldErrors {
  if (!hasBeenSubmitted) return {}

  const fieldErrors: SignupFieldErrors = {}
  for (const field of invalidSignupFields(values)) {
    fieldErrors[field] = signupContent[field].error
  }

  return fieldErrors
}
