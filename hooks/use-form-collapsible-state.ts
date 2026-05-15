"use client"

import { useEffect, useState } from "react"

import { expandFormCollapsiblesEventName } from "@/lib/utils/validation/form-collapsible"

type ExpandFormCollapsiblesDetail = {
  formId: string
}

export function useFormCollapsibleState(formId?: string, defaultOpen = true) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    if (!formId) {
      return
    }

    function handleExpandAll(event: Event) {
      const customEvent = event as CustomEvent<ExpandFormCollapsiblesDetail>

      if (customEvent.detail?.formId !== formId) {
        return
      }

      setOpen(true)
    }

    document.addEventListener(expandFormCollapsiblesEventName, handleExpandAll)

    return () => {
      document.removeEventListener(
        expandFormCollapsiblesEventName,
        handleExpandAll
      )
    }
  }, [formId])

  return {
    open,
    setOpen,
  }
}
