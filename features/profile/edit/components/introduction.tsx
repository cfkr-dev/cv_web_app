"use client"

import Image from "next/image"
import { Mail, MapPin, Phone, SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { IntroductionData } from "@/lib/services/profile/get-introduction"

type IntroductionProps = {
  data: IntroductionData | null
  isLoading?: boolean
}

export function Introduction({ data, isLoading = false }: IntroductionProps) {
  if (isLoading) {
    return <IntroductionSkeleton />
  }

  if (!data) {
    return null
  }

  const { name, surname, location, postalCode, phone, email } = data

  return (
    <section className="scroll-mt-28">
      <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,_color-mix(in_oklab,var(--color-primary)_12%,white),_var(--color-background)_45%,_color-mix(in_oklab,var(--color-muted)_70%,white))] shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)]">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Informacion personal
              </h1>
            </div>

            <Button type="button" variant="outline">
              <SquarePen className="size-4" />
              Editar informacion personal
            </Button>
          </div>

          <div className="grid gap-5 xl:grid-cols-[14rem_minmax(0,1fr)] xl:items-center">
            <div className="mx-auto w-full max-w-[14rem] xl:mx-0">
              <div className="overflow-hidden rounded-[1.9rem] border border-border/80 bg-background shadow-sm">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/profile_default.png"
                    alt={`Foto de perfil de ${name} ${surname}`}
                    fill
                    priority
                    sizes="14rem"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 p-1 text-center sm:p-4">
              <div className="space-y-3">
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {name} {surname}
                </h2>
              </div>

              <div className="border-y border-border/70 py-4">
                <p className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
                  <MapPin className="size-5 text-primary" />
                  {location}, {postalCode}
                </p>
              </div>

              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <p className="inline-flex items-center justify-center gap-2 text-base font-semibold text-foreground">
                  <Phone className="size-4 text-primary" />
                  {phone}
                </p>
                <p className="inline-flex items-center justify-center gap-2 text-base font-semibold text-foreground">
                  <Mail className="size-4 text-primary" />
                  {email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function IntroductionSkeleton() {
  return (
    <section className="scroll-mt-28">
      <Skeleton
        className="w-full rounded-[1.9rem]"
        style={{ height: "29rem" }}
      />
    </section>
  )
}
