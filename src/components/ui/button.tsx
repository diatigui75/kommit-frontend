import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap transition-opacity outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Bouton plein de la navbar
        primary:
          "rounded-[4px] border border-primary bg-linear-to-r from-primary to-blue-end px-3 py-2 text-sm leading-6 sm:px-4 sm:py-3 sm:text-base font-semibold text-primary-foreground hover:opacity-80",
        // Bouton à contour de la navbar
        secondary:
          "rounded-[4px] border border-primary bg-white px-3 py-2 text-sm leading-6 sm:px-4 sm:py-3 sm:text-base font-semibold text-blue-text hover:opacity-70",
        // Bouton « Se déconnecter »
        tertiary:
          "gap-2 rounded-lg bg-white py-3 pr-3 pl-4 text-base leading-6 font-semibold text-grey-blue hover:opacity-70 [&_svg:not([class*='size-'])]:size-6",
        // Bouton des formulaires, à 30 % d'opacité quand il est désactivé
        submit:
          "h-[43px] w-full gap-2 rounded-[4px] bg-linear-[132.93deg] from-primary to-blue-end text-sm leading-5 font-bold tracking-[-0.35px] text-primary-foreground shadow-button disabled:opacity-30 [&_svg:not([class*='size-'])]:size-4",
        // « Lancer le daily » : le primary avec une icône d'envoi, grisé tant que la zone est vide
        launch:
          "gap-2 rounded-[4px] border border-primary bg-linear-to-r from-primary to-blue-end px-4 py-3 text-base leading-6 font-semibold text-primary-foreground hover:opacity-80 disabled:opacity-30 [&_svg:not([class*='size-'])]:size-5",
        // « Quitter le daily » : contour rouge, plein au survol
        danger:
          "gap-2 rounded-[4px] border border-danger bg-white px-4 py-3 text-base leading-6 font-semibold text-danger hover:bg-danger hover:text-white [&_svg:not([class*='size-'])]:size-5",
        // Choix dans une bulle du chat : « Oui, je valide le daily »
        chip:
          "rounded-lg border border-field-border bg-white px-3 py-1.5 text-xs leading-4 font-medium text-primary hover:bg-field disabled:opacity-40",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

function Button({
  className,
  variant = "primary",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
