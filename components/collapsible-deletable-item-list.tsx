"use client"

import { ChevronDown, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useFormCollapsibleState } from "@/hooks/use-form-collapsible-state"

type CollapsibleDeletableItemProps = {
  title?: string
  subtitle?: string
  collapsible?: boolean
  deleteAction?: React.ReactNode
  expandOnFormId?: string
  children: React.ReactNode
}

export function CollapsibleDeletableItem({
  title,
  subtitle,
  collapsible = false,
  deleteAction,
  expandOnFormId,
  children,
}: CollapsibleDeletableItemProps) {
  const { open, setOpen } = useFormCollapsibleState(expandOnFormId)

  if (collapsible) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <article className="rounded-2xl border border-border/70 bg-background/78 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="min-w-0 flex-1 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {title ? (
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                ) : null}
              </button>
            </CollapsibleTrigger>

            <div className="flex items-center gap-3">
              {deleteAction ?? (
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                  Eliminar
                </Button>
              )}

              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  aria-label={`Alternar ${title?.toLowerCase() ?? "bloque"}`}
                  className="group flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent forceMount className="data-[state=closed]:hidden">
            <div className="p-4 sm:p-5">{children}</div>
          </CollapsibleContent>
        </article>
      </Collapsible>
    )
  }

  return (
    <article className="rounded-2xl border border-border/70 bg-background/78 p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {title ? (
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {title}
            </h3>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {deleteAction ?? (
          <Button type="button" variant="destructive" size="sm">
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        )}
      </div>
      {children}
    </article>
  )
}

type CollapsibleDeletableItemListProps = {
  title?: string
  description?: string
  addLabel?: string
  onAdd?: () => void
  addButton?: React.ReactNode
  children: React.ReactNode
  className?: string
  listClassName?: string
}

export function CollapsibleDeletableItemList({
  title,
  description,
  addLabel,
  onAdd,
  addButton,
  children,
  className,
  listClassName,
}: CollapsibleDeletableItemListProps) {
  return (
    <div className={className}>
      {title || description ? (
        <div className="mb-4">
          {title ? (
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          ) : null}
          {description ? (
            <p className="text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      {addButton || (addLabel && onAdd) ? (
        <div className="mb-5 flex justify-center">
          {addButton ?? (
            <Button type="button" variant="outline" size="sm" onClick={onAdd}>
              <Plus className="size-4" />
              {addLabel}
            </Button>
          )}
        </div>
      ) : null}

      <div className={listClassName ?? "space-y-4"}>{children}</div>
    </div>
  )
}
