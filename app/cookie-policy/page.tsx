import Link from "next/link"
import { Cookie, Info, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const cookieSections = [
  {
    title: "Cookies tecnicas",
    text:
      "Permiten el funcionamiento basico del sitio, el mantenimiento de la sesion y la correcta navegacion por las distintas areas de la plataforma.",
  },
  {
    title: "Cookies de preferencia",
    text:
      "Pueden utilizarse para recordar ajustes de experiencia, idioma o determinadas configuraciones visuales elegidas por el usuario.",
  },
  {
    title: "Cookies analiticas",
    text:
      "Sirven para comprender el uso de la plataforma, mejorar el rendimiento y detectar puntos de friccion en la experiencia de usuario de forma agregada.",
  },
  {
    title: "Gestion del consentimiento",
    text:
      "El usuario puede aceptar, rechazar o configurar las cookies no esenciales a traves del banner o panel de preferencias habilitado por la web.",
  },
]

export default function CookiePolicyPage() {
  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_42%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="gap-4 overflow-hidden border-border/60 bg-[linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_16%,transparent),_transparent_42%)] p-0 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader className="gap-6 p-6 sm:p-8 lg:p-10">
            <Link
              href="/"
              className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              Volver al inicio
            </Link>
            <div className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Cookie className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Transparencia
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Politica de cookies de MyWorkSpace
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Modelo estandar para explicar de forma clara que tecnologias
                  de seguimiento utiliza la plataforma y con que finalidad.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Esta pagina debe coordinarse con el sistema real de consentimiento
              y con las cookies efectivamente instaladas en la web.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Si integras analitica, mapas o terceros, conviene listar cada
              proveedor y su plazo de conservacion.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Los usuarios deben poder cambiar sus preferencias de forma
              sencilla en cualquier momento.
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Politica de cookies
            </p>
            <CardTitle>Uso de cookies y tecnologias similares</CardTitle>
            <CardDescription>
              Texto orientativo para una web profesional con acceso de usuarios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {cookieSections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Info className="size-4 text-primary" />
                  {section.title}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {section.text}
                </p>
              </section>
            ))}

            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Nota legal
              </div>
              Este contenido es generico y debe ajustarse a las herramientas
              reales que utilice tu aplicacion.
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/contact">Solicitar informacion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
