"use client"

import { ChevronDown, Plus, Save } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/ui/collapsible"
import { useFormCollapsibleState } from "@/hooks/use-form-collapsible-state"
import { scrollToSection } from "@/lib/utils/general/ui"
import type {
  SectionKey,
  SectionState,
  SectionProps
} from "features/profile/edit/types/section"

type SetSections = Dispatch<SetStateAction<SectionState[]>>

export function isSectionPresent(sections: SectionState[], key: SectionKey) {
  return sections.some((section) => section.key === key && section.present)
}

export function handleSectionNavigation(href: string) {
  scrollToSection(href)
}

export function handleSectionDelete(
  key: SectionKey,
  setSections: SetSections
) {
  setSections((currentSections) =>
    currentSections.map((section) =>
      section.key === key ? { ...section, present: false } : section
    )
  )
}

export function handleSectionAdd(
  key: SectionKey,
  href: string,
  setSections: SetSections
) {
  setSections((currentSections) =>
    currentSections.map((section) =>
      section.key === key ? { ...section, present: true } : section
    )
  )

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => scrollToSection(href))
  })
}

export function Section({
  id,
  title,
  description,
  icon,
  actionLabel,
  showSectionSave = false,
  saveFormId,
  children,
}: SectionProps) {
  const { open, setOpen } = useFormCollapsibleState(saveFormId)

  return (
    <section id={id} className="scroll-mt-28">
      <Collapsible open={open} onOpenChange={setOpen}>
        <Card className="overflow-hidden border-border/70 bg-background/88 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)]">
          <CardHeader className="gap-4 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-start gap-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </button>
              </CollapsibleTrigger>

              {actionLabel ? (
                <Button type="button" variant="outline">
                  <Plus className="size-4" />
                  {actionLabel}
                </Button>
              ) : null}

              {showSectionSave && saveFormId ? (
                <Button type="submit" form={saveFormId}>
                  <Save className="size-4" />
                  Guardar seccion
                </Button>
              ) : showSectionSave ? (
                <Button type="button">
                  <Save className="size-4" />
                  Guardar seccion
                </Button>
              ) : null}

              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  aria-label={`Alternar ${title.toLowerCase()}`}
                  className="group flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent forceMount className="data-[state=closed]:hidden">
            <CardContent className="border-t border-border/70 px-5 py-5 sm:px-6 sm:py-6">
              {children}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </section>
  )
}
