"use client"

import {
  FileText,
  Globe,
  SquarePen,
  Trash2,
  Upload,
} from "lucide-react"
import {
  Controller,
  useWatch,
  type FieldValues,
  type Path,
} from "react-hook-form"

import { AsyncActionDialog } from "components/dialog/async-action-dialog"
import {
  CollapsibleDeletableItem,
  CollapsibleDeletableItemList,
} from "components/collapsible-deletable-item-list"
import { FileUploadField } from "components/form/file-upload-field"
import { SwitchField } from "components/form/switch-field"
import { TextInputField } from "components/form/text-input-field"
import { TextareaField } from "components/form/textarea-field"
import { Button } from "components/ui/button"
import { UrlNavigationButton } from "components/url-navigation-button"
import { useValidatedPrependFieldArray } from "hooks/use-validated-prepend-field-array"
import { useRemoteFileDownload } from "@/hooks/use-remote-file-download"
import { fakeRequest } from "lib/services/mock/fake-request"
import { getNavigableUrl } from "@/lib/utils/general/url"
import type {
  MultimediaEditorItemProps,
  MultimediaEditorListProps,
} from "../types/multimedia"
import { RemoteFilePreview } from "./remote-file-preview"
import {
  multimediaDescriptionMaxLength,
  multimediaTitleMaxLength,
  multimediaUrlMaxLength,
} from "features/multimedia/edit/validation/config/constants"
import {
  allowedImageExtensions,
  allowedPdfExtensions,
  allowedPresentationExtensions
} from "lib/config/file"

export function MultimediaEditorList<TFieldValues extends FieldValues>({
  form,
  itemsName,
  itemIdPrefix,
  createItemAction,
  className,
}: MultimediaEditorListProps<TFieldValues>) {
  const {
    fields,
    remove,
    handleAddItem: handleAddMultimediaItem,
  } = useValidatedPrependFieldArray({
    form,
    name: itemsName,
    createItem: createItemAction,
    validationErrorToast: {
      title: "No se puede anadir otro recurso",
      description:
        "Corrige los errores de la galeria multimedia antes de continuar.",
    },
  })

  return (
    <CollapsibleDeletableItemList
      title="Galeria multimedia"
      description="Archivos asociados a este bloque del curriculum."
      addLabel="Anadir elemento multimedia"
      onAdd={() => void handleAddMultimediaItem()}
      className={className}
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <MultimediaEditorItem
            key={field.id}
            form={form}
            itemName={`${itemsName}.${index}` as Path<TFieldValues>}
            itemIdPrefix={`${itemIdPrefix}-${index + 1}`}
            itemIndex={index}
            onDelete={() => remove(index)}
          />
        ))}
      </div>
    </CollapsibleDeletableItemList>
  )
}

function MultimediaEditorItem<TFieldValues extends FieldValues>({
  form,
  itemName,
  itemIdPrefix,
  itemIndex,
  onDelete,
}: MultimediaEditorItemProps<TFieldValues>) {
  const { control, setValue } = form
  const { downloadFile, downloadingFileId } = useRemoteFileDownload()
  const mediaDescription =
    useWatch({
      control,
      name: `${itemName}.description` as Path<TFieldValues>,
    }) ?? ""
  const isLink =
    useWatch({
      control,
      name: `${itemName}.isLink` as Path<TFieldValues>,
    }) ?? false
  const mediaUrl =
    useWatch({
      control,
      name: `${itemName}.url` as Path<TFieldValues>,
    }) ?? ""
  const mediaId =
    useWatch({
      control,
      name: `${itemName}.id` as Path<TFieldValues>,
    }) ?? ""
  const isLocalFile =
    useWatch({
      control,
      name: `${itemName}.isLocalFile` as Path<TFieldValues>,
    }) ?? true
  const fileName =
    useWatch({
      control,
      name: `${itemName}.fileName` as Path<TFieldValues>,
    }) ?? ""
  const fileSize =
    useWatch({
      control,
      name: `${itemName}.fileSize` as Path<TFieldValues>,
    }) ?? null
  const allowedFileExtensions = [...(new Set([...allowedImageExtensions, ...allowedPdfExtensions, ...allowedPresentationExtensions]))].toString()

  return (
    <CollapsibleDeletableItem
      title={`Multimedia ${itemIndex + 1}`}
      collapsible
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar multimedia ${itemIndex + 1}`}
              aria-label={`Eliminar multimedia ${itemIndex + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar elemento multimedia"
          description="Estas seguro de eliminar este elemento multimedia? Esta accion sera irreversible."
          actionLabel="Eliminar elemento"
          loadingLabel="Eliminando"
          successTitle="Elemento multimedia eliminado"
          successDescription="El elemento multimedia se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el elemento multimedia"
          errorDescription="No se ha podido eliminar el elemento multimedia. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name={`${itemName}.title` as Path<TFieldValues>}
            control={control}
            render={({ field, fieldState }) => (
              <TextInputField
                id={`${itemIdPrefix}-title`}
                name={field.name}
                label="Titulo"
                value={(field.value as string | undefined) ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                placeholder="Nombre del recurso multimedia"
                icon={<SquarePen className="size-4" />}
                maxLength={multimediaTitleMaxLength}
                invalid={fieldState.invalid}
                error={fieldState.error}
              />
            )}
          />

          <SwitchField
            id={`${itemIdPrefix}-link-mode`}
            label="Enlace o archivo"
            checked={Boolean(isLink)}
            onCheckedChange={(checked) => {
              setValue(
                `${itemName}.isLink` as Path<TFieldValues>,
                checked as never
              )

              if (checked) {
                setValue(
                  `${itemName}.file` as Path<TFieldValues>,
                  null as never,
                  {
                    shouldValidate: true,
                  }
                )
                return
              }

              if (!isLocalFile) {
                setValue(
                  `${itemName}.isLocalFile` as Path<TFieldValues>,
                  true as never,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
                setValue(
                  `${itemName}.fileName` as Path<TFieldValues>,
                  "" as never,
                  {
                    shouldDirty: true,
                  }
                )
                setValue(
                  `${itemName}.fileSize` as Path<TFieldValues>,
                  null as never,
                  {
                    shouldDirty: true,
                  }
                )
              }
            }}
            uncheckedIcon={<Upload className="size-4" />}
            checkedIcon={<Globe className="size-4" />}
            offText="Archivo"
            onText="Enlace"
          />

          <Controller
            name={`${itemName}.description` as Path<TFieldValues>}
            control={control}
            render={({ field, fieldState }) => (
              <TextareaField
                id={`${itemIdPrefix}-description`}
                name={field.name}
                label="Descripcion"
                value={(field.value as string | undefined) ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                textareaRef={field.ref}
                placeholder="Describe brevemente el contenido del recurso"
                className="sm:col-span-2"
                icon={<FileText className="size-4" />}
                maxLength={multimediaDescriptionMaxLength}
                rows={4}
                autoResize
                maxAutoResizeHeightPx={320}
                characterCountLabel={`${String(mediaDescription).length}/${multimediaDescriptionMaxLength} caracteres`}
                invalid={fieldState.invalid}
                error={fieldState.error}
              />
            )}
          />

          {isLink ? (
            <Controller
              name={`${itemName}.url` as Path<TFieldValues>}
              control={control}
              render={({ field, fieldState }) => (
                <TextInputField
                  id={`${itemIdPrefix}-url`}
                  name={field.name}
                  label="Enlace externo"
                  type="url"
                  value={(field.value as string | undefined) ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  placeholder="https://tu-enlace.com"
                  className="sm:col-span-2"
                  icon={<Globe className="size-4" />}
                  maxLength={multimediaUrlMaxLength}
                  invalid={fieldState.invalid}
                  error={fieldState.error}
                  trailingAction={
                    String(mediaUrl).trim() ? (
                      <UrlNavigationButton
                        value={String(mediaUrl)}
                        label="Abrir enlace externo"
                        getNavigableUrl={getNavigableUrl}
                      />
                    ) : null
                  }
                />
              )}
            />
          ) : isLocalFile ? (
            <Controller
              name={`${itemName}.file` as Path<TFieldValues>}
              control={control}
              render={({ field, fieldState }) => (
                <FileUploadField
                  id={`${itemIdPrefix}-file`}
                  label="Archivo"
                  file={(field.value as File | null | undefined) ?? null}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  accept={allowedFileExtensions}
                  className="sm:col-span-2"
                  invalid={fieldState.invalid}
                  error={fieldState.error}
                />
              )}
            />
          ) : (
            <div className="sm:col-span-2">
              <RemoteFilePreview
                fileId={typeof mediaId === "string" ? mediaId : undefined}
                fileName={String(fileName)}
                fileSize={typeof fileSize === "number" ? fileSize : null}
                isDownloading={
                  typeof mediaId === "string" && downloadingFileId === mediaId
                }
                onDownload={() => {
                  if (typeof mediaId !== "string" || !mediaId) {
                    return
                  }

                  void downloadFile(mediaId, String(fileName))
                }}
                onDelete={() => {
                  setValue(
                    `${itemName}.isLocalFile` as Path<TFieldValues>,
                    true as never,
                    { shouldDirty: true, shouldValidate: true }
                  )
                  setValue(
                    `${itemName}.file` as Path<TFieldValues>,
                    null as never,
                    { shouldDirty: true, shouldValidate: true }
                  )
                  setValue(
                    `${itemName}.fileName` as Path<TFieldValues>,
                    "" as never,
                    { shouldDirty: true }
                  )
                  setValue(
                    `${itemName}.fileSize` as Path<TFieldValues>,
                    null as never,
                    { shouldDirty: true }
                  )
                }}
              />
            </div>
          )}
        </div>
      </div>
    </CollapsibleDeletableItem>
  )
}
