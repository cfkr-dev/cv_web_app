"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
  BriefcaseBusiness,
  FileText,
  Save,
  Trash2,
} from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle } from "react"
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
import { MunicipalityComboboxWithCheckboxField } from "components/form/municipality-combobox-with-checkbox-field"
import { TextInputField } from "components/form/text-input-field"
import { TextareaField } from "components/form/textarea-field"
import { Button } from "components/ui/button"
import { getLocation } from "lib/services/search/location"
import {
  createDefaultWorkExperienceFormValues,
} from "../validation/config/defaults"
import {
  WorkExperienceSectionFormValues,
  workExperienceSectionSchema,
} from "@/features/profile/edit/validation/schemas/work-experience"
import { useConfirmableFormSave } from "@/hooks/use-confirmable-form-save"
import { fakeRequest } from "@/lib/services/mock/fake-request"
import { useValidatedPrependFieldArray } from "@/hooks/use-validated-prepend-field-array"
import {
  workExperienceCompanyMaxLength,
  workExperienceDescriptionMaxLength,
  workExperienceSectionFormId,
  workExperienceTitleMaxLength,
} from "@/features/profile/edit/validation/config/constants"
import {
  submitSectionSilently,
  validateSectionSilently,
} from "@/features/profile/edit/validation/helpers/section-submit"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"
import { MultimediaEditorList } from "@/features/multimedia/edit/components/multimedia"
import { createDefaultMultimediaFormValues } from "@/features/multimedia/edit/validation/config/defaults"

type WorkExperienceProps = {
  initialData?: WorkExperienceSectionFormValues | null
}

export const WorkExperience = forwardRef<SectionSubmitHandle, WorkExperienceProps>(function WorkExperience(
  { initialData = null },
  ref
) {
  const form = useForm<WorkExperienceSectionFormValues>({
    resolver: zodResolver(workExperienceSectionSchema),
    defaultValues: {
      experiences: [createDefaultWorkExperienceFormValues()],
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
  useEffect(() => {
    if (!initialData) {
      return
    }

    reset(initialData)
  }, [initialData, reset])
  const {
    fields: experienceFields,
    remove: removeExperience,
    handleAddItem: handleAddWorkExperienceItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "experiences",
    createItem: createDefaultWorkExperienceFormValues,
    validationErrorToast: {
      title: "No se puede anadir otra experiencia",
      description:
        "Rellena correctamente el formulario ya creado para añadir otra experiencia",
    },
  })

  return (
    <>
      <form
        id={workExperienceSectionFormId}
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <CollapsibleDeletableItemList
          addLabel="Anadir experiencia"
          onAdd={() => void handleAddWorkExperienceItem()}
          className="space-y-5"
          listClassName="space-y-5"
        >
          {experienceFields.map((field, index) => (
            <WorkExperienceItem
              key={field.id}
              form={form}
              index={index}
              onDelete={() => removeExperience(index)}
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

function WorkExperienceItem({
  form,
  index,
  onDelete,
  onSetValue,
}: {
  form: UseFormReturn<WorkExperienceSectionFormValues>
  index: number
  onDelete: () => void
  onSetValue: UseFormReturn<WorkExperienceSectionFormValues>["setValue"]
}) {
  const { control } = form
  const prefix = `experience-${index + 1}`
  const description =
    useWatch({
      control,
      name: `experiences.${index}.description`,
    }) ?? ""
  const isRemote =
    useWatch({
      control,
      name: `experiences.${index}.isRemote`,
    }) ?? false
  const isCurrent =
    useWatch({
      control,
      name: `experiences.${index}.isCurrent`,
    }) ?? false

  return (
    <CollapsibleDeletableItem
      title={`Experiencia ${index + 1}`}
      collapsible
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar experiencia ${index + 1}`}
              aria-label={`Eliminar experiencia ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar experiencia"
          description="Estas seguro de eliminar esta experiencia laboral? Esta accion sera irreversible."
          actionLabel="Eliminar experiencia"
          loadingLabel="Eliminando"
          successTitle="Experiencia eliminada"
          successDescription="La experiencia se ha eliminado correctamente."
          errorTitle="No se pudo eliminar la experiencia"
          errorDescription="No se ha podido eliminar la experiencia. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name={`experiences.${index}.title`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-title`}
              name={field.name}
              label="Puesto"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del puesto"
              icon={<BriefcaseBusiness className="size-4" />}
              maxLength={workExperienceTitleMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`experiences.${index}.company`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-company`}
              name={field.name}
              label="Empresa"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre de la empresa"
              icon={<Building2 className="size-4" />}
              maxLength={workExperienceCompanyMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`experiences.${index}.location`}
          control={control}
          render={({ field, fieldState }) => (
            <MunicipalityComboboxWithCheckboxField
              id={`${prefix}-location`}
              label="Localizacion"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isRemote}
              onCheckedChange={(checked) =>
                onSetValue(`experiences.${index}.isRemote`, checked, {
                  shouldValidate: true,
                })
              }
              placeholder="Ciudad o modalidad"
              checkedPlaceholder="En remoto"
              checkboxLabel="En remoto"
              checkboxId={`${prefix}-remote`}
              className="self-start sm:col-span-2"
              invalid={fieldState.invalid}
              error={fieldState.error}
              searchItems={getLocation}
              getItemKey={(item) => item.id}
              getItemLabel={(item) => item.name}
              getItemValue={(item) => item.label}
              getItemDescription={(item) => item.description}
            />
          )}
        />

        <Controller
          name={`experiences.${index}.start`}
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
          name={`experiences.${index}.end`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerWithCheckboxField
              id={`${prefix}-end-date`}
              label="Fecha fin"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isCurrent}
              onCheckedChange={(checked) =>
                onSetValue(`experiences.${index}.isCurrent`, checked, {
                  shouldValidate: true,
                })
              }
              placeholder="Selecciona mes y ano"
              checkedLabel="Actualmente trabajo aqui"
              checkboxId={`${prefix}-current`}
              className="self-start"
              disabledLabel="Actualmente trabajo aqui"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`experiences.${index}.description`}
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
              placeholder="Describe responsabilidades, logros o tecnologias utilizadas"
              className="sm:col-span-2"
              icon={<FileText className="size-4" />}
              maxLength={workExperienceDescriptionMaxLength}
              rows={5}
              autoResize
              maxAutoResizeHeightPx={416}
              characterCountLabel={`${description.length}/${workExperienceDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <MultimediaEditorList
        form={form}
        itemsName={`experiences.${index}.media`}
        itemIdPrefix={`experience-${index + 1}-media`}
        createItemAction={createDefaultMultimediaFormValues}
        className="mt-5 border-t border-border/70 pt-5"
      />
    </CollapsibleDeletableItem>
  )
}
