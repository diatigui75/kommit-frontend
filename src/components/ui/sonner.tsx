import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleAlertIcon, CircleCheckIcon, XIcon } from "lucide-react"

// Toast d'arrivée de la maquette (vert) et toast d'erreur (rouge), en haut à droite, à 100px du haut.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      offset={{ top: 100, right: 24 }}
      mobileOffset={{ top: 100 }}
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-6" />,
        error: <CircleAlertIcon className="size-6" />,
        close: <XIcon className="size-4" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-max items-center gap-4 rounded-lg border px-6 py-3 font-sans text-base leading-6 font-semibold",
          success: "border-success bg-success-bg text-success",
          error: "border-destructive bg-white text-destructive",
          icon: "flex size-6 items-center",
          content: "-ml-2",
          closeButton:
            "order-last flex size-6 cursor-pointer items-center justify-center text-current",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
