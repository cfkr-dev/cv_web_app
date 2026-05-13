"use client"

import type { SkillsSectionFormValues } from "@/features/profile/edit/validation/schemas/skills"
import { useHydration } from "@/hooks/use-hydration"
import { getSkills } from "@/lib/services/profile/get-skills"

export function useSkillsHydration() {
  return useHydration<SkillsSectionFormValues>({
    load: getSkills,
    errorMessage: "No se pudieron cargar las habilidades:",
  })
}
