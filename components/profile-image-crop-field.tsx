"use client"

import "react-image-crop/dist/ReactCrop.css"

import {
  ImagePlus,
  Pencil,
  Scissors,
  Trash2,
  Upload,
} from "lucide-react"
import { useId, useRef, useState } from "react"
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { bytes } from "@/lib/utils/general/bytes"
import { cn } from "@/lib/utils"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]
const MAX_IMAGE_SIZE = bytes.MB(2)

type ProfileImageValue = {
  dataUrl: string
  name: string
  mimeType: string
  size: number
}

type ProfileImageCropFieldProps = {
  valueDataUrl: string
  invalid?: boolean
  onBlur?: () => void
  onChange: (value: ProfileImageValue) => void
}

function getCenteredAspectCrop(width: number, height: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 72 }, 3 / 4, width, height),
    width,
    height
  )
}

function toPixelCrop(crop: Crop, width: number, height: number): PixelCrop {
  if (crop.unit === "%") {
    return {
      unit: "px",
      x: Math.round((crop.x / 100) * width),
      y: Math.round((crop.y / 100) * height),
      width: Math.round((crop.width / 100) * width),
      height: Math.round((crop.height / 100) * height),
    }
  }

  return {
    unit: "px",
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."))
    reader.readAsDataURL(file)
  })
}

export function ProfileImageCropField({
  valueDataUrl,
  invalid,
  onBlur,
  onChange,
}: ProfileImageCropFieldProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [sourceImageUrl, setSourceImageUrl] = useState("")
  const [sourceFileName, setSourceFileName] = useState("")
  const [sourceFileMimeType, setSourceFileMimeType] = useState("")
  const [sourceFileSize, setSourceFileSize] = useState(0)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [localError, setLocalError] = useState("")

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  async function loadFile(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setLocalError("Solo se aceptan imagenes PNG o JPG.")
      onChange({ dataUrl: "", name: "", mimeType: "", size: 0 })
      onBlur?.()
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setLocalError("La imagen no puede superar los 2 MB.")
      onChange({ dataUrl: "", name: "", mimeType: "", size: 0 })
      onBlur?.()
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)

      setSourceImageUrl(dataUrl)
      setSourceFileName(file.name)
      setSourceFileMimeType(file.type)
      setSourceFileSize(file.size)
      setCrop(undefined)
      setCompletedCrop(undefined)
      setLocalError("")
      onChange({
        dataUrl,
        name: file.name,
        mimeType: file.type,
        size: file.size,
      })
      onBlur?.()
    } catch {
      setLocalError("No se pudo leer la imagen seleccionada.")
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]

    if (nextFile) {
      void loadFile(nextFile)
    }

    event.target.value = ""
  }

  function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget
    const nextCrop = getCenteredAspectCrop(width, height)

    setCrop(nextCrop)
    setCompletedCrop(toPixelCrop(nextCrop, width, height))
  }

  function handleApplyCrop() {
    if (!completedCrop || !imageRef.current) {
      setLocalError("Ajusta el recorte antes de guardar los cambios.")
      return
    }

    const outputCanvas = document.createElement("canvas")
    const ctx = outputCanvas.getContext("2d")

    if (!ctx) {
      setLocalError("No se pudo preparar el recorte.")
      return
    }

    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height
    const cropWidth = completedCrop.width * scaleX
    const cropHeight = completedCrop.height * scaleY

    outputCanvas.width = Math.floor(cropWidth)
    outputCanvas.height = Math.floor(cropHeight)
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    )

    const nextDataUrl =
      sourceFileMimeType === "image/png"
        ? outputCanvas.toDataURL("image/png")
        : outputCanvas.toDataURL("image/jpeg", 0.92)

    setLocalError("")
    setIsEditorOpen(false)
    onChange({
      dataUrl: nextDataUrl,
      name: sourceFileName,
      mimeType: sourceFileMimeType,
      size: sourceFileSize,
    })
    onBlur?.()
  }

  function handleRemoveImage() {
    setSourceImageUrl("")
    setSourceFileName("")
    setSourceFileMimeType("")
    setSourceFileSize(0)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setIsEditorOpen(false)
    setLocalError("")
    onChange({ dataUrl: "", name: "", mimeType: "", size: 0 })
    onBlur?.()
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragActive(false)

    const nextFile = event.dataTransfer.files?.[0]

    if (nextFile) {
      void loadFile(nextFile)
    }
  }

  const hasImage = Boolean(valueDataUrl)

  return (
    <div className="space-y-4">
      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="sr-only"
        onChange={handleFileChange}
      />

      {!hasImage ? (
        <button
          type="button"
          onClick={openFilePicker}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragActive(true)
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-56 w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center transition",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/8",
            invalid && "border-destructive/50 bg-destructive/5"
          )}
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Upload className="size-6" />
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-foreground">Arrastra tu imagen o pulsa para subirla</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Solo PNG o JPG, con un maximo de 2 MB.
            </p>
          </div>
        </button>
      ) : (
        <div
          className={cn(
            "space-y-4 rounded-3xl border border-border/80 bg-muted/15 p-4",
            invalid && "border-destructive/50 bg-destructive/5"
          )}
        >
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="group block w-full max-w-[14rem] overflow-hidden rounded-[1.75rem] border border-border/80 bg-background text-left shadow-sm transition hover:border-primary/40"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={valueDataUrl}
                  alt="Vista previa de la imagen de perfil"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 to-transparent px-4 py-3 text-white">
                  <p className="text-sm font-medium">Pulsa para reescalar</p>
                  <Scissors className="size-4" />
                </div>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditorOpen(true)}>
              <Pencil className="size-4" />
              Reescalar
            </Button>
            <Button type="button" variant="ghost" onClick={handleRemoveImage}>
              <Trash2 className="size-4" />
              Eliminar
            </Button>
            <Button type="button" variant="ghost" onClick={openFilePicker}>
              <ImagePlus className="size-4" />
              Cambiar imagen
            </Button>
          </div>
        </div>
      )}

      {localError ? <p className="text-sm text-destructive">{localError}</p> : null}

      <AlertDialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <AlertDialogContent className="w-[min(100%-5rem,32rem)] max-h-[calc(100svh-5rem)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Reescala tu imagen</AlertDialogTitle>
            <AlertDialogDescription>
              Ajusta el encuadre dentro de una proporcion vertical 3:4 para controlar la vista previa del
              perfil.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {sourceImageUrl ? (
            <div className="flex justify-center">
              <div className="mx-auto overflow-hidden rounded-2xl border border-border/70 bg-transparent">
                <ReactCrop
                  crop={crop}
                  onChange={(nextCrop) => setCrop(nextCrop)}
                  onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                  aspect={3 / 4}
                  keepSelection
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imageRef}
                    src={sourceImageUrl}
                    alt="Editor de imagen de perfil"
                    className="block max-h-[26rem] w-auto max-w-full"
                    onLoad={handleImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>
          ) : null}

          <AlertDialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cerrar
            </Button>
            <Button type="button" onClick={handleApplyCrop}>
              Guardar encuadre
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
