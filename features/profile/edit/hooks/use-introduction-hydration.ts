"use client"

import {
  getIntroduction,
  type IntroductionData,
} from "@/lib/services/profile/get-introduction"
import { useHydration } from "@/hooks/use-hydration"

export function useIntroductionHydration() {
  return useHydration<IntroductionData>({
    load: getIntroduction,
    errorMessage: "No se pudo cargar la introduccion:",
  })
}
