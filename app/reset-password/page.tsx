"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { Progress } from "@/components/ui/progress"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Usa una contrasena de al menos 8 caracteres.")
      .refine(
        (value) =>
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /\d/.test(value) &&
          /[^A-Za-z0-9]/.test(value),
        "Incluye mayusculas, minusculas, numeros y simbolos."
      ),
    confirmPassword: z.string().min(1, "Repite tu contrasena."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

const resetTips = [
  "Define una contrasena nueva distinta de la anterior.",
  "Usa combinaciones largas con simbolos y numeros.",
  "Cuando guardes el cambio, podras volver a iniciar sesion.",
]

function getPasswordStrength(password: string) {
  if (!password) {
    return {
      label: "Sin definir",
      level: 0,
      color: "bg-border",
      message: "Usa al menos 8 caracteres, mayusculas, numeros y simbolos.",
    }
  }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) {
    return {
      label: "Debil",
      level: 1,
      color: "bg-red-500",
      message: "Necesita mas longitud y variedad de caracteres.",
    }
  }

  if (score <= 3) {
    return {
      label: "Media",
      level: 2,
      color: "bg-amber-500",
      message: "Va bien, pero aun puedes reforzarla.",
    }
  }

  return {
    label: "Fuerte",
    level: 3,
    color: "bg-emerald-500",
    message: "Buena combinacion para una contrasena segura.",
  }
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [redirectProgress, setRedirectProgress] = useState(100)
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  const password = useWatch({ control, name: "password" }) ?? ""
  const strength = useMemo(() => getPasswordStrength(password), [password])
  const redirectDurationMs = 10000

  useEffect(() => {
    if (!isSuccessDialogOpen) {
      setRedirectProgress(100)
      return
    }

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.max(100 - (elapsed / redirectDurationMs) * 100, 0)
      setRedirectProgress(nextProgress)

      if (elapsed >= redirectDurationMs) {
        window.clearInterval(interval)
        router.push("/login")
      }
    }, 100)

    return () => window.clearInterval(interval)
  }, [isSuccessDialogOpen, router])

  async function onSubmit() {
    setStatus({
      type: "info",
      message: "Comprobando el enlace y actualizando la contrasena de prueba...",
    })

    await new Promise((resolve) => setTimeout(resolve, 900))

    setStatus({
      type: "idle",
      message: "",
    })

    setIsSuccessDialogOpen(true)
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
              href="/recover-access"
              className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              Volver a recuperacion
            </Link>
            <div className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <ShieldCheck className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Nueva contrasena
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Restablece tu acceso de forma segura.
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Esta pantalla simula el paso final tras pulsar el enlace enviado por correo
                  para que puedas validar toda la experiencia de recuperacion.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            {resetTips.map((tip) => (
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
              Resetear contrasena
            </p>
            <CardTitle>Crea una nueva clave</CardTitle>
            <CardDescription>
              Introduce y confirma la nueva contrasena para completar el proceso.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
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
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Nueva contrasena</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Escribe tu nueva contrasena"
                          className="pr-10 pl-9"
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                          onPointerDown={() => setShowPassword(true)}
                          onPointerUp={() => setShowPassword(false)}
                          onPointerLeave={() => setShowPassword(false)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      <FieldDescription>
                        Usa una contrasena robusta con mayusculas, minusculas, numeros y
                        simbolos.
                      </FieldDescription>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          {[1, 2, 3].map((segment) => (
                            <div
                              key={segment}
                              className={`h-2 flex-1 rounded-full ${
                                strength.level >= segment ? strength.color : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-xs">
                          <span className="font-medium text-foreground">
                            Fuerza: {strength.label}
                          </span>
                          <span className="text-right text-muted-foreground">
                            {strength.message}
                          </span>
                        </div>
                      </div>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Confirmar contrasena</FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Repite la nueva contrasena"
                          className="pr-10 pl-9"
                        />
                        <button
                          type="button"
                          aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                          onPointerDown={() => setShowPassword(true)}
                          onPointerUp={() => setShowPassword(false)}
                          onPointerLeave={() => setShowPassword(false)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar nueva contrasena"}
              </Button>
            </form>

            <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">Quieres volver atras?</p>
                <p className="mt-1 text-muted-foreground">
                  Puedes regresar al paso anterior o volver directamente al login.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="outline" size="lg">
                  <Link href="/recover-access">
                    <ArrowLeft className="size-4" />
                    Recuperacion
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/login">Ir al login</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Contrasena restablecida</AlertDialogTitle>
            <AlertDialogDescription>
              Tu contrasena se ha restablecido correctamente. Seras redirigido al login
              automaticamente para que puedas acceder con tu nueva clave.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <Progress value={redirectProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Redireccionando en {Math.max(Math.ceil((redirectProgress / 100) * 10), 0)} s
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/login")}>
              Ir ahora al login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
