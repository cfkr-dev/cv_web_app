import { z } from "zod"
import { personalDataSummaryMaxLength } from "@/features/profile/edit/validation/config/constants"
import { isValidOptionalLinkedInUrl } from "@/features/profile/edit/validation/helpers/url"
import { isValidOptionalHttpUrl } from "@/lib/utils/validation/url"

export const personalDataSchema = z.object({
  role: z
    .string()
    .trim()
    .min(2, "Introduce tu puesto profesional.")
    .max(80, "El puesto profesional no puede superar 80 caracteres."),
  linkedin: z
    .string()
    .trim()
    .refine(
      isValidOptionalLinkedInUrl,
      "Introduce un enlace de LinkedIn valido."
    ),
  website: z
    .string()
    .trim()
    .refine(isValidOptionalHttpUrl, "Introduce una pagina web valida."),
  summary: z
    .string()
    .trim()
    .max(
      personalDataSummaryMaxLength,
      `El resumen no puede superar ${personalDataSummaryMaxLength} caracteres.`
    ),
})

export type PersonalDataFormValues = z.infer<typeof personalDataSchema>