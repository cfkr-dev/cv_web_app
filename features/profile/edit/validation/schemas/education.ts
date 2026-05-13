import z from "zod"
import { educationLanguageLevels } from "@/features/profile/edit/config/education-languages-defaults"
import {
  eduactionCoursesAndCerfificationsDescriptionMaxLength,
  eduactionCoursesAndCerfificationsInstitutionMaxLength,
  eduactionCoursesAndCerfificationsLocationMaxLength,
  eduactionCoursesAndCerfificationsTitleMaxLength,
  educationLanguageCodeLength,
  educationLanguageNameMaxLength,
  educationStudiesDescriptionMaxLength,
  educationStudiesInstitutionMaxLength,
  educationStudiesLocationMaxLength,
  educationStudiesTitleMaxLength,
} from "@/features/profile/edit/validation/config/constants"
import { multimediaSchema } from "@/features/multimedia/edit/validation/schemas/multimedia"
import { getCurrentStringDate } from "@/lib/utils/general/date"
import {
  isDateOutOfAllowedRange,
  isStartDateAfterEndDate,
} from "@/lib/utils/validation/date"
import { validateLanguage } from "@/lib/utils/validation/language"
import { validateLocation } from "@/lib/utils/validation/location"

const educationStudyEntrySchema = z
  .object({
    id: z.string().trim().optional(),
    title: z
      .string()
      .trim()
      .min(1, "Introduce el nombre del estudio.")
      .max(
        educationStudiesTitleMaxLength,
        `El nombre del estudio no puede superar ${educationStudiesTitleMaxLength} caracteres.`
      ),
    institution: z
      .string()
      .trim()
      .max(
        educationStudiesInstitutionMaxLength,
        `El centro no puede superar ${educationStudiesInstitutionMaxLength} caracteres.`
      ),
    location: z
      .string()
      .trim()
      .max(
        educationStudiesLocationMaxLength,
        `La localizacion no puede superar ${educationStudiesLocationMaxLength} caracteres.`
      ),
    isRemote: z.boolean(),
    start: z.string().trim(),
    end: z.string().trim(),
    isCurrent: z.boolean(),
    description: z
      .string()
      .trim()
      .max(
        educationStudiesDescriptionMaxLength,
        `La descripcion no puede superar ${educationStudiesDescriptionMaxLength} caracteres.`
      ),
    media: z.array(multimediaSchema),
  })
  .superRefine(async (educationStudy, context) => {
    if (!educationStudy.location && !educationStudy.isRemote) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una localizacion o marca Online.",
        path: ["location"],
      })
    }

    if (educationStudy.location && !educationStudy.isRemote) {
      const isValidLocation = await validateLocation(educationStudy.location)

      if (!isValidLocation) {
        context.addIssue({
          code: "custom",
          message: "Selecciona una localizacion valida de la lista.",
          path: ["location"],
        })
      }
    }

    if (!educationStudy.start) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una fecha de inicio.",
        path: ["start"],
      })
    } else if (
      isDateOutOfAllowedRange(
        educationStudy.start,
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

    if (!educationStudy.end && !educationStudy.isCurrent) {
      context.addIssue({
        code: "custom",
        message:
          "Selecciona una fecha de fin o marca que actualmente cursas estos estudios.",
        path: ["end"],
      })
    } else if (
      educationStudy.end &&
      isDateOutOfAllowedRange(
        educationStudy.end,
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
      educationStudy.start &&
      educationStudy.end &&
      isStartDateAfterEndDate(educationStudy.start, educationStudy.end)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "La fecha de inicio no puede ser posterior a la fecha de fin.",
        path: ["start"],
      })
    }
  })

const educationLanguageEntrySchema = z
  .object({
    id: z.string().trim().optional(),
    code: z
      .string()
      .trim()
      .max(
        educationLanguageCodeLength,
        `El codigo ISO no puede superar ${educationLanguageCodeLength} caracteres.`
      ),
    name: z
      .string()
      .trim()
      .max(
        educationLanguageNameMaxLength,
        `El idioma no puede superar ${educationLanguageNameMaxLength} caracteres.`
      ),
    level: z
      .string()
      .trim()
      .refine(
        (value) =>
          educationLanguageLevels.includes(
            value as (typeof educationLanguageLevels)[number]
          ),
        "Selecciona un nivel valido."
      ),
    media: z.array(multimediaSchema),
  })
  .superRefine(async (educationLanguage, context) => {
    if (!educationLanguage.name) {
      context.addIssue({
        code: "custom",
        message: "Selecciona un idioma.",
        path: ["name"],
      })
      return
    }

    if (!educationLanguage.code) {
      context.addIssue({
        code: "custom",
        message: "Selecciona un idioma valido de la lista.",
        path: ["name"],
      })
      return
    }

    const isValidLanguage = await validateLanguage(
      educationLanguage.name,
      educationLanguage.code
    )

    if (!isValidLanguage) {
      context.addIssue({
        code: "custom",
        message: "Selecciona un idioma valido de la lista.",
        path: ["name"],
      })
    }
  })

const educationCourseEntrySchema = z
  .object({
    id: z.string().trim().optional(),
    title: z
      .string()
      .trim()
      .min(1, "Introduce el nombre del curso o certificado.")
      .max(
        eduactionCoursesAndCerfificationsTitleMaxLength,
        `El nombre no puede superar ${eduactionCoursesAndCerfificationsTitleMaxLength} caracteres.`
      ),
    institution: z
      .string()
      .trim()
      .max(
        eduactionCoursesAndCerfificationsInstitutionMaxLength,
        `El centro no puede superar ${eduactionCoursesAndCerfificationsInstitutionMaxLength} caracteres.`
      ),
    location: z
      .string()
      .trim()
      .max(
        eduactionCoursesAndCerfificationsLocationMaxLength,
        `La localizacion no puede superar ${eduactionCoursesAndCerfificationsLocationMaxLength} caracteres.`
      ),
    isRemote: z.boolean(),
    start: z.string().trim(),
    end: z.string().trim(),
    isCurrent: z.boolean(),
    description: z
      .string()
      .trim()
      .max(
        eduactionCoursesAndCerfificationsDescriptionMaxLength,
        `La descripcion no puede superar ${eduactionCoursesAndCerfificationsDescriptionMaxLength} caracteres.`
      ),
    media: z.array(multimediaSchema),
  })
  .superRefine(async (course, context) => {
    if (!course.location && !course.isRemote) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una localizacion o marca Online.",
        path: ["location"],
      })
    }

    if (course.location && !course.isRemote) {
      const isValidLocation = await validateLocation(course.location)

      if (!isValidLocation) {
        context.addIssue({
          code: "custom",
          message: "Selecciona una localizacion valida de la lista.",
          path: ["location"],
        })
      }
    }

    if (!course.start) {
      context.addIssue({
        code: "custom",
        message: "Selecciona una fecha de inicio.",
        path: ["start"],
      })
    } else if (
      isDateOutOfAllowedRange(
        course.start,
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

    if (!course.end && !course.isCurrent) {
      context.addIssue({
        code: "custom",
        message:
          "Selecciona una fecha de fin o marca que actualmente cursas este curso o certificado.",
        path: ["end"],
      })
    } else if (
      course.end &&
      isDateOutOfAllowedRange(
        course.end,
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
      course.start &&
      course.end &&
      isStartDateAfterEndDate(course.start, course.end)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "La fecha de inicio no puede ser posterior a la fecha de fin.",
        path: ["start"],
      })
    }
  })

export const educationSectionSchema = z.object({
  studies: z.array(educationStudyEntrySchema),
  languages: z.array(educationLanguageEntrySchema),
  coursesAndCerfifications: z.array(educationCourseEntrySchema),
})

export type EducationSectionFormValues = z.infer<typeof educationSectionSchema>
