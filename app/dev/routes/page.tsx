import Link from "next/link"

import { buildProtectedRouteHref } from "@/lib/protected-route-access"

const isDevelopmentApp =
  process.env.NEXT_PUBLIC_APP_ENV === "development" ||
  process.env.NODE_ENV === "development"

const routes = [
  { href: "/", label: "Landing" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Registro" },
  {
    href: "/complete-registration",
    label: "Completar registro",
  },
  { href: "/profile", label: "Perfil" },
  { href: "/recover-access", label: "Recuperar acceso" },
  {
    href: "/reset-password",
    label: "Resetear contrasena",
  },
  { href: "/contact", label: "Contacto" },
  { href: "/terms-and-conditions", label: "Terminos y condiciones" },
  { href: "/privacy-policy", label: "Politica de privacidad" },
  { href: "/cookie-policy", label: "Politica de cookies" },
  { href: "/403", label: "Error 403" },
  { href: "/500", label: "Error 500" },
  { href: "/maintenance", label: "Mantenimiento" },
  { href: "/ruta-que-no-existe", label: "Error 404" },
]

export default function DevRoutesPage() {
  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
            Desarrollo
          </p>
          <h1 className="font-heading text-3xl font-semibold">
            Rutas disponibles
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Acceso rapido a las paginas actuales de MyWorkSpace mientras estas
            desarrollando la interfaz.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="grid">
            {routes.map((route, index) => (
              <Link
                key={route.href}
                href={buildProtectedRouteHref(route.href, isDevelopmentApp)}
                className={`flex items-center justify-between px-4 py-4 text-sm transition hover:bg-muted/40 ${
                  index !== routes.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="font-medium text-foreground">{route.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {route.href}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
