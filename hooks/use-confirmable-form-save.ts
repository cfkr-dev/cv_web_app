"use client"

import { useState } from "react"

type UseConfirmableSectionSaveOptions<TValues> = {
  getValues: () => TValues
  reset: (values: TValues) => void
  onConfirmAction: (values: TValues) => Promise<void>
}

export function useConfirmableFormSave<TValues>({
  getValues,
  reset,
  onConfirmAction,
}: UseConfirmableSectionSaveOptions<TValues>) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingValues, setPendingValues] = useState<TValues | null>(null)

  function handleValidSubmit(values: TValues) {
    setPendingValues(values)
    setDialogOpen(true)
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open)

    if (!open) {
      setPendingValues(null)
      reset(getValues())
    }
  }

  async function runConfirmAction() {
    if (!pendingValues) {
      throw new Error("Valida los datos antes de guardar.")
    }

    console.log("Form submit payload:", pendingValues)
    await onConfirmAction(pendingValues)
  }

  async function runImmediateSubmit() {
    const currentValues = getValues()

    console.log("Form submit payload:", currentValues)
    await onConfirmAction(currentValues)
    reset(currentValues)

    return true
  }

  return {
    dialogOpen,
    handleDialogOpenChange,
    handleValidSubmit,
    pendingValues,
    runImmediateSubmit,
    runConfirmAction,
  }
}
