"use client"

import type { FieldError as HookFormFieldError } from "react-hook-form"
import { FileChartPie, FileImage, FileText, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload"
import {
  imageMaxFileSize,
  pdfMaxFileSize,
  presentationMaxFileSize,
} from "@/lib/config/file"
import { formatFileSize } from "@/lib/utils/general/file"
import { cn } from "@/lib/utils"

type FileUploadFieldProps = {
  id: string
  label: string
  file: File | null
  onChange: (file: File | null) => void
  inputRef?: (instance: HTMLInputElement | null) => void
  accept?: string
  className?: string
  invalid?: boolean
  error?: HookFormFieldError
}

function getPreviewIcon(file: File) {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`

  if (file.type.startsWith("image/")) {
    return <FileImage className="size-6 text-muted-foreground" />
  }

  if (extension === ".ppt" || extension === ".pptx") {
    return <FileChartPie className="size-6 text-muted-foreground" />
  }

  return <FileText className="size-6 text-muted-foreground" />
}

export function FileUploadField({
  id,
  label,
  file,
  onChange,
  inputRef,
  accept,
  className,
  invalid = false,
  error,
}: FileUploadFieldProps) {
  const files = file ? [file] : []
  const hasFile = files.length > 0
  const helperText = `Imagen, PDF o presentacion. Hasta ${imageMaxFileSize} MB en imagenes, ${pdfMaxFileSize} MB en PDF y ${presentationMaxFileSize} MB en presentaciones.`

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FileUpload
        value={files}
        onValueChange={(nextFiles) => onChange(nextFiles[0] ?? null)}
        inputId={id}
        inputRef={inputRef}
        accept={accept}
        maxFiles={1}
        disabled={hasFile}
        className="gap-3"
        invalid={invalid}
      >
        <FileUploadDropzone
          aria-invalid={invalid}
          className={cn(
            "min-h-40 rounded-xl bg-background/78 px-6 py-5 hover:bg-primary/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 data-[disabled]:hover:bg-background/78",
            invalid &&
              "bg-destructive/5 hover:bg-destructive/5"
          )}
          style={{
            borderWidth: "2px",
            borderStyle: "dashed",
            borderColor: invalid
              ? "rgba(220, 38, 38, 0.28)"
              : "rgba(100, 116, 139, 0.32)",
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={cn(
                "rounded-2xl bg-muted p-4",
                invalid && "bg-destructive/10"
              )}
            >
              <Upload
                className={cn(
                  "size-9 text-muted-foreground",
                  invalid && "text-destructive"
                )}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Subir archivo
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasFile
                  ? "Elimina el archivo actual para subir otro"
                  : "Arrastra el archivo aqui o haz clic para seleccionarlo"}
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                {file
                  ? `${file.name} - ${formatFileSize(file.size)}`
                  : helperText}
              </p>
            </div>
          </div>
        </FileUploadDropzone>

        <FileUploadList>
          {files.map((selectedFile) => (
            <FileUploadItem
              key={`${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}`}
              value={selectedFile}
              className="rounded-xl"
            >
              <FileUploadItemPreview
                className="size-11 rounded-lg [&>svg]:size-6"
                render={() => getPreviewIcon(selectedFile)}
              />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label={`Eliminar archivo ${selectedFile.name}`}
                  title={`Eliminar archivo ${selectedFile.name}`}
                >
                  <X className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
      {invalid ? (
        <FieldError className="w-full text-center" errors={[error]} />
      ) : null}
    </Field>
  )
}
