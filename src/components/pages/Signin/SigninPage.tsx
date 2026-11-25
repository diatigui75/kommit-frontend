import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { LoaderCircleIcon } from 'lucide-react'
import AuthCard from '@/components/ui/AuthCard'
import { Button, buttonVariants } from '@/components/ui/button'
import PageLayout from '@/components/ui/PageLayout'
import TextField from '@/components/ui/TextField'
import { layoutContent } from '@/data/layout'
import { signinContent } from '@/data/signin'

type SigninPageProps = {
  formError?: ReactNode
  isSubmitDisabled?: boolean
  isPending?: boolean
}

export default function SigninPage({
  formError,
  isSubmitDisabled = false,
  isPending = false,
}: SigninPageProps) {
  return (
    <PageLayout
      headerActions={
        <Link to="/signup" className={buttonVariants({ variant: 'primary' })}>
          {layoutContent.signupLabel}
        </Link>
      }
    >
      <div className="w-full pt-10 pb-8 md:pt-[218px]">
        <div className="flex justify-center">
          <AuthCard
            title={signinContent.title}
            footer={
              <>
                {signinContent.footerText}
                <Link to="/signup" className="text-primary">
                  {signinContent.footerLink}
                </Link>
                {signinContent.footerEnd}
              </>
            }
          >
            <form noValidate className="flex w-full flex-col items-center gap-5">
              <TextField
                id="signin-email"
                type="email"
                label={signinContent.email.label}
                placeholder={signinContent.email.placeholder}
                autoComplete="email"
              />
              <TextField
                id="signin-password"
                type="password"
                label={signinContent.password.label}
                autoComplete="current-password"
              />
              <div className="flex min-h-[65px] w-full items-center text-xs text-destructive" role="alert">
                {formError}
              </div>
              <Button type="submit" variant="submit" disabled={isSubmitDisabled || isPending}>
                {isPending ? (
                  <>
                    <LoaderCircleIcon className="animate-spin" aria-hidden />
                    <span className="sr-only">{signinContent.submitPending}</span>
                  </>
                ) : (
                  signinContent.submit
                )}
              </Button>
            </form>
          </AuthCard>
        </div>
      </div>
    </PageLayout>
  )
}
