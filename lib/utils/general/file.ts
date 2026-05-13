import path from "node:path"
import { bytes } from "@/lib/utils/general/bytes"

export function getFileExtension(fileName: string) {
  return path.extname(fileName).toLowerCase()
}

export function formatFileSize(size: number | null) {
  if (size === null) {
    return ""
  }

  if (size < bytes.MB(1)) {
    return `${Math.round(size / bytes.KB(1))} KB`
  }

  return `${(size / bytes.MB(1)).toFixed(1)} MB`
}
