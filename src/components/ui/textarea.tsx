import * as React from "react"
import { cn } from "cn"

// Zone de saisie du daily (maquette F2) : sans cadre, un trait sous le texte.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[150px] w-full resize-none border-b border-field-border bg-transparent pb-3 text-base leading-6 text-foreground outline-none placeholder:text-placeholder focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
