import type { ReactNode } from 'react'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'

type PageLayoutProps = {
  headerActions?: ReactNode
  children: ReactNode
}

export default function PageLayout({ headerActions, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header actions={headerActions} />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center px-4 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
