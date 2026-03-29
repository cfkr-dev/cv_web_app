import Link from "next/link"

const footerLinks = [
  { href: "/terms-and-conditions", label: "Terminos y condiciones" },
  { href: "/privacy-policy", label: "Politica de privacidad" },
  { href: "/cookie-policy", label: "Politica de cookies" },
  { href: "/contact", label: "Contacto" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-muted-foreground sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="space-y-1">
          <p className="font-medium text-foreground">MyWorkSpace</p>
          <p>
            Plataforma profesional para compartir CVs, perfiles y presencia
            digital.
          </p>
        </div>

        <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
