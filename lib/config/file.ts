// IMAGES
import { bytes } from "@/lib/utils/general/bytes"

export const imageMaxFileSize = 2
export const imageMaxFileSizeBytes = bytes.MB(imageMaxFileSize)
export const allowedImageExtensions = new Set([
  ".pjp",
  ".jpe",
  ".jpeg",
  ".jpg",
  ".pjpeg",
  ".jfif",
  ".png",
  ".gif",
])

// DOCUMENTS (PDF)
export const pdfMaxFileSize = 15
export const pdfMaxFileSizeBytes = bytes.MB(pdfMaxFileSize)
export const allowedPdfExtensions = new Set([
  ".pdf"
])

// SLIDES (PPT | PPTX)
export const presentationMaxFileSize = 25
export const presentationMaxFileSizeBytes = bytes.MB(presentationMaxFileSize)
export const allowedPresentationExtensions = new Set([
  ".ppt", ".pptx"
])