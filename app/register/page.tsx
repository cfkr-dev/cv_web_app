"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react"
import { IconGoogle } from "nucleo-social-media"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  consumeBlockedRouteNotice,
  grantProtectedRouteAccess,
} from "@/lib/protected-route-access"
import { Separator } from "@/components/ui/separator"

const steps = [
  "Crea tu cuenta profesional en pocos segundos.",
  "Sube tu CV y completa tu perfil publico.",
  "Empieza a construir tu presencia en MyWorkSpace.",
]

const registerSchema = z
  .object({
    email: z.email("Introduce un correo con formato valido."),
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
    acceptedTerms: z.boolean().refine((value) => value, {
      message: "Debes aceptar los terminos para continuar.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

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

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [blockedNoticeVisible, setBlockedNoticeVisible] = useState(false)
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const password = useWatch({ control, name: "password" }) ?? ""
  const strength = useMemo(() => getPasswordStrength(password), [password])

  useEffect(() => {
    setBlockedNoticeVisible(consumeBlockedRouteNotice("/complete-registration"))
  }, [])

  async function onSubmit(values: RegisterFormValues) {
    grantProtectedRouteAccess("/complete-registration")
    setStatus({ type: "info", message: "Creando cuenta de prueba..." })

    await new Promise((resolve) => setTimeout(resolve, 900))

    setStatus({
      type: "success",
      message: `Cuenta creada para ${values.email}. Vamos a completar tu perfil.`,
    })

    await new Promise((resolve) => setTimeout(resolve, 700))
    router.push("/complete-registration")
  }

  function handleFakeGoogleRegister() {
    grantProtectedRouteAccess("/complete-registration")
    setStatus({
      type: "info",
      message: "Registro con Google simulado. Continuamos con la configuracion del perfil.",
    })

    window.setTimeout(() => {
      router.push("/complete-registration")
    }, 700)
  }

  const statusStyles = {
    idle: "",
    success: "border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
    error: "border-destructive/30 bg-destructive/8 text-destructive",
    info: "border-primary/20 bg-primary/8 text-foreground",
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_40%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="gap-4 overflow-hidden border-border/60 bg-[linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_16%,transparent),_transparent_42%)] shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader className="gap-6 p-6 sm:p-8 lg:p-10">
            <Link
              href="/login"
              className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              Ya tengo cuenta
            </Link>
            <div className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <BriefcaseBusiness className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Registro MyWorkSpace UI
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Crea tu cuenta y empieza a mostrar tu perfil profesional.
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  El alta ahora usa Field, react-hook-form y zod para una
                  validacion mas clara y mantenible.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            {steps.map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85"
              >
                {step}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Crear cuenta
            </p>
            <CardTitle>Unete a MyWorkSpace</CardTitle>
            <CardDescription>
              Registra tu perfil profesional y prepara tu CV para compartirlo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {blockedNoticeVisible ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-800 dark:text-amber-200">
                Debes completar primero este paso del registro antes de entrar en la pantalla final.
              </div>
            ) : null}

            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleFakeGoogleRegister}
            >
              <IconGoogle aria-hidden="true" className="size-4" />
              Registrarme con Google
            </Button>

            <div className="flex min-w-0 items-center gap-3 overflow-hidden">
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

            <form className="grid gap-5 sm:grid-cols-2" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
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
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
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
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Crea una contrasena segura"
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
                      Usa una contrasena robusta con mayusculas, minusculas, numeros
                      y simbolos.
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
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <FieldLabel htmlFor={field.name}>Repetir contrasena</FieldLabel>
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
                        placeholder="Repite la contrasena"
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
                name="acceptedTerms"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <div className="flex items-start gap-2 rounded-2xl border border-border/70 p-4">
                      <Checkbox
                        id="register-terms"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      />
                      <FieldLabel
                        htmlFor="register-terms"
                        className="text-sm leading-6 font-normal text-muted-foreground"
                      >
                        Acepto los{" "}
                        <Link
                          href="/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground underline underline-offset-4"
                        >
                          terminos y condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground underline underline-offset-4"
                        >
                          politica de privacidad
                        </Link>
                        .
                      </FieldLabel>
                    </div>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creando cuenta..." : "Crear mi cuenta"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
