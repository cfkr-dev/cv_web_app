import Link from "next/link"
import { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Action = {
  href: string
  label: string
  variant?: "default" | "outline" | "secondary"
}

type StatusPageProps = {
  code: string
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  highlights: string[]
  actions: Action[]
}

export function StatusPage({
  code,
  eyebrow,
  title,
  description,
  icon: Icon,
  highlights,
  actions,
}: StatusPageProps) {
  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_42%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-3xl items-center justify-center">
        <Card className="w-full overflow-hidden border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader className="gap-6 p-6 sm:p-8 lg:p-10">
            <Link
              href="/"
              className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              Volver al inicio
            </Link>
            <div className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Icon className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  {eyebrow}
                </p>
                <div className="text-5xl font-semibold tracking-tight text-foreground">
                  {code}
                </div>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm leading-7 sm:text-base">
                  {description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            <div className="grid gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm leading-6 text-foreground/85"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              {actions.map((action) => (
                <Button
                  key={`${action.href}-${action.label}`}
                  asChild
                  size="lg"
                  variant={action.variant ?? "default"}
                  className="w-full"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
