import { z } from "zod"
import {
  multimediaDescriptionMaxLength,
  multimediaTitleMaxLength,
  multimediaUrlMaxLength,
} from "../config/constants"
import { getFileExtension } from "lib/utils/general/file"
import { isBrowserFile } from "lib/utils/validation/file"
import { isValidOptionalHttpUrl } from "lib/utils/validation/url"
import {
  allowedImageExtensions,
  allowedPdfExtensions,
  allowedPresentationExtensions,
  imageMaxFileSize,
  imageMaxFileSizeBytes,
  pdfMaxFileSize,
  pdfMaxFileSizeBytes,
  presentationMaxFileSize,
  presentationMaxFileSizeBytes,
} from "@/lib/config/file"

export const multimediaSchema = z
  .object({
    id: z.string().trim().optional(),
    title: z
      .string()
      .trim()
      .min(1, "Introduce un titulo para el recurso multimedia.")
      .max(
        multimediaTitleMaxLength,
        `El titulo no puede superar ${multimediaTitleMaxLength} caracteres.`
    ),
    isLink: z.boolean(),
    isLocalFile: z.boolean(),
    url: z
      .string()
      .trim()
      .max(
        multimediaUrlMaxLength,
        `El enlace no puede superar ${multimediaUrlMaxLength} caracteres.`
      ),
    description: z
      .string()
      .trim()
      .max(
        multimediaDescriptionMaxLength,
        `La descripcion no puede superar ${multimediaDescriptionMaxLength} caracteres.`
      ),
    file: z.custom<File | null>(
      (value) => value === null || isBrowserFile(value),
      "Selecciona un archivo valido."
    ),
    fileName: z.string().trim(),
    fileSize: z.number().nullable(),
  })
  .superRefine((mediaItem, context) => {
    if (mediaItem.isLink) {
      if (!mediaItem.url.trim()) {
        context.addIssue({
          code: "custom",
          message: "Introduce un enlace para el recurso multimedia.",
          path: ["url"],
        })
      } else if (!isValidOptionalHttpUrl(mediaItem.url)) {
        context.addIssue({
          code: "custom",
          message: "Introduce un enlace valido.",
          path: ["url"],
        })
      }

      return
    }

    if (!mediaItem.isLocalFile) {
      return
    }

    if (!mediaItem.file) {
      context.addIssue({
        code: "custom",
        message: "Adjunta un archivo.",
        path: ["file"],
      })
      return
    }

    const extension = getFileExtension(mediaItem.file.name)

    if (allowedImageExtensions.has(extension)) {
      if (mediaItem.file.size > imageMaxFileSizeBytes) {
        context.addIssue({
          code: "custom",
          message: `Las imagenes no pueden superar ${imageMaxFileSize} MB.`,
          path: ["file"],
        })
      }
      return
    }

    if (allowedPdfExtensions.has(extension)) {
      if (mediaItem.file.size > pdfMaxFileSizeBytes) {
        context.addIssue({
          code: "custom",
          message: `Los archivos PDF no pueden superar ${pdfMaxFileSize} MB.`,
          path: ["file"],
        })
      }
      return
    }

    if (allowedPresentationExtensions.has(extension)) {
      if (mediaItem.file.size > presentationMaxFileSizeBytes) {
        context.addIssue({
          code: "custom",
          message: `Las presentaciones no pueden superar ${presentationMaxFileSize} MB.`,
          path: ["file"],
        })
      }
      return
    }

    context.addIssue({
      code: "custom",
      message: "Solo se permiten imagenes, archivos PDF o presentaciones.",
      path: ["file"],
    })
  })
