import Link from "next/link"
import { FileText, Scale, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  {
    title: "1. Objeto del servicio",
    text:
      "MyWorkSpace ofrece un entorno digital para que los usuarios creen una cuenta, publiquen informacion profesional y compartan su CV dentro de una comunidad orientada a la empleabilidad.",
  },
  {
    title: "2. Registro y uso de la cuenta",
    text:
      "El usuario se compromete a facilitar datos veraces, mantener la confidencialidad de sus credenciales y utilizar la plataforma de forma licita, respetuosa y conforme a la finalidad del servicio.",
  },
  {
    title: "3. Contenido subido por el usuario",
    text:
      "Cada usuario es responsable del contenido que publique, incluyendo textos, experiencia laboral, formacion y documentos adjuntos. No deben subirse materiales falsos, ilicitos o que vulneren derechos de terceros.",
  },
  {
    title: "4. Disponibilidad y cambios",
    text:
      "MyWorkSpace podra actualizar, modificar o interrumpir funcionalidades por motivos tecnicos, operativos o de seguridad, procurando informar cuando ello afecte de forma relevante al uso normal del servicio.",
  },
  {
    title: "5. Limitacion de responsabilidad",
    text:
      "La plataforma no garantiza la obtencion de oportunidades profesionales concretas ni responde del uso que terceros hagan de la informacion publicada por los usuarios fuera del marco previsto por el servicio.",
  },
]

export default function TermsAndConditionsPage() {
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
                <Scale className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Marco legal
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Terminos y condiciones de uso de MyWorkSpace
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Texto base orientativo para una plataforma social y
                  profesional centrada en perfiles, CVs y visibilidad laboral.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Este contenido es un punto de partida habitual, pero conviene
              revisarlo con asesoramiento legal antes de publicarlo en
              produccion.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Debe adaptarse al titular real del sitio, a la jurisdiccion
              aplicable y a los tratamientos concretos de datos personales.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Puedes complementarlo con politica de privacidad, avisos de
              propiedad intelectual y normas de conducta comunitaria.
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Terminos y condiciones
            </p>
            <CardTitle>Condiciones generales del servicio</CardTitle>
            <CardDescription>
              Documento estandar orientado al uso responsable de la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="size-4 text-primary" />
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
                Recomendacion
              </div>
              Antes de publicar estos terminos en un entorno real, adapta el
              texto a tu actividad concreta y a la normativa aplicable.
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/contact">Contactar con soporte</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
