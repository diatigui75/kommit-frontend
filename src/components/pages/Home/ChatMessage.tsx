import type { ReactNode } from 'react'

type ChatMessageProps = {
  role: 'user' | 'assistant'
  children: ReactNode
}

// Bulle du chat (maquette F2) : l'utilisateur à droite en bleu, l'assistant à gauche en bleu pâle.
export default function ChatMessage({ role, children }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="max-w-[440px] self-end rounded-xl rounded-br-[4px] bg-linear-to-r from-primary to-blue-end px-5 py-3 text-sm leading-5 whitespace-pre-wrap text-primary-foreground">
        {children}
      </div>
    )
  }

  return (
    <div className="flex max-w-[440px] flex-col gap-3 self-start rounded-xl rounded-bl-[4px] bg-bubble px-5 py-3 text-sm leading-5 whitespace-pre-wrap text-foreground">
      {children}
    </div>
  )
}
