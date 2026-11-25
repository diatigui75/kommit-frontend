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

export function isSigninSubmitDisabled(_state: SigninFormState): boolean {
  return false
}

export function isSignupSubmitDisabled(_state: SignupFormState): boolean {
  return false
}
