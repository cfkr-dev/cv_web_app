"use client"

import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react"
import { toast } from "sonner"

import type { AppToastType } from "@/components/app-toast-card"
import { AppToastCard } from "@/components/app-toast-card"
import { Button } from "@/components/ui/button"
import { useAppToast } from "@/hooks/use-app-toast"

type DemoToastOptions = {
  title: string
  description?: string
  durationSeconds?: number
  persistent?: boolean
}

const defaultDurationSeconds = 5

export function DevToastsDemo() {
  const appToast = useAppToast()

  function showTailwindToast(
    type: AppToastType,
    {
      title,
      description,
      durationSeconds = defaultDurationSeconds,
      persistent = false,
    }: DemoToastOptions
  ) {
    const normalizedDurationSeconds =
      Number.isFinite(durationSeconds) && durationSeconds > 0
        ? durationSeconds
        : defaultDurationSeconds
    const durationMs = persistent ? null : normalizedDurationSeconds * 1000

    return toast.custom(
      (toastId) => (
        <AppToastCard
          toastId={toastId}
          type={type}
          title={title}
          description={description}
          durationMs={durationMs}
          onDismiss={toast.dismiss}
        />
      ),
      {
        duration: durationMs ?? Infinity,
        unstyled: true,
      }
    )
  }

  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
            Desarrollo
          </p>
          <h1 className="font-heading text-3xl font-semibold">
            Pruebas de toast
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Vista de pruebas para revisar colores, espaciado y autocierre de los
            cuatro tipos de notificacion.
          </p>
        </div>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">
            Toast actual
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              className="justify-start"
              onClick={() =>
                appToast.success({
                  title: "Seccion guardada",
                  description:
                    "Los datos de esta seccion se han guardado correctamente.",
                })
              }
            >
              <CheckCircle2 className="size-4" />
              Success
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="justify-start"
              onClick={() =>
                appToast.info({
                  title: "Cambios pendientes",
                  description:
                    "Todavia hay cambios sin confirmar en esta seccion.",
                })
              }
            >
              <Info className="size-4" />
              Info
            </Button>

            <Button
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() =>
                appToast.warning({
                  title: "Revisa este contenido",
                  description:
                    "Hay campos opcionales sin completar que podrias querer revisar.",
                })
              }
            >
              <TriangleAlert className="size-4" />
              Warning
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="justify-start"
              onClick={() =>
                appToast.error({
                  title: "No se pudo guardar",
                  description:
                    "Corrige los errores del formulario antes de continuar.",
                })
              }
            >
              <XCircle className="size-4" />
              Error
            </Button>

            <Button
              type="button"
              variant="outline"
              className="justify-start sm:col-span-2"
              onClick={() =>
                appToast.info({
                  title: "Toast persistente",
                  description:
                    "Este toast no se cierra automaticamente. Usa la X para cerrarlo.",
                  persistent: true,
                })
              }
            >
              <Info className="size-4" />
              Persistent
            </Button>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">
            Toast sin CSS module
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              className="justify-start"
              onClick={() =>
                showTailwindToast("success", {
                  title: "Seccion guardada",
                  description:
                    "Los datos de esta seccion se han guardado correctamente.",
                })
              }
            >
              <CheckCircle2 className="size-4" />
              Success
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="justify-start"
              onClick={() =>
                showTailwindToast("info", {
                  title: "Cambios pendientes",
                  description:
                    "Todavia hay cambios sin confirmar en esta seccion.",
                })
              }
            >
              <Info className="size-4" />
              Info
            </Button>

            <Button
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() =>
                showTailwindToast("warning", {
                  title: "Revisa este contenido",
                  description:
                    "Hay campos opcionales sin completar que podrias querer revisar.",
                })
              }
            >
              <TriangleAlert className="size-4" />
              Warning
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="justify-start"
              onClick={() =>
                showTailwindToast("error", {
                  title: "No se pudo guardar",
                  description:
                    "Corrige los errores del formulario antes de continuar.",
                })
              }
            >
              <XCircle className="size-4" />
              Error
            </Button>

            <Button
              type="button"
              variant="outline"
              className="justify-start sm:col-span-2"
              onClick={() =>
                showTailwindToast("info", {
                  title: "Toast persistente",
                  description:
                    "Este toast no se cierra automaticamente. Usa la X para cerrarlo.",
                  persistent: true,
                })
              }
            >
              <Info className="size-4" />
              Persistent
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
