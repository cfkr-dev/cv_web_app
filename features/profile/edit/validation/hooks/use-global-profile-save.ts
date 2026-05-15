"use client"

import { useState } from "react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { useAppToast } from "@/hooks/use-app-toast"
import type { SectionState } from "@/features/profile/edit/types/section"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"
import {
  clearGlobalProfileSectionsValidationState,
  submitGlobalProfileSections,
  validateGlobalProfileSections,
} from "@/features/profile/edit/validation/helpers/global-profile-submit"

type SectionSubmitRefs = {
  personalDataRef: React.RefObject<SectionSubmitHandle | null>
  workExperienceRef: React.RefObject<SectionSubmitHandle | null>
  educationRef: React.RefObject<SectionSubmitHandle | null>
  skillsRef: React.RefObject<SectionSubmitHandle | null>
  projectsRef: React.RefObject<SectionSubmitHandle | null>
}

type UseGlobalProfileSaveOptions = {
  sections: SectionState[]
  refs: SectionSubmitRefs
  router: AppRouterInstance
}

export function useGlobalProfileSave({
  sections,
  refs,
  router,
}: UseGlobalProfileSaveOptions) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const appToast = useAppToast()

  async function handleGlobalSaveClick() {
    const isValid = await validateGlobalProfileSections(sections, refs)

    if (!isValid) {
      appToast.error({
        title: "No se puede guardar el perfil",
        description: "Corrige los errores del formulario antes de continuar.",
      })
      return
    }

    setDialogOpen(true)
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open)

    if (!open) {
      clearGlobalProfileSectionsValidationState(sections, refs)
    }
  }

  async function runGlobalConfirmAction() {
    await submitGlobalProfileSections(sections, refs)
  }

  function handleSuccessClose() {
    router.push("/profile")
  }

  return {
    dialogOpen,
    handleDialogOpenChange,
    handleGlobalSaveClick,
    handleSuccessClose,
    runGlobalConfirmAction,
  }
}
