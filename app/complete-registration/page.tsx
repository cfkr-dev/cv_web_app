"use client"

import Link from "next/link"
import { ArrowLeft, FileUp, ImageUp, MapPinned, Phone, ShieldCheck, UserRound } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
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

const maxCvFileSize = 5 * 1024 * 1024

const completionSchema = z.object({
  name: z.string().trim().min(1, "Introduce tu nombre."),
  surname: z.string().trim().min(1, "Introduce tus apellidos."),
  profileImageName: z.string().min(1, "Sube una imagen de perfil."),
  cvFile: z
    .custom<File | null>((value) => value instanceof File, {
      message: "Adjunta tu CV en formato PDF.",
    })
    .refine((file) => file instanceof File && file.type === "application/pdf", {
      message: "El CV debe ser un archivo PDF.",
    })
    .refine((file) => file instanceof File && file.size <= maxCvFileSize, {
      message: "El CV no puede superar los 5 MB.",
    }),
  location: z.string().trim().min(1, "Introduce tu localidad."),
  postalCode: z
    .string()
    .trim()
    .min(4, "Introduce un codigo postal valido.")
    .max(10, "Introduce un codigo postal valido."),
  mobile: z
    .string()
    .trim()
    .min(9, "Introduce un movil valido.")
    .max(20, "Introduce un movil valido."),
})

type CompletionFormValues = z.infer<typeof completionSchema>

const completionTips = [
  "Anade una foto para dar contexto visual a tu perfil.",
  "Tu localidad ayuda a situar tu disponibilidad profesional.",
  "El movil facilita el contacto directo cuando lo necesites.",
]

export default function CompleteRegistrationPage() {
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
      cvFile: null,
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

  const profileImageName = useWatch({ control, name: "profileImageName" }) ?? ""
  const cvFile = useWatch({ control, name: "cvFile" })

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
              Sube tu foto, adjunta tu CV y deja listos tus datos de contacto basicos.
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

            <form className="grid gap-5 sm:grid-cols-2" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                name="profileImageName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <FieldLabel htmlFor="profile-image">Imagen de perfil</FieldLabel>
                    <div className="relative">
                      <ImageUp className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        aria-invalid={fieldState.invalid}
                        className="pl-9"
                        onChange={(event) => {
                          const nextValue = event.target.files?.[0]?.name ?? ""
                          field.onChange(nextValue)
                          setValue("profileImageName", nextValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                      />
                    </div>
                    {profileImageName ? (
                      <FieldDescription>Imagen seleccionada: {profileImageName}</FieldDescription>
                    ) : null}
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="cvFile"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <FieldLabel htmlFor="profile-cv">CV en PDF</FieldLabel>
                    <div className="relative">
                      <FileUp className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="profile-cv"
                        type="file"
                        accept="application/pdf,.pdf"
                        aria-invalid={fieldState.invalid}
                        className="pl-9"
                        onChange={(event) => {
                          const nextValue = event.target.files?.[0] ?? null
                          field.onChange(nextValue)
                          setValue("cvFile", nextValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                      />
                    </div>
                    <FieldDescription>
                      Adjunta un PDF de hasta 5 MB.
                      {cvFile instanceof File ? ` Archivo seleccionado: ${cvFile.name}` : ""}
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
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <FieldLabel htmlFor={field.name}>Movil</FieldLabel>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={field.name}
                        type="tel"
                        inputMode="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="+34 600 123 123"
                        className="pl-9"
                      />
                    </div>
                    <FieldDescription>
                      Este numero se usara para completar tu perfil de contacto.
                    </FieldDescription>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
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
