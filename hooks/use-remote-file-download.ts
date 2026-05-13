"use client"

import { useCallback, useState } from "react"

import { useAppToast } from "@/hooks/use-app-toast"
import { downloadRemoteFile } from "@/lib/services/multimedia/download-remote-file"

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = fileName
  anchor.rel = "noopener noreferrer"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

export function useRemoteFileDownload() {
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null
  )
  const appToast = useAppToast()

  const downloadFile = useCallback(
    async (fileId: string, fileName: string) => {
      try {
        setDownloadingFileId(fileId)
        const { blob, fileName: resolvedFileName } = await downloadRemoteFile(
          fileId,
          fileName
        )
        triggerBrowserDownload(blob, resolvedFileName)
      } catch {
        appToast.error({
          title: "No se pudo descargar el archivo",
          description: "Intentalo de nuevo dentro de unos segundos.",
        })
      } finally {
        setDownloadingFileId((currentFileId) =>
          currentFileId === fileId ? null : currentFileId
        )
      }
    },
    [appToast]
  )

  return {
    downloadingFileId,
    downloadFile,
  }
}
