"use client"

import {
  Download,
  FileChartPie,
  FileImage,
  FileText,
  LoaderCircle,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  allowedImageExtensions,
  allowedPresentationExtensions,
} from "@/lib/config/file"
import { formatFileSize, getFileExtension } from "@/lib/utils/general/file"

type RemoteFilePreviewProps = {
  fileId?: string
  fileName: string
  fileSize: number | null
  isDownloading?: boolean
  onDownload: () => void
  onDelete: () => void
}

function getRemoteFileIcon(fileName: string) {
  const extension = getFileExtension(fileName)

  if (allowedImageExtensions.has(extension)) {
    return <FileImage className="size-5 text-muted-foreground" />
  }

  if (allowedPresentationExtensions.has(extension)) {
    return <FileChartPie className="size-5 text-muted-foreground" />
  }

  return <FileText className="size-5 text-muted-foreground" />
}

export function RemoteFilePreview({
  fileId,
  fileName,
  fileSize,
  isDownloading = false,
  onDownload,
  onDelete,
}: RemoteFilePreviewProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background px-4 py-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-accent/40">
        {getRemoteFileIcon(fileName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {fileName}
        </p>
        {fileSize !== null ? (
          <p className="text-xs text-muted-foreground">
            {formatFileSize(fileSize)}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        aria-label="Descargar archivo"
        title={fileId ? "Descargar archivo" : "Archivo sin identificador"}
        disabled={!fileId || isDownloading}
        onClick={onDownload}
      >
        {isDownloading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        aria-label={`Eliminar archivo ${fileName}`}
        title={`Eliminar archivo ${fileName}`}
        onClick={onDelete}
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
