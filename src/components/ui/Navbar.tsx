import type { ReactNode } from 'react'
import { Link } from 'react-router'
import Logo from '@/components/ui/Logo'
import { layoutContent } from '@/data/layout'

type NavbarProps = {
  actions?: ReactNode
}

export default function Navbar({ actions }: NavbarProps) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-[6px]">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link to="/" aria-label={layoutContent.logoName}>
          <Logo />
        </Link>
        {actions && <div className="flex items-center gap-2 sm:gap-6">{actions}</div>}
      </div>
    </header>
  )
}
