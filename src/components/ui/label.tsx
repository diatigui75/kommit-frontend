import * as React from "react"
import { cn } from "cn"

// Label de la maquette : majuscules, 12px, lettres espacées.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-xs leading-4 font-semibold tracking-[0.6px] text-grey-text uppercase select-none",
        className
      )}
      {...props}
    />
  )
}

export { Label }
