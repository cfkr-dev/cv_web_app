import Link from "next/link"
import { Database, FileText, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const privacySections = [
  {
    title: "1. Datos que pueden recopilarse",
    text:
      "MyWorkSpace puede tratar datos identificativos y de contacto, informacion academica y profesional, credenciales de acceso, CVs y cualquier otra informacion que el usuario decida incorporar a su perfil.",
  },
  {
    title: "2. Finalidad del tratamiento",
    text:
      "Los datos se utilizan para permitir el registro, gestionar la cuenta del usuario, mostrar su perfil profesional, facilitar la interaccion con la plataforma y atender solicitudes, incidencias o consultas.",
  },
  {
    title: "3. Base juridica",
    text:
      "El tratamiento puede basarse en la ejecucion de la relacion contractual con el usuario, en el consentimiento prestado al registrarse o al completar formularios, y en el interes legitimo para mejorar la seguridad y el funcionamiento del servicio.",
  },
  {
    title: "4. Conservacion de los datos",
    text:
      "La informacion se conservara mientras la cuenta permanezca activa y durante el tiempo necesario para cumplir obligaciones legales, resolver reclamaciones o gestionar responsabilidades derivadas del servicio.",
  },
  {
    title: "5. Derechos de los usuarios",
    text:
      "Los usuarios pueden solicitar acceso, rectificacion, supresion, oposicion, limitacion del tratamiento o portabilidad de sus datos, asi como retirar el consentimiento cuando resulte aplicable.",
  },
]

export default function PrivacyPolicyPage() {
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
                <Database className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Privacidad
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Politica de privacidad de MyWorkSpace
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Texto legal base para una plataforma profesional donde los
                  usuarios crean cuenta, suben su CV y gestionan su perfil.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Este texto es una base estandar y debe adaptarse al responsable
              real del tratamiento, herramientas utilizadas y normativa
              aplicable.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              Si incorporas terceros, analitica, proveedores cloud o sistemas
              de autenticacion, conviene detallarlos expresamente.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              La politica de privacidad debe ser coherente con el formulario de
              registro, el footer y cualquier banner de cookies.
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Politica de privacidad
            </p>
            <CardTitle>Tratamiento de datos personales</CardTitle>
            <CardDescription>
              Modelo estandar orientativo para una web social y profesional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {privacySections.map((section) => (
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
                Recomendacion legal
              </div>
              Antes de publicar esta pagina en un entorno real, conviene que el
              texto sea revisado por una persona o asesor con criterio juridico.
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
