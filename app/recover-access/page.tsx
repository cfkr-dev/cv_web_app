"use client"

import Link from "next/link"
import { ArrowLeft, KeyRound, LifeBuoy, Mail, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  consumeBlockedRouteNotice,
  grantProtectedRouteAccess,
} from "@/lib/protected-route-access"

const recoveryTips = [
  "Te enviaremos un enlace seguro para restablecer tu contrasena.",
  "El correo debe ser el mismo que usaste al crear tu cuenta.",
  "Si no lo recibes, revisa spam o promociones antes de volver a intentarlo.",
]

const recoverAccessSchema = z.object({
  email: z.email("Introduce un correo con formato valido."),
})

type RecoverAccessFormValues = z.infer<typeof recoverAccessSchema>

export default function RecoverAccessPage() {
  const [blockedNoticeVisible, setBlockedNoticeVisible] = useState(false)
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const form = useForm<RecoverAccessFormValues>({
    resolver: zodResolver(recoverAccessSchema),
    defaultValues: {
      email: "",
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    setBlockedNoticeVisible(consumeBlockedRouteNotice("/reset-password"))
  }, [])

  async function onSubmit(values: RecoverAccessFormValues) {
    setStatus({
      type: "info",
      message: "Buscando la cuenta y preparando un enlace de prueba...",
    })

    await new Promise((resolve) => setTimeout(resolve, 900))

    const normalizedEmail = values.email.trim().toLowerCase()

    if (normalizedEmail.includes("bloqueado") || normalizedEmail.includes("error")) {
      setStatus({
        type: "error",
        message:
          "No hemos podido simular el envio del enlace. Prueba con otro correo para seguir validando la interfaz.",
      })
      return
    }

    grantProtectedRouteAccess("/reset-password")

    setStatus({
      type: "success",
      message: `Si existe una cuenta asociada a ${normalizedEmail}, revisa tu bandeja de entrada para continuar con la recuperacion. Si no lo ves en unos minutos, revisa tambien spam o promociones.`,
    })

    reset()
  }

  const statusStyles = {
    idle: "",
    success: "border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
    error: "border-destructive/30 bg-destructive/8 text-destructive",
    info: "border-primary/20 bg-primary/8 text-foreground",
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_40%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <Card className="gap-4 overflow-hidden border-border/60 bg-[linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_16%,transparent),_transparent_42%)] p-0 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader className="gap-6 p-6 sm:p-8 lg:p-10">
            <Link
              href="/login"
              className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              Volver al login
            </Link>
            <div className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <ShieldCheck className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Recuperacion segura
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Recupera tu acceso y vuelve a tu perfil profesional.
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Este formulario sigue la misma base que login, registro y contacto: react-hook-form,
                  zod y Field para validar y mostrar estados de forma uniforme.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            {recoveryTips.map((tip) => (
              <div
                key={tip}
                className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85"
              >
                {tip}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader className="space-y-2">
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Recuperar acceso
            </p>
            <CardTitle>No te quedes fuera de MyWorkSpace</CardTitle>
            <CardDescription>
              Introduce tu correo y te enviaremos un enlace para crear una nueva contrasena.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {blockedNoticeVisible ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-800 dark:text-amber-200">
                Necesitas solicitar antes el enlace de recuperacion para poder acceder al cambio de contrasena.
              </div>
            ) : null}

            {status.type !== "idle" ? (
              <div
                className={`rounded-2xl border p-4 text-sm leading-6 ${statusStyles[status.type]}`}
              >
                {status.message}
              </div>
            ) : null}

            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Correo electronico</FieldLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          id={field.name}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="nombre@myworkspace.com"
                          className="pl-9"
                        />
                      </div>
                      <FieldDescription>
                        Para probar el error simulado puedes usar un correo que incluya
                        {" "}
                        <span className="font-medium text-foreground">error</span>
                        {" "}
                        o
                        {" "}
                        <span className="font-medium text-foreground">bloqueado</span>.
                      </FieldDescription>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar enlace de recuperacion"}
              </Button>
            </form>

            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <KeyRound className="size-4 text-primary" />
                Restablecimiento rapido y guiado
              </div>
              Una vez recibas el correo, podras definir una nueva contrasena y volver a acceder a tu
              perfil y a tu CV.
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Sigues teniendo problemas?
                </p>
                <p className="mt-1 text-muted-foreground">
                  Vuelve al login o escribe a soporte si no recuerdas el correo usado.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">
                    <ArrowLeft className="size-4" />
                    Volver
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">
                    <LifeBuoy className="size-4" />
                    Contactar
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
