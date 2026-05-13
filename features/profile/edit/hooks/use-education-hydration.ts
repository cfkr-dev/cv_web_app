"use client"

import type { EducationSectionFormValues } from "@/features/profile/edit/validation/schemas/education"
import { useHydration } from "@/hooks/use-hydration"
import { getEducation } from "@/lib/services/profile/get-education"

export function useEducationHydration() {
  return useHydration<EducationSectionFormValues>({
    load: getEducation,
    errorMessage: "No se pudo cargar la educacion:",
  })
}
