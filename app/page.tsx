import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, FileText, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const highlights = [
  {
    icon: FileText,
    title: "CVs siempre visibles",
    description:
      "Cada usuario puede subir y actualizar su perfil profesional en un espacio propio.",
  },
  {
    icon: Users,
    title: "Componente social",
    description:
      "Conecta talento, experiencia y presencia digital dentro de una misma comunidad.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Marca profesional",
    description:
      "MyWorkSpace presenta la informacion laboral con una imagen limpia y preparada para crecer.",
  },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(140deg,_var(--color-background),_color-mix(in_oklab,var(--color-muted)_68%,white))]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.05),_transparent_24%,rgba(15,23,42,0.02))]" />
      <div className="mx-auto grid min-h-svh w-full max-w-7xl gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-16">
        <section className="relative space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
            <BriefcaseBusiness className="size-4 text-primary" />
            MyWorkSpace
          </div>
          <div className="space-y-5">
            <h1 className="font-heading text-4xl leading-none font-semibold text-balance sm:text-5xl lg:text-6xl">
              La red social donde tu CV se convierte en tu escaparate
              profesional.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              MyWorkSpace conecta personas, experiencia y oportunidades.
              Comparte tu trayectoria, construye presencia profesional y accede
              a una comunidad centrada en talento y empleabilidad.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="px-5">
              <Link href="/login">
                Acceder a MyWorkSpace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <Card
          id="vision"
          className="relative overflow-hidden rounded-[2rem] border-border/60 bg-background/86 shadow-[0_26px_100px_-42px_rgba(15,23,42,0.45)] backdrop-blur"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <CardHeader className="relative space-y-2 p-6 sm:p-8">
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Red profesional
            </p>
            <CardTitle className="text-2xl sm:text-3xl">
              Un perfil, una comunidad y muchas oportunidades
            </CardTitle>
            <CardDescription className="text-sm leading-6 sm:text-base">
              La portada ya introduce el producto con una identidad pensada
              para una plataforma social de CVs.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-3 p-6 pt-0 sm:p-8 sm:pt-0">
            {highlights.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-border/70 bg-muted/35 p-5"
              >
                <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
