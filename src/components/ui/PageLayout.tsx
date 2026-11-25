import type { ReactNode } from 'react'
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'

type PageLayoutProps = {
  navbarActions?: ReactNode
  children: ReactNode
}

export default function PageLayout({ navbarActions, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar actions={navbarActions} />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center px-4 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
