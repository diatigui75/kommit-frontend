import * as React from "react"
import { cn } from "cn"

// Zone de texte restylée depuis F2 : sans bordure, posée directement dans sa carte.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-none bg-transparent text-sm leading-6 text-grey-text outline-none placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
