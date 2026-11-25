export type SigninFormState = {
  email: string
  password: string
  isPending: boolean
}

export type SignupFormState = {
  firstName: string
  email: string
  password: string
  isPending: boolean
}

const isBlank = (value: string) => value.trim() === ''

export function isSigninSubmitDisabled({ email, password, isPending }: SigninFormState): boolean {
  return isPending || isBlank(email) || isBlank(password)
}

export function isSignupSubmitDisabled({ firstName, email, password, isPending }: SignupFormState): boolean {
  return isPending || isBlank(firstName) || isBlank(email) || isBlank(password)
}
