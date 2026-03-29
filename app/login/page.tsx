"use client"

import Link from "next/link"
import { Eye, EyeOff, FileUser, LockKeyhole, Mail, UsersRound } from "lucide-react"
import { IconGoogle } from "nucleo-social-media"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const features = [
  "Publica tu CV y mantenlo actualizado en un perfil profesional.",
  "Conecta con otros usuarios y haz visible tu experiencia.",
  "Accede a una plataforma pensada para identidad profesional digital.",
]

const demoCredentials = {
  email: "demo@myworkspace.com",
  password: "Demo123!",
}

const loginSchema = z.object({
  email: z.email("Introduce un correo con formato valido."),
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres."),
  rememberSession: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberSession: false,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: LoginFormValues) {
    setStatus({ type: "info", message: "Validando credenciales de prueba..." })

    await new Promise((resolve) => setTimeout(resolve, 700))

    if (
      values.email.trim().toLowerCase() === demoCredentials.email &&
      values.password === demoCredentials.password
    ) {
      setStatus({
        type: "success",
        message: `Inicio de sesion simulado correcto. Recordar sesion: ${
          values.rememberSession ? "si" : "no"
        }.`,
      })
      return
    }

    setStatus({
      type: "error",
      message: "Las credenciales de prueba no coinciden. Usa demo@myworkspace.com y Demo123!.",
    })
  }

  function handleFakeGoogleLogin() {
    setStatus({
      type: "info",
      message:
        "Inicio de sesion con Google simulado. Aqui podras conectar tu proveedor real mas adelante.",
    })
  }

  const statusStyles = {
    idle: "",
    success: "border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
    error: "border-destructive/30 bg-destructive/8 text-destructive",
    info: "border-primary/20 bg-primary/8 text-foreground",
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_40%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
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
                <UsersRound className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  MyWorkSpace UI
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Entra en tu red profesional y comparte tu trayectoria.
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Esta pantalla usa Field, react-hook-form y zod para validar y
                  simular el inicio de sesion de forma mas idiomatica.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85"
              >
                {feature}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-full border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Inicio de sesion
            </p>
            <CardTitle>Bienvenido a MyWorkSpace</CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder a tu perfil profesional.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-6">
            <div className="space-y-6">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleFakeGoogleLogin}
              >
                <IconGoogle aria-hidden="true" className="size-4" />
                Continuar con Google
              </Button>

              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
                <p className="font-medium text-foreground">
                  Credenciales de prueba
                </p>
                <p className="mt-1">
                  Correo: <span className="font-mono">{demoCredentials.email}</span>
                </p>
                <p>
                  Contrasena: <span className="font-mono">{demoCredentials.password}</span>
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-3 overflow-hidden py-1">
                <Separator className="flex-1" />
                <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  o bien
                </span>
                <Separator className="flex-1" />
              </div>

              {status.type !== "idle" ? (
                <div
                  className={`rounded-2xl border p-4 text-sm leading-6 ${statusStyles[status.type]}`}
                >
                  {status.message}
                </div>
              ) : null}

              <form
                className="space-y-6"
                noValidate
                onSubmit={handleSubmit((values) => onSubmit(values))}
              >
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
                          Usa el correo de prueba o introduce uno propio para ver las
                          validaciones.
                        </FieldDescription>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Contrasena</FieldLabel>
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
                            autoComplete="current-password"
                            aria-invalid={fieldState.invalid}
                            placeholder="Introduce tu contrasena"
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

                  <Controller
                    control={control}
                    name="rememberSession"
                    render={({ field, fieldState }) => (
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="remember-session"
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                          <FieldLabel htmlFor="remember-session" className="font-normal">
                            Mantener sesion iniciada
                          </FieldLabel>
                        </div>
                        <Link
                          href="/recover-access"
                          className="text-sm text-muted-foreground transition hover:text-primary"
                        >
                          Recuperar acceso
                        </Link>
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Validando..." : "Entrar a mi perfil"}
                </Button>
              </form>
            </div>

            <div className="space-y-4 pt-1">
              <div className="rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <FileUser className="size-4 text-primary" />
                  Tu CV como carta de presentacion digital
                </div>
                Completa tu perfil y muestra tu experiencia, habilidades y
                proyectos dentro de la comunidad.
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Aun no tienes cuenta?
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Registrate para crear tu perfil y subir tu CV.
                  </p>
                </div>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/register">Crear cuenta</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
