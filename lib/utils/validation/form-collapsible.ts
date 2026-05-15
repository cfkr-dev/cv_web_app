"use client"

import { nextFrame } from "@/lib/utils/general/ui"

export const expandFormCollapsiblesEventName = "form:expand-collapsibles"

type ExpandFormCollapsiblesDetail = {
  formId: string
}

export async function expandFormCollapsibles(formId?: string) {
  if (!formId || typeof document === "undefined") {
    return
  }

  document.dispatchEvent(
    new CustomEvent<ExpandFormCollapsiblesDetail>(
      expandFormCollapsiblesEventName,
      {
        detail: { formId },
      }
    )
  )

  await nextFrame()
  await nextFrame()
}
