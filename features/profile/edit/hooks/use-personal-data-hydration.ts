"use client"

import type { PersonalDataFormValues } from "@/features/profile/edit/validation/schemas/personal-data"
import { useHydration } from "@/hooks/use-hydration"
import { getPersonalData } from "@/lib/services/profile/get-personal-data"

export function usePersonalDataHydration() {
  return useHydration<PersonalDataFormValues>({
    load: getPersonalData,
    errorMessage: "No se pudieron cargar los datos personales:",
  })
}
