import type { ReactNode } from 'react'
import { LockIcon } from 'lucide-react'
import { authContent } from '@/data/auth'

type AuthCardProps = {
  title: string
  children: ReactNode
  footer: ReactNode
}

// Carte commune aux formulaires signup et signin : titre, champs, lien du bas, mention sécurisée.
export default function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div className="flex w-full max-w-[400px] flex-col items-center">
      <section className="flex min-h-[479px] w-full flex-col items-center gap-8 rounded-lg border border-card-border bg-white px-6 py-[33px] shadow-card sm:px-[33px]">
        <h1 className="text-center text-2xl leading-[33.6px] font-bold text-foreground">{title}</h1>
        {children}
        <p className="text-center text-sm leading-5 text-grey-text">{footer}</p>
      </section>
      <p className="flex items-center gap-2 pt-8 text-[10px] leading-[15px] font-medium tracking-[1px] text-grey-text/60 uppercase">
        <LockIcon className="size-3" aria-hidden />
        {authContent.securityNotice}
      </p>
    </div>
  )
}
