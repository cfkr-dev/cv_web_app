type DownloadRemoteFileResult = {
  blob: Blob
  fileName: string
}

function getFileNameFromDisposition(contentDisposition: string | null) {
  if (!contentDisposition) {
    return null
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i)
  return asciiMatch?.[1] ?? null
}

export async function downloadRemoteFile(_fileId: string, _fileName: string) {
  const response = await fetch(
    "https://res.cloudinary.com/demo/image/upload/fl_attachment/sample.jpg"
  )

  if (!response.ok) {
    throw new Error("No se pudo descargar el archivo.")
  }

  const blob = await response.blob()

  return {
    blob,
    fileName:
      getFileNameFromDisposition(response.headers.get("content-disposition")) ??
      "sample.jpg",
  } satisfies DownloadRemoteFileResult
}
