import Link from "next/link"
import { Route } from "lucide-react"

import { Button } from "@/components/ui/button"

export function DevRoutesBar() {
  const isDevelopmentApp =
    process.env.NEXT_PUBLIC_APP_ENV === "development" ||
    process.env.NODE_ENV === "development"

  if (!isDevelopmentApp) {
    return null
  }

  return (
    <div className="sticky top-0 z-50 border-b border-primary/20 bg-primary/8 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-16">
        <div className="flex items-center gap-2 text-sm">
          <Route className="size-4 text-primary" />
          <span className="font-medium text-foreground">Modo desarrollo</span>
          <span className="hidden text-muted-foreground sm:inline">
            Acceso rapido a la visualizacion de rutas
          </span>
        </div>

        <Button asChild size="sm" variant="secondary">
          <Link href="/dev/routes">Ver rutas</Link>
        </Button>
      </div>
    </div>
  )
}
