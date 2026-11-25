import { normalizeEmail } from '@/logic/auth/email/email'
import type { SignupValues } from '@/logic/auth/validation/validation'

export type SignupRequestBody = {
  name: string
  email: string
  password: string
}

// Le mot de passe part tel quel : ses espaces font partie du secret.
export function signupBodyFor({ firstName, email, password }: SignupValues): SignupRequestBody {
  return { name: firstName.trim(), email: normalizeEmail(email), password }
}
