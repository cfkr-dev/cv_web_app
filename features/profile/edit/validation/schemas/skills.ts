import z from "zod"
import { skillLevels } from "@/features/profile/edit/config/skills-defaults"
import {
  skillsGroupDescriptionMaxLength,
  skillsGroupTitleMaxLength,
  skillsItemCustomDescriptionMaxLength,
  skillsItemDescriptionMaxLength,
  skillsItemNameMaxLength,
} from "@/features/profile/edit/validation/config/constants"
import {
  capitalizeSkillWords,
  validateSkillName,
} from "@/lib/utils/validation/skill"

const skillEntrySchema = z.object({
  id: z.string().trim().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Introduce el nombre de la habilidad.")
    .max(
      skillsItemNameMaxLength,
      `La habilidad no puede superar ${skillsItemNameMaxLength} caracteres.`
    )
    .transform(capitalizeSkillWords),
  customDescription: z
    .string()
    .trim()
    .max(
      skillsItemCustomDescriptionMaxLength,
      `La descripcion breve no puede superar ${skillsItemCustomDescriptionMaxLength} caracteres.`
    ),
  level: z
    .string()
    .trim()
    .refine(
      (value) =>
        skillLevels.includes(value as (typeof skillLevels)[number]),
      "Selecciona un nivel valido."
    ),
  description: z
    .string()
    .trim()
    .max(
      skillsItemDescriptionMaxLength,
      `La descripcion no puede superar ${skillsItemDescriptionMaxLength} caracteres.`
    ),
}).superRefine((skill, context) => {
  if (validateSkillName(skill.name) || skill.customDescription.trim().length > 0) {
    return
  }

  context.addIssue({
    code: z.ZodIssueCode.custom,
    path: ["customDescription"],
    message:
      "Si la habilidad no existe en las sugerencias, anade una descripcion breve.",
  })
})

const skillGroupEntrySchema = z.object({
  id: z.string().trim().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Introduce el nombre del grupo.")
    .max(
      skillsGroupTitleMaxLength,
      `El grupo no puede superar ${skillsGroupTitleMaxLength} caracteres.`
    ),
  description: z
    .string()
    .trim()
    .max(
      skillsGroupDescriptionMaxLength,
      `La descripcion no puede superar ${skillsGroupDescriptionMaxLength} caracteres.`
    ),
  skills: z.array(skillEntrySchema).min(1, "Anade al menos una habilidad."),
})

export const skillsSectionSchema = z.object({
  groups: z.array(skillGroupEntrySchema),
})

export type SkillsSectionFormValues = z.infer<typeof skillsSectionSchema>
