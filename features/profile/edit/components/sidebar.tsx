"use client"

import { Check, Plus, Trash2, X } from "lucide-react"

import { AsyncActionDialog } from "@/components/dialog/async-action-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  SectionKey,
  SectionState,
} from "features/profile/edit/types/section"
import type { SidebarProps } from "features/profile/edit/types/sidebar"
import { fakeRequest } from "@/lib/services/mock/fake-request"

export function Sidebar({
  sections,
  onNavigate,
  onDelete,
  onAdd,
  actionsSlot,
}: SidebarProps) {
  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-background/88 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)]">
        <CardHeader className="px-5 pt-5">
          <CardTitle className="text-base">Secciones visibles</CardTitle>
          <CardDescription>
            Selecciona una seccion para desplazarte a su apartado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {sections.map((section) => (
            <SectionSelectorLink
              key={section.key}
              section={section}
              onNavigate={onNavigate}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          ))}
        </CardContent>
      </Card>

      {actionsSlot ? (
        <div className="flex justify-center">
          {actionsSlot}
        </div>
      ) : null}
    </div>
  )
}

type SectionSelectorLinkProps = {
  section: SectionState
  onNavigate: (href: string) => void
  onDelete: (key: SectionKey) => void
  onAdd: (key: SectionKey, href: string) => void
}

function SectionSelectorLink({
  section,
  onNavigate,
  onDelete,
  onAdd,
}: SectionSelectorLinkProps) {
  const { key, href, label, present } = section

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 p-2 transition hover:border-primary/35 hover:bg-primary/5">
      <button
        type="button"
        className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-1.5 text-left text-sm font-medium text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
          present ? "" : "opacity-65"
        }`}
        onClick={() => (present ? onNavigate(href) : onAdd(key, href))}
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
            present
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 text-muted-foreground"
          }`}
        >
          {present ? (
            <Check className="size-3.5" />
          ) : (
            <X className="size-3.5" />
          )}
        </span>
        <span className="min-w-0 flex-1 leading-5 whitespace-normal">
          {label}
        </span>
      </button>

      {present ? (
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              title={`Eliminar ${label}`}
              aria-label={`Eliminar ${label}`}
              className="shrink-0"
            >
              <Trash2 className="size-4" />
            </Button>
          }
          title="Eliminar seccion completa"
          description="Estas seguro de eliminar una seccion completa del curriculum? Esta accion sera irreversible."
          actionLabel="Eliminar seccion"
          loadingLabel="Eliminando"
          successTitle="Seccion eliminada"
          successDescription="La seccion se ha eliminado del curriculum."
          errorTitle="No se pudo eliminar la seccion"
          errorDescription="No se ha podido eliminar la seccion. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={() => onDelete(key)}
        />
      ) : (
        <Button
          type="button"
          size="icon-sm"
          title={`Anadir ${label}`}
          aria-label={`Anadir ${label}`}
          className="shrink-0"
          onClick={() => onAdd(key, href)}
        >
          <Plus className="size-4" />
        </Button>
      )}
    </div>
  )
}
