"use client"

import Link from "next/link"
import {
  LifeBuoy,
  Mail,
  MapPinned,
  MessageSquareText,
  Phone,
  SendHorizonal,
  UserRound,
} from "lucide-react"
import { useState } from "react"
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

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Introduce al menos 2 caracteres en el nombre."),
  email: z.email("Introduce un correo con formato valido."),
  subject: z
    .string()
    .trim()
    .min(6, "El asunto debe tener al menos 6 caracteres."),
  message: z
    .string()
    .trim()
    .min(20, "El mensaje debe tener al menos 20 caracteres."),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error" | "info"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: ContactFormValues) {
    setStatus({
      type: "info",
      message: "Enviando consulta de prueba al equipo de soporte...",
    })

    await new Promise((resolve) => setTimeout(resolve, 900))

    const isBlockedSubject = /error interno|hack|spam/i.test(values.subject)

    if (isBlockedSubject) {
      setStatus({
        type: "error",
        message:
          "Envio simulado rechazado. Cambia el asunto de prueba para continuar con la demostracion.",
      })
      return
    }

    setStatus({
      type: "success",
      message: `Mensaje simulado enviado correctamente. Te responderiamos en ${values.email} sobre "${values.subject}".`,
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
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.16),_transparent_24%),linear-gradient(155deg,_color-mix(in_oklab,var(--color-primary)_10%,var(--color-background)),_var(--color-background)_42%,_color-mix(in_oklab,var(--color-muted)_72%,white))] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
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
                <LifeBuoy className="size-7" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">
                  Soporte y contacto
                </p>
                <CardTitle className="text-3xl leading-tight sm:text-4xl">
                  Estamos disponibles para ayudarte con MyWorkSpace.
                </CardTitle>
                <CardDescription className="max-w-lg text-sm leading-7 sm:text-base">
                  Este formulario usa la misma base que login y registro:
                  validacion con zod, Controller y mensajes visuales con Field.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0 lg:p-10 lg:pt-0">
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <Mail className="size-4 text-primary" />
                soporte@myworkspace.com
              </div>
              Canal recomendado para incidencias sobre cuenta y acceso.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <Phone className="size-4 text-primary" />
                +34 900 000 000
              </div>
              Horario orientativo de soporte de lunes a viernes.
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm leading-6 text-foreground/85">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <MapPinned className="size-4 text-primary" />
                Atencion online
              </div>
              Gestion centralizada para usuarios, perfiles y consultas legales.
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/92 shadow-[0_28px_120px_-45px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Formulario de contacto
            </p>
            <CardTitle>Escribenos</CardTitle>
            <CardDescription>
              Simula el envio y revisa como responden las validaciones de cada campo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status.type !== "idle" ? (
              <div
                className={`rounded-2xl border p-4 text-sm leading-6 ${statusStyles[status.type]}`}
              >
                {status.message}
              </div>
            ) : null}

            <form
              className="space-y-5"
              noValidate
              onSubmit={handleSubmit((values) => onSubmit(values))}
            >
              <FieldGroup className="sm:grid-cols-2">
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
                          id={field.name}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Tu nombre"
                          className="pl-9"
                        />
                      </div>
                      <FieldDescription>
                        Indica el nombre con el que quieres que te respondamos.
                      </FieldDescription>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

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
                          id={field.name}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="nombre@dominio.com"
                          className="pl-9"
                        />
                      </div>
                      <FieldDescription>
                        Usaremos este correo como destino de respuesta.
                      </FieldDescription>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                <Controller
                  name="subject"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Asunto</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Consulta sobre acceso, cuenta o soporte"
                      />
                      <FieldDescription>
                        En esta demo algunos asuntos se rechazan para mostrar el estado de error.
                      </FieldDescription>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                <Controller
                  name="message"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Mensaje</FieldLabel>
                      <div className="relative">
                        <MessageSquareText className="pointer-events-none absolute top-4 left-3 size-4 text-muted-foreground" />
                        <textarea
                          {...field}
                          id={field.name}
                          rows={6}
                          aria-invalid={fieldState.invalid}
                          placeholder="Describe tu consulta con el mayor detalle posible."
                          className="flex min-h-32 w-full rounded-lg border border-input bg-transparent py-3 pr-3 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                        />
                      </div>
                      <FieldDescription>
                        Explica el contexto para que la respuesta pueda ser mas precisa.
                      </FieldDescription>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <SendHorizonal className="size-4" />
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>

            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              Si tu consulta trata sobre recuperacion de acceso, indica el correo de la cuenta y
              cualquier detalle util para localizarla. Para probar el error simulado, usa en el
              asunto palabras como <span className="font-medium text-foreground">spam</span> o
              <span className="font-medium text-foreground"> error interno</span>.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
