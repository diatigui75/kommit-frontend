import { Link } from 'react-router'
import { LogOutIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import PageHeading from '@/components/ui/PageHeading'
import PageLayout from '@/components/ui/PageLayout'
import { homeContent } from '@/data/home'
import { layoutContent } from '@/data/layout'

type HomePageProps = {
  firstName?: string
  onSignOut?: () => void
}

// Sans firstName, accueil visiteur (RM1) ; avec, accueil connecté (RM2).
export default function HomePage({ firstName, onSignOut }: HomePageProps) {
  if (firstName) {
    return (
      <PageLayout
        navbarActions={
          <Button variant="tertiary" onClick={onSignOut}>
            <LogOutIcon aria-hidden />
            {layoutContent.signoutLabel}
          </Button>
        }
      >
        <div className="py-8">
          <PageHeading
            title={homeContent.connected.title}
            titleAccent={`${firstName}${homeContent.connected.titleAccentSuffix}`}
            subtitle={homeContent.connected.subtitle}
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      navbarActions={
        <>
          <Link to="/signin" className={buttonVariants({ variant: 'secondary' })}>
            {layoutContent.signinLabel}
          </Link>
          <Link to="/signup" className={buttonVariants({ variant: 'primary' })}>
            {layoutContent.signupLabel}
          </Link>
        </>
      }
    >
      <div className="py-8">
        <PageHeading
          title={homeContent.visitor.title}
          titleAccent={homeContent.visitor.titleAccent}
          subtitle={homeContent.visitor.subtitle}
        />
      </div>
    </PageLayout>
  )
}
