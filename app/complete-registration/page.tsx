"use client"

import Link from "next/link"
import { ArrowLeft, MapPinned, ShieldCheck, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input"

import { ProfileImageCropField } from "@/components/profile-image-crop-field"
import { grantProtectedRouteAccess } from "@/lib/protected-route-access"
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
import { PhoneInput } from "@/components/ui/phone-input"

const acceptedImageTypes = ["image/jpeg", "image/png"]
const maxProfileImageSize = 2 * 1024 * 1024

const completionSchema = z
  .object({
    name: z.string().trim().min(1, "Introduce tu nombre."),
    surname: z.string().trim().min(1, "Introduce tus apellidos."),
    profileImageName: z.string().min(1, "Sube una imagen de perfil."),
    profileImageDataUrl: z.string().min(1, "Sube una imagen de perfil."),
    profileImageMimeType: z.string(),
    profileImageSize: z.number(),
    location: z.string().trim().min(1, "Introduce tu localidad."),
    postalCode: z
      .string()
      .trim()
      .min(4, "Introduce un codigo postal valido.")
      .max(10, "Introduce un codigo postal valido."),
    mobile: z
      .string()
      .trim()
      .min(1, "Introduce un movil valido.")
      .refine((value) => isValidPhoneNumber(value), "Introduce un movil valido."),
  })
  .superRefine((values, context) => {
    if (values.profileImageDataUrl && !acceptedImageTypes.includes(values.profileImageMimeType)) {
      context.addIssue({
        code: "custom",
        message: "La imagen debe ser un archivo PNG o JPG.",
        path: ["profileImageDataUrl"],
      })
    }

    if (values.profileImageDataUrl && values.profileImageSize > maxProfileImageSize) {
      context.addIssue({
        code: "custom",
        message: "La imagen no puede superar los 2 MB.",
        path: ["profileImageDataUrl"],
      })
    }
  })

type CompletionFormValues = z.infer<typeof completionSchema>

const completionTips = [
  "Anade una foto de perfil bien encuadrada para mostrar una imagen mas cuidada.",
  "Tu localidad ayuda a situar tu disponibilidad profesional.",
  "El movil facilita el contacto directo cuando lo necesites.",
]

export default function CompleteRegistrationPage() {
  const router = useRouter()
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const form = useForm<CompletionFormValues>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      name: "",
      surname: "",
      profileImageName: "",
      profileImageDataUrl: "",
      profileImageMimeType: "",
      profileImageSize: 0,
      location: "",
      postalCode: "",
      mobile: "",
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form

  const profileImageDataUrl = useWatch({ control, name: "profileImageDataUrl" }) ?? ""

  async function onSubmit(values: CompletionFormValues) {
    setStatus({
      type: "info",
      message: "Guardando los datos adicionales de tu perfil...",
    })

    await new Promise((resolve) => setTimeout(resolve, 900))

    setStatus({
      type: "success",
      message: `Perfil complementario actualizado con ${values.location}, CP ${values.postalCode} y movil ${values.mobile}.`,
    })

    grantProtectedRouteAccess("/profile")

    setTimeout(() => {
      router.push("/profile")
    }, 500)
  }

  const statusStyles = {
    idle: "",
    success: "border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
    error: "border-destructive/30 bg-destructive/8 text-destructive",
    info: "border-primary/20 bg-primary/8 text-foreground",
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_40%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="gap-4 overflow-hidden border-border/60 bg-[linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_16%,transparent),_transparent_42%)] shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader className="gap-6 p-6 sm:p-8 lg:p-10">
            <Link
              href="/register"
              className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              Volver al registro
            </Link>
            <div className="space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <ShieldCheck className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Completar perfil
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Anade los datos finales para terminar tu alta.
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Este segundo paso completa la informacion basica de tu perfil
                  publico tras crear la cuenta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            {completionTips.map((tip) => (
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
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Paso 2
            </p>
            <CardTitle>Completa tu registro</CardTitle>
            <CardDescription>
              Sube tu foto de perfil y deja listos tus datos de contacto
              basicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {status.type !== "idle" ? (
              <div
                className={`rounded-2xl border p-4 text-sm leading-6 ${statusStyles[status.type]}`}
              >
                {status.message}
              </div>
            ) : null}

            <form
              className="grid gap-5 sm:grid-cols-2"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <FieldGroup className="sm:col-span-2 sm:grid-cols-2">
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          id={field.name}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Tu nombre"
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
                  name="surname"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Apellidos</FieldLabel>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          id={field.name}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Tus apellidos"
                          className="pl-9"
                        />
                      </div>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Controller
                name="profileImageDataUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="sm:col-span-2"
                  >
                    <FieldLabel>Imagen de perfil</FieldLabel>
                    <ProfileImageCropField
                      valueDataUrl={profileImageDataUrl}
                      invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      onChange={({ dataUrl, name, mimeType, size }) => {
                        setValue("profileImageName", name, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                        setValue("profileImageMimeType", mimeType, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                        setValue("profileImageSize", size, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                        field.onChange(dataUrl)
                      }}
                    />
                    <FieldDescription>
                      Formatos permitidos: PNG y JPG. Tamano maximo: 2 MB.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Localidad</FieldLabel>
                    <div className="relative">
                      <MapPinned className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Tu localidad"
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
                name="postalCode"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Codigo postal</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id={field.name}
                      type="text"
                      inputMode="numeric"
                      aria-invalid={fieldState.invalid}
                      placeholder="28001"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="mobile"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="sm:col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>Movil</FieldLabel>
                    <PhoneInput
                      {...field}
                      value={field.value ?? ""}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      international
                      placeholder="Introduce tu movil"
                    />
                    <FieldDescription>
                      Este numero se usara para completar tu perfil de contacto.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-between">
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">
                    <ArrowLeft className="size-4" />
                    Volver
                  </Link>
                </Button>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Finalizar registro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
