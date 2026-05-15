"use client"

import { useState } from "react"

import { useAppToast, type AppToastOptions } from "@/hooks/use-app-toast"
import { submitProfileSectionValues } from "@/features/profile/edit/validation/helpers/form-submit"

type UseProfileSectionSaveOptions<TValues> = {
  getValues: () => TValues
  reset: (values: TValues) => void
  onConfirmAction: (values: TValues) => Promise<void>
  validationErrorToast?: AppToastOptions
}

export function useProfileSectionSave<TValues>({
  getValues,
  reset,
  onConfirmAction,
  validationErrorToast,
}: UseProfileSectionSaveOptions<TValues>) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const appToast = useAppToast()

  function clearValidationStatePreservingValues() {
    reset(getValues())
  }

  function openConfirmDialog() {
    setDialogOpen(true)
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open)

    if (!open) {
      clearValidationStatePreservingValues()
    }
  }

  function handleInvalidSubmit() {
    appToast.error(
      validationErrorToast ?? {
        title: "No se puede guardar la seccion",
        description: "Corrige los errores del formulario antes de continuar.",
      }
    )
  }

  async function runConfirmAction() {
    await submitProfileSectionValues({
      values: getValues(),
      reset,
      onConfirmAction,
    })
  }

  return {
    clearValidationStatePreservingValues,
    dialogOpen,
    handleDialogOpenChange,
    handleInvalidSubmit,
    openConfirmDialog,
    runConfirmAction,
  }
}
