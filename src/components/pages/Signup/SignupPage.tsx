import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { LoaderCircleIcon } from 'lucide-react'
import AuthCard from '@/components/ui/AuthCard'
import { Button, buttonVariants } from '@/components/ui/button'
import PageLayout from '@/components/ui/PageLayout'
import TextField from '@/components/ui/TextField'
import { layoutContent } from '@/data/layout'
import { signupContent } from '@/data/signup'

type SignupField = 'firstName' | 'email' | 'password'

type SignupPageProps = {
  values: Record<SignupField, string>
  onFieldChange: (field: SignupField, value: string) => void
  onSubmit: () => void
  firstNameError?: string
  emailError?: string
  passwordError?: string
  formError?: string
  isSubmitDisabled?: boolean
  isPending?: boolean
}

// Formulaire de signup : valeurs, erreurs et chargement arrivent par props depuis SignupRoute.
export default function SignupPage({
  values,
  onFieldChange,
  onSubmit,
  firstNameError,
  emailError,
  passwordError,
  formError,
  isSubmitDisabled = false,
  isPending = false,
}: SignupPageProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <PageLayout
      navbarActions={
        <Link to="/signin" className={buttonVariants({ variant: 'secondary' })}>
          {layoutContent.signinLabel}
        </Link>
      }
    >
      <div className="w-full pt-10 pb-8 md:pt-[218px]">
        <div className="flex justify-center">
          <AuthCard
            title={signupContent.title}
            footer={
              <>
                {signupContent.footerText}
                <Link to="/signin" className="text-primary">
                  {signupContent.footerLink}
                </Link>
              </>
            }
          >
            <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-8">
              <TextField
                id="signup-first-name"
                value={values.firstName}
                onChange={(event) => onFieldChange('firstName', event.target.value)}
                label={signupContent.firstName.label}
                autoComplete="given-name"
                error={firstNameError}
              />
              <TextField
                id="signup-email"
                value={values.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
                type="email"
                label={signupContent.email.label}
                placeholder={signupContent.email.placeholder}
                autoComplete="email"
                error={emailError}
              />
              <TextField
                id="signup-password"
                value={values.password}
                onChange={(event) => onFieldChange('password', event.target.value)}
                type="password"
                label={signupContent.password.label}
                autoComplete="new-password"
                error={passwordError}
              />
              {formError && (
                <p role="alert" className="w-full text-xs text-destructive">
                  {formError}
                </p>
              )}
              <Button type="submit" variant="submit" disabled={isSubmitDisabled || isPending}>
                {isPending ? (
                  <>
                    <LoaderCircleIcon className="animate-spin" aria-hidden />
                    <span className="sr-only">{signupContent.submitPending}</span>
                  </>
                ) : (
                  signupContent.submit
                )}
              </Button>
            </form>
          </AuthCard>
        </div>
      </div>
    </PageLayout>
  )
}
