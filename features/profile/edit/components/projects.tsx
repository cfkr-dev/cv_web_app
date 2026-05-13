"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FilePlus2, FileText, Save, Trash2 } from "lucide-react"
import { forwardRef, useImperativeHandle } from "react"
import {
  Controller,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form"

import { AsyncActionDialog } from "components/dialog/async-action-dialog"
import {
  CollapsibleDeletableItem,
  CollapsibleDeletableItemList,
} from "components/collapsible-deletable-item-list"
import { MonthPickerField } from "components/form/month-picker-field"
import { MonthPickerWithCheckboxField } from "components/form/month-picker-with-checkbox-field"
import { TextInputField } from "components/form/text-input-field"
import { TextareaField } from "components/form/textarea-field"
import { Button } from "components/ui/button"
import { MultimediaEditorList } from "@/features/multimedia/edit/components/multimedia"
import { createDefaultMultimediaFormValues } from "@/features/multimedia/edit/validation/config/defaults"
import {
  createDefaultProjectFormValues,
} from "@/features/profile/edit/validation/config/defaults"
import {
  projectsItemDescriptionMaxLength,
  projectsItemNameMaxLength,
  projectsSectionFormId,
} from "@/features/profile/edit/validation/config/constants"
import {
  ProjectsSectionFormValues,
  projectsSectionSchema,
} from "@/features/profile/edit/validation/schemas/projects"
import { useConfirmableFormSave } from "@/hooks/use-confirmable-form-save"
import { useValidatedPrependFieldArray } from "@/hooks/use-validated-prepend-field-array"
import { fakeRequest } from "@/lib/services/mock/fake-request"
import {
  submitSectionSilently,
  validateSectionSilently,
} from "@/features/profile/edit/validation/helpers/section-submit"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"

export const Projects = forwardRef<SectionSubmitHandle>(function Projects(_, ref) {
  const form = useForm<ProjectsSectionFormValues>({
    resolver: zodResolver(projectsSectionSchema),
    defaultValues: {
      projects: [createDefaultProjectFormValues()],
    },
  })
  const { getValues, handleSubmit, reset, setValue, trigger } = form
  const {
    dialogOpen,
    handleDialogOpenChange,
    handleValidSubmit,
    runImmediateSubmit,
    runConfirmAction,
  } = useConfirmableFormSave({
    getValues,
    reset,
    onConfirmAction: fakeRequest,
  })
  useImperativeHandle(ref, () => ({
    validateSilently: () =>
      validateSectionSilently({
        trigger,
      }),
    submitSilently: () =>
      submitSectionSilently({
        trigger,
        runImmediateSubmit,
      }),
  }))
  const {
    fields: projectFields,
    remove: removeProject,
    handleAddItem: handleAddProjectItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "projects",
    createItem: createDefaultProjectFormValues,
    validationErrorToast: {
      title: "No se puede anadir otro proyecto",
      description:
        "Rellena correctamente el formulario ya creado para anadir otro proyecto.",
    },
  })

  return (
    <>
      <form
        id={projectsSectionFormId}
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <CollapsibleDeletableItemList
          addLabel="Anadir proyecto"
          onAdd={() => void handleAddProjectItem()}
          className="space-y-5"
          listClassName="space-y-5"
        >
          {projectFields.map((field, index) => (
            <ProjectItem
              key={field.id}
              form={form}
              index={index}
              onDelete={() => removeProject(index)}
              onSetValue={setValue}
            />
          ))}
        </CollapsibleDeletableItemList>
      </form>

      <AsyncActionDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        title="Guardar seccion"
        description="Deseas guardar estos datos?"
        actionLabel="Guardar"
        loadingLabel="Guardando"
        successTitle="Seccion guardada"
        successDescription="Los datos de esta seccion se han guardado correctamente."
        errorTitle="No se pudo guardar la seccion"
        errorDescription="No se han podido guardar los datos de esta seccion. Intentalo de nuevo."
        actionIcon={<Save className="size-4" />}
        onAction={runConfirmAction}
      />
    </>
  )
})

function ProjectItem({
  form,
  index,
  onDelete,
  onSetValue,
}: {
  form: UseFormReturn<ProjectsSectionFormValues>
  index: number
  onDelete: () => void
  onSetValue: UseFormReturn<ProjectsSectionFormValues>["setValue"]
}) {
  const { control } = form
  const prefix = `project-${index + 1}`
  const description =
    useWatch({
      control,
      name: `projects.${index}.description`,
    }) ?? ""
  const isCurrent =
    useWatch({
      control,
      name: `projects.${index}.isCurrent`,
    }) ?? false

  return (
    <CollapsibleDeletableItem
      title={`Proyecto ${index + 1}`}
      collapsible
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar proyecto ${index + 1}`}
              aria-label={`Eliminar proyecto ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar proyecto"
          description="Estas seguro de eliminar este proyecto personal? Esta accion sera irreversible."
          actionLabel="Eliminar proyecto"
          loadingLabel="Eliminando"
          successTitle="Proyecto eliminado"
          successDescription="El proyecto se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el proyecto"
          errorDescription="No se ha podido eliminar el proyecto. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name={`projects.${index}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-name`}
              name={field.name}
              label="Nombre"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del proyecto"
              className="sm:col-span-2"
              icon={<FilePlus2 className="size-4" />}
              maxLength={projectsItemNameMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`projects.${index}.start`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerField
              id={`${prefix}-start-date`}
              label="Fecha inicio"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Selecciona mes y ano"
              className="self-start"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`projects.${index}.end`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerWithCheckboxField
              id={`${prefix}-end-date`}
              label="Fecha fin"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isCurrent}
              onCheckedChange={(checked) =>
                onSetValue(`projects.${index}.isCurrent`, checked, {
                  shouldValidate: true,
                })
              }
              placeholder="Selecciona mes y ano"
              checkedLabel="Proyecto activo"
              checkboxId={`${prefix}-current`}
              className="self-start"
              disabledLabel="Proyecto activo"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`projects.${index}.description`}
          control={control}
          render={({ field, fieldState }) => (
            <TextareaField
              id={`${prefix}-description`}
              name={field.name}
              label="Descripcion"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              textareaRef={field.ref}
              placeholder="Describe el alcance, resultado o tecnologias utilizadas"
              className="sm:col-span-2"
              icon={<FileText className="size-4" />}
              maxLength={projectsItemDescriptionMaxLength}
              rows={4}
              autoResize
              maxAutoResizeHeightPx={320}
              characterCountLabel={`${description.length}/${projectsItemDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <MultimediaEditorList
        form={form}
        itemsName={`projects.${index}.media`}
        itemIdPrefix={`project-${index + 1}-media`}
        createItemAction={createDefaultMultimediaFormValues}
        className="mt-5 border-t border-border/70 pt-5"
      />
    </CollapsibleDeletableItem>
  )
}
