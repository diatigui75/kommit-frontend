import { requestJson } from '@/lib/api/apiClient'
import type { Session } from '@/types/apiContract'

export const sessionQueryKey = ['session'] as const

export type SignupBody = { name: string; email: string; password: string }
export type SigninBody = { email: string; password: string }

export const fetchSession = () => requestJson<Session>('/api/auth/get-session', 'GET')

export const signUp = (body: SignupBody) => requestJson<unknown>('/api/auth/sign-up/email', 'POST', body)

export const signIn = (body: SigninBody) => requestJson<unknown>('/api/auth/sign-in/email', 'POST', body)

export const signOut = () => requestJson<unknown>('/api/auth/sign-out', 'POST')
