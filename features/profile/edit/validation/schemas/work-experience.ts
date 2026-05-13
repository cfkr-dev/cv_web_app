import z from "zod"
import {
  workExperienceCompanyMaxLength,
  workExperienceDescriptionMaxLength,
  workExperienceLocationMaxLength,
  workExperienceTitleMaxLength,
} from "@/features/profile/edit/validation/config/constants"
import { multimediaSchema } from "@/features/multimedia/edit/validation/schemas/multimedia"
import { getCurrentStringDate } from "@/lib/utils/general/date"
import {
  isDateOutOfAllowedRange,
  isStartDateAfterEndDate,
} from "@/lib/utils/validation/date"
import { validateLocation } from "@/lib/utils/validation/location"

const workExperienceEntrySchema = z
  .object({
    id: z.string().trim().optional(),
    title: z
      .string()
      .trim()
      .min(1, "Introduce el puesto.")
      .max(
        workExperienceTitleMaxLength,
        `El puesto no puede superar ${workExperienceTitleMaxLength} caracteres.`
      ),
    company: z
      .string()
      .trim()
      .max(
        workExperienceCompanyMaxLength,
        `La empresa no puede superar ${workExperienceCompanyMaxLength} caracteres.`
      ),
    location: z
      .string()
      .trim()
      .max(
        workExperienceLocationMaxLength,
        `La localizacion no puede superar ${workExperienceLocationMaxLength} caracteres.`
      ),
    isRemote: z.boolean(),
    start: z.string().trim(),
    end: z.string().trim(),
    isCurrent: z.boolean(),
    description: z
      .string()
      .trim()
      .max(
        workExperienceDescriptionMaxLength,
        `La descripcion no puede superar ${workExperienceDescriptionMaxLength} caracteres.`
      ),
    media: z.array(multimediaSchema),
  })
  .superRefine(async (workExperienceItem, context) => {
    if (!workExperienceItem.location && !workExperienceItem.isRemote) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una localizacion o marca En remoto.",
        path: ["location"],
      })
    }

    if (workExperienceItem.location && !workExperienceItem.isRemote) {
      const isValidLocation = await validateLocation(workExperienceItem.location)

      if (!isValidLocation) {
        context.addIssue({
          code: "custom",
          message: "Selecciona una localizacion valida de la lista.",
          path: ["location"],
        })
      }
    }

    if (!workExperienceItem.start) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una fecha de inicio.",
        path: ["start"],
      })
    } else if (
      isDateOutOfAllowedRange(
        workExperienceItem.start,
        "1900-01-01",
        getCurrentStringDate("yyyy-mm-dd")
      )
    ) {
      context.addIssue({
        code: "custom",
        message:
          "La fecha de inicio debe estar entre enero de 1900 y el mes actual.",
        path: ["start"],
      })
    }

    if (!workExperienceItem.end && !workExperienceItem.isCurrent) {
      context.addIssue({
        code: "custom",
        message:
          "Selecciona una fecha de fin o marca que actualmente trabajas ahi.",
        path: ["end"],
      })
    } else if (
      workExperienceItem.end &&
      isDateOutOfAllowedRange(
        workExperienceItem.end,
        "1900-01-01",
        getCurrentStringDate("yyyy-mm-dd")
      )
    ) {
      context.addIssue({
        code: "custom",
        message:
          "La fecha de fin debe estar entre enero de 1900 y el mes actual.",
        path: ["end"],
      })
    }

    if (
      workExperienceItem.start &&
      workExperienceItem.end &&
      isStartDateAfterEndDate(workExperienceItem.start, workExperienceItem.end)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "La fecha de inicio no puede ser posterior a la fecha de fin.",
        path: ["start"],
      })
    }
  })

export const workExperienceSectionSchema = z.object({
  experiences: z.array(workExperienceEntrySchema),
})

export type WorkExperienceSectionFormValues = z.infer<
  typeof workExperienceSectionSchema
>
