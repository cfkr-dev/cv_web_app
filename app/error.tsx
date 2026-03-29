"use client"

import { useEffect } from "react"
import { RefreshCcw, ServerCrash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatusPage } from "@/components/status-page"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative">
      <StatusPage
        code="500"
        eyebrow="Error del servidor"
        title="Se ha producido un error inesperado."
        description="La aplicacion ha encontrado un problema al renderizar esta vista. Puedes reintentar la carga o volver a una ruta estable."
        icon={ServerCrash}
        highlights={[
          "El error puede venir de datos inconsistentes o de un fallo temporal.",
          "Reintentar la accion suele ser suficiente cuando el problema no es persistente.",
          "Si vuelve a ocurrir, conviene revisar logs y trazas del servidor.",
        ]}
        actions={[
          { href: "/", label: "Volver al inicio" },
          { href: "/contact", label: "Contactar con soporte", variant: "secondary" },
        ]}
      />
      <div className="pointer-events-none absolute right-10 bottom-10 left-10 sm:left-auto">
        <div className="pointer-events-auto ml-auto w-full max-w-sm rounded-2xl border border-border/70 bg-background/92 p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground">Intentar de nuevo</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Si el fallo fue puntual, puedes reintentar la carga desde aqui.
          </p>
          <Button onClick={reset} className="mt-4 w-full" size="lg">
            <RefreshCcw className="size-4" />
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  )
}
