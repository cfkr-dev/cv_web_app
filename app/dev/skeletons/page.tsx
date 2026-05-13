import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DevSkeletonsPage() {
  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Skeleton Dev
          </h1>
          <p className="text-sm text-muted-foreground">
            Banco de pruebas de skeletons basado unicamente en el componente
            `Skeleton`.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-2">
          <DiagnosticCard
            title="Demo literal de docs"
            description="Ejemplo exacto de la documentacion."
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </DiagnosticCard>

          <DiagnosticCard
            title="Lineas simples"
            description="Tres lineas con distintas longitudes."
          >
            <div className="space-y-3">
              <Skeleton className="h-6 w-full max-w-sm" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </DiagnosticCard>

          <DiagnosticCard
            title="Tarjeta compacta"
            description="Placeholder generico para bloques de formulario."
          >
            <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
              <div className="space-y-4">
                <Skeleton className="h-7 w-52" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-28 w-full" />
              </div>
            </div>
          </DiagnosticCard>

          <DiagnosticCard
            title="Avatar y datos"
            description="Patron util para cabeceras de usuario."
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton className="h-24 w-24 rounded-3xl" />
              <div className="w-full space-y-3">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-5 w-40" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </DiagnosticCard>
        </div>

        <DiagnosticCard
          title="Introduction mock"
          description="Maqueta del bloque de introduccion usando solo Skeleton."
        >
          <div className="rounded-[1.9rem] border border-border/70 bg-[linear-gradient(135deg,_color-mix(in_oklab,var(--color-primary)_12%,white),_var(--color-background)_45%,_color-mix(in_oklab,var(--color-muted)_70%,white))] p-6 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] sm:p-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-10 w-44 rounded-xl" />
              </div>

              <div className="grid gap-5 xl:grid-cols-[12rem_minmax(0,1fr)] xl:items-center">
                <Skeleton className="aspect-[3/4] w-full max-w-[12rem] rounded-[1.9rem]" />

                <div className="space-y-4">
                  <Skeleton className="h-9 w-64 max-w-full" />
                  <Skeleton className="h-6 w-44 max-w-full" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DiagnosticCard>
      </div>
    </main>
  )
}

function DiagnosticCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
