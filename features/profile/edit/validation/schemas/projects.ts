import z from "zod"
import {
  projectsItemDescriptionMaxLength,
  projectsItemNameMaxLength,
} from "@/features/profile/edit/validation/config/constants"
import { multimediaSchema } from "@/features/multimedia/edit/validation/schemas/multimedia"
import { getCurrentStringDate } from "@/lib/utils/general/date"
import {
  isDateOutOfAllowedRange,
  isStartDateAfterEndDate,
} from "@/lib/utils/validation/date"

const projectEntrySchema = z
  .object({
    id: z.string().trim().optional(),
    name: z
      .string()
      .trim()
      .min(1, "Introduce el nombre del proyecto.")
      .max(
        projectsItemNameMaxLength,
        `El nombre del proyecto no puede superar ${projectsItemNameMaxLength} caracteres.`
      ),
    start: z.string().trim(),
    end: z.string().trim(),
    isCurrent: z.boolean(),
    description: z
      .string()
      .trim()
      .max(
        projectsItemDescriptionMaxLength,
        `La descripcion no puede superar ${projectsItemDescriptionMaxLength} caracteres.`
      ),
    media: z.array(multimediaSchema),
  })
  .superRefine((projectItem, context) => {
    if (!projectItem.start) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una fecha de inicio.",
        path: ["start"],
      })
    } else if (
      isDateOutOfAllowedRange(
        projectItem.start,
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

    if (!projectItem.end && !projectItem.isCurrent) {
      context.addIssue({
        code: "custom",
        message:
          "Selecciona una fecha de fin o marca que el proyecto sigue activo.",
        path: ["end"],
      })
    } else if (
      projectItem.end &&
      isDateOutOfAllowedRange(
        projectItem.end,
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
      projectItem.start &&
      projectItem.end &&
      isStartDateAfterEndDate(projectItem.start, projectItem.end)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "La fecha de inicio no puede ser posterior a la fecha de fin.",
        path: ["start"],
      })
    }
  })

export const projectsSectionSchema = z.object({
  projects: z.array(projectEntrySchema),
})

export type ProjectsSectionFormValues = z.infer<
  typeof projectsSectionSchema
>
