import { Link } from 'react-router'
import { LoaderCircleIcon } from 'lucide-react'
import AuthCard from '@/components/ui/AuthCard'
import { Button, buttonVariants } from '@/components/ui/button'
import PageLayout from '@/components/ui/PageLayout'
import TextField from '@/components/ui/TextField'
import { layoutContent } from '@/data/layout'
import { signupContent } from '@/data/signup'

type SignupPageProps = {
  firstNameError?: string
  emailError?: string
  passwordError?: string
  isSubmitDisabled?: boolean
  isPending?: boolean
}

// Les états (erreurs, bouton désactivé, chargement) arrivent par props, câblés à l'étape 3.
export default function SignupPage({
  firstNameError,
  emailError,
  passwordError,
  isSubmitDisabled = false,
  isPending = false,
}: SignupPageProps) {
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
            <form noValidate className="flex w-full flex-col items-center gap-8">
              <TextField
                id="signup-first-name"
                label={signupContent.firstName.label}
                autoComplete="given-name"
                error={firstNameError}
              />
              <TextField
                id="signup-email"
                type="email"
                label={signupContent.email.label}
                placeholder={signupContent.email.placeholder}
                autoComplete="email"
                error={emailError}
              />
              <TextField
                id="signup-password"
                type="password"
                label={signupContent.password.label}
                autoComplete="new-password"
                error={passwordError}
              />
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
