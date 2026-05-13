"use client"

import { useHydration } from "@/hooks/use-hydration"
import type { WorkExperienceSectionFormValues } from "@/features/profile/edit/validation/schemas/work-experience"
import { getWorkExperience } from "@/lib/services/profile/get-work-experience"

export function useWorkExperienceHydration() {
  return useHydration<WorkExperienceSectionFormValues>({
    load: getWorkExperience,
    errorMessage: "No se pudo cargar la experiencia laboral:",
  })
}
