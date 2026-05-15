"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  FileText,
  GraduationCap,
  Languages,
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

import { AsyncActionDialog } from "@/components/dialog/async-action-dialog"
import {
  CollapsibleDeletableItem,
  CollapsibleDeletableItemList,
} from "@/components/collapsible-deletable-item-list"
import { LanguageComboboxField } from "@/components/form/language-combobox-field"
import { MonthPickerField } from "@/components/form/month-picker-field"
import { MonthPickerWithCheckboxField } from "@/components/form/month-picker-with-checkbox-field"
import { MunicipalityComboboxWithCheckboxField } from "@/components/form/municipality-combobox-with-checkbox-field"
import { SelectField } from "@/components/form/select-field"
import { TextInputField } from "@/components/form/text-input-field"
import { TextareaField } from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { educationLanguageLevels } from "@/features/profile/edit/config/education-languages-defaults"
import {
  createDefaultEducationLanguageFormValues,
  createDefaultEducationSectionFormValues,
  createDefaultEducationStudiesFormValues,
  createDefaultEduactionCoursesAndCerfificationsFormValues,
} from "@/features/profile/edit/validation/config/defaults"
import {
  eduactionCoursesAndCerfificationsDescriptionMaxLength,
  eduactionCoursesAndCerfificationsInstitutionMaxLength,
  eduactionCoursesAndCerfificationsTitleMaxLength,
  educationSectionFormId,
  educationStudiesDescriptionMaxLength,
  educationStudiesInstitutionMaxLength,
  educationStudiesTitleMaxLength,
  profileSectionSaveDialogTexts,
} from "@/features/profile/edit/validation/config/constants"
import {
  submitSection,
  validateSection,
} from "@/features/profile/edit/validation/helpers/section-submit"
import {
  type EducationSectionFormValues,
  educationSectionSchema,
} from "@/features/profile/edit/validation/schemas/education"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"
import { useFormCollapsibleState } from "@/hooks/use-form-collapsible-state"
import { MultimediaEditorList } from "@/features/multimedia/edit/components/multimedia"
import { createDefaultMultimediaFormValues } from "@/features/multimedia/edit/validation/config/defaults"
import { useValidatedPrependFieldArray } from "@/hooks/use-validated-prepend-field-array"
import { fakeRequest } from "@/lib/services/mock/fake-request"
import { getLanguage } from "@/lib/services/search/language"
import { getLocation } from "@/lib/services/search/location"
import { useProfileSectionSave } from "@/features/profile/edit/validation/hooks/use-profile-section-save"

type EducationProps = {
  initialData?: EducationSectionFormValues | null
}

export const Education = forwardRef<SectionSubmitHandle, EducationProps>(function Education(
  { initialData = null },
  ref
) {
  const form = useForm<EducationSectionFormValues>({
    resolver: zodResolver(educationSectionSchema),
    defaultValues: createDefaultEducationSectionFormValues(),
  })
  const { getValues, handleSubmit, reset, setValue } = form
  const {
    clearValidationStatePreservingValues,
    dialogOpen,
    handleDialogOpenChange,
    handleInvalidSubmit,
    openConfirmDialog,
    runConfirmAction,
  } = useProfileSectionSave({
    getValues,
    reset,
    onConfirmAction: fakeRequest,
  })

  useImperativeHandle(ref, () => ({
    clearValidationStatePreservingValues,
    validate: (options) =>
      validateSection({
        handleSubmit,
        formId: educationSectionFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
    submit: (options) =>
      submitSection({
        handleSubmit,
        onValidSubmit: runConfirmAction,
        formId: educationSectionFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
  }))
  useEffect(() => {
    if (!initialData) {
      return
    }

    reset(initialData)
  }, [initialData, reset])

  const {
    fields: studyFields,
    remove: removeStudy,
    handleAddItem: handleAddStudyItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "studies",
    createItem: createDefaultEducationStudiesFormValues,
    validationErrorToast: {
      title: "No se puede anadir otro estudio",
      description:
        "Rellena correctamente el formulario ya creado para anadir otro estudio.",
    },
  })
  const {
    fields: languageFields,
    remove: removeLanguage,
    handleAddItem: handleAddLanguageItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "languages",
    createItem: createDefaultEducationLanguageFormValues,
    validationErrorToast: {
      title: "No se puede anadir otro idioma",
      description:
        "Rellena correctamente el formulario ya creado para anadir otro idioma.",
    },
  })
  const {
    fields: courseFields,
    remove: removeCourse,
    handleAddItem: handleAddCourseItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "coursesAndCerfifications",
    createItem: createDefaultEduactionCoursesAndCerfificationsFormValues,
    validationErrorToast: {
      title: "No se puede anadir otro curso o certificado",
      description:
        "Rellena correctamente el formulario ya creado para anadir otro curso o certificado.",
    },
  })

  return (
    <>
      <form
        id={educationSectionFormId}
        className="space-y-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void submitSection({
            handleSubmit,
            formId: educationSectionFormId,
            onInvalid: handleInvalidSubmit,
            onValidSubmit: () => {
              openConfirmDialog()
              return true
            },
          })
        }}
      >
        <EducationSubsection
          title="Estudios"
          icon={<GraduationCap className="size-4" />}
          formId={educationSectionFormId}
        >
          <CollapsibleDeletableItemList
            addLabel="Anadir estudio"
            onAdd={() => void handleAddStudyItem()}
            className="space-y-5"
            listClassName="space-y-5"
          >
            {studyFields.map((field, index) => (
              <EducationStudyItem
                key={field.id}
                form={form}
                index={index}
                onDelete={() => removeStudy(index)}
                onSetValue={setValue}
              />
            ))}
          </CollapsibleDeletableItemList>
        </EducationSubsection>

        <EducationSubsection
          title="Idiomas"
          icon={<Languages className="size-4" />}
          formId={educationSectionFormId}
        >
          <CollapsibleDeletableItemList
            addLabel="Anadir idioma"
            onAdd={() => void handleAddLanguageItem()}
            className="space-y-5"
            listClassName="space-y-5"
          >
            {languageFields.map((field, index) => (
              <EducationLanguageItem
                key={field.id}
                form={form}
                index={index}
                onDelete={() => removeLanguage(index)}
                onSetValue={setValue}
              />
            ))}
          </CollapsibleDeletableItemList>
        </EducationSubsection>

        <EducationSubsection
          title="Cursos y certificados"
          icon={<BadgeCheck className="size-4" />}
          formId={educationSectionFormId}
        >
          <CollapsibleDeletableItemList
            addLabel="Anadir curso"
            onAdd={() => void handleAddCourseItem()}
            className="space-y-5"
            listClassName="space-y-5"
          >
            {courseFields.map((field, index) => (
              <EducationCourseItem
                key={field.id}
                form={form}
                index={index}
                onDelete={() => removeCourse(index)}
                onSetValue={setValue}
              />
            ))}
          </CollapsibleDeletableItemList>
        </EducationSubsection>
      </form>

      <AsyncActionDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        actionIcon={<Save className="size-4" />}
        onAction={runConfirmAction}
        {...profileSectionSaveDialogTexts}
      />
    </>
  )
})

function EducationSubsection({
  title,
  icon,
  formId,
  children,
}: {
  title: string
  icon: React.ReactNode
  formId?: string
  children: React.ReactNode
}) {
  const { open, setOpen } = useFormCollapsibleState(formId)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-muted/14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-primary">{icon}</span>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {title}
              </h3>
            </button>
          </CollapsibleTrigger>

          <CollapsibleTrigger asChild>
            <button
              type="button"
              aria-label={`Alternar ${title.toLowerCase()}`}
              className="group flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent forceMount className="data-[state=closed]:hidden">
          <div className="p-4 sm:p-5">{children}</div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  )
}

function EducationStudyItem({
  form,
  index,
  onDelete,
  onSetValue,
}: {
  form: UseFormReturn<EducationSectionFormValues>
  index: number
  onDelete: () => void
  onSetValue: UseFormReturn<EducationSectionFormValues>["setValue"]
}) {
  const { control } = form
  const prefix = `study-${index + 1}`
  const description =
    useWatch({
      control,
      name: `studies.${index}.description`,
    }) ?? ""
  const isRemote =
    useWatch({
      control,
      name: `studies.${index}.isRemote`,
    }) ?? false
  const isCurrent =
    useWatch({
      control,
      name: `studies.${index}.isCurrent`,
    }) ?? false

  return (
    <CollapsibleDeletableItem
      title={`Estudio ${index + 1}`}
      collapsible
      expandOnFormId={educationSectionFormId}
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar estudio ${index + 1}`}
              aria-label={`Eliminar estudio ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar estudio"
          description="Estas seguro de eliminar este estudio? Esta accion sera irreversible."
          actionLabel="Eliminar estudio"
          loadingLabel="Eliminando"
          successTitle="Estudio eliminado"
          successDescription="El estudio se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el estudio"
          errorDescription="No se ha podido eliminar el estudio. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name={`studies.${index}.title`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-title`}
              name={field.name}
              label="Nombre"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del estudio"
              icon={<GraduationCap className="size-4" />}
              maxLength={educationStudiesTitleMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`studies.${index}.institution`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-institution`}
              name={field.name}
              label="Centro"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del centro"
              icon={<Building2 className="size-4" />}
              maxLength={educationStudiesInstitutionMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`studies.${index}.location`}
          control={control}
          render={({ field, fieldState }) => (
            <MunicipalityComboboxWithCheckboxField
              id={`${prefix}-location`}
              label="Localizacion"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isRemote}
              onCheckedChange={(checked) =>
                onSetValue(`studies.${index}.isRemote`, checked, {
                  shouldValidate: true,
                })
              }
              placeholder="Ciudad o modalidad"
              checkedPlaceholder="Online"
              checkboxLabel="Online"
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
          name={`studies.${index}.start`}
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
          name={`studies.${index}.end`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerWithCheckboxField
              id={`${prefix}-end-date`}
              label="Fecha fin"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isCurrent}
              onCheckedChange={(checked) =>
                onSetValue(`studies.${index}.isCurrent`, checked, {
                  shouldValidate: true,
                })
              }
              placeholder="Selecciona mes y ano"
              checkedLabel="Actualmente en curso"
              checkboxId={`${prefix}-current`}
              className="self-start"
              disabledLabel="Actualmente en curso"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`studies.${index}.description`}
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
              placeholder="Describe el enfoque, contenido o logros del estudio"
              className="sm:col-span-2"
              icon={<FileText className="size-4" />}
              maxLength={educationStudiesDescriptionMaxLength}
              rows={5}
              autoResize
              maxAutoResizeHeightPx={416}
              characterCountLabel={`${description.length}/${educationStudiesDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <MultimediaEditorList
        form={form}
        itemsName={`studies.${index}.media`}
        itemIdPrefix={`study-${index + 1}-media`}
        createItemAction={createDefaultMultimediaFormValues}
        className="mt-5 border-t border-border/70 pt-5"
      />
    </CollapsibleDeletableItem>
  )
}

function EducationLanguageItem({
  form,
  index,
  onDelete,
  onSetValue,
}: {
  form: UseFormReturn<EducationSectionFormValues>
  index: number
  onDelete: () => void
  onSetValue: UseFormReturn<EducationSectionFormValues>["setValue"]
}) {
  const { control } = form
  const prefix = `language-${index + 1}`

  return (
    <CollapsibleDeletableItem
      title={`Idioma ${index + 1}`}
      collapsible
      expandOnFormId={educationSectionFormId}
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar idioma ${index + 1}`}
              aria-label={`Eliminar idioma ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar idioma"
          description="Estas seguro de eliminar este idioma? Esta accion sera irreversible."
          actionLabel="Eliminar idioma"
          loadingLabel="Eliminando"
          successTitle="Idioma eliminado"
          successDescription="El idioma se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el idioma"
          errorDescription="No se ha podido eliminar el idioma. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name={`languages.${index}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <LanguageComboboxField
              id={`${prefix}-name`}
              label="Idioma"
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value)

                if (!value.trim()) {
                  onSetValue(`languages.${index}.code`, "", {
                    shouldValidate: true,
                  })
                }
              }}
              onItemSelect={(item) =>
                onSetValue(`languages.${index}.code`, item?.code ?? "", {
                  shouldValidate: true,
                })
              }
              placeholder="Selecciona un idioma"
              className="sm:col-span-2"
              invalid={fieldState.invalid}
              error={fieldState.error}
              searchItems={getLanguage}
              getItemKey={(item) => item.id}
              getItemNativeName={(item) => item.nativeName}
              getItemEnglishName={(item) => item.englishName}
              getItemIconCode={(item) => item.code}
            />
          )}
        />

        <Controller
          name={`languages.${index}.level`}
          control={control}
          render={({ field, fieldState }) => (
            <SelectField
              id={`${prefix}-level`}
              label="Nivel"
              value={field.value ?? ""}
              onChange={field.onChange}
              options={educationLanguageLevels}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <MultimediaEditorList
        form={form}
        itemsName={`languages.${index}.media`}
        itemIdPrefix={`language-${index + 1}-media`}
        createItemAction={createDefaultMultimediaFormValues}
        className="mt-5 border-t border-border/70 pt-5"
      />
    </CollapsibleDeletableItem>
  )
}

function EducationCourseItem({
  form,
  index,
  onDelete,
  onSetValue,
}: {
  form: UseFormReturn<EducationSectionFormValues>
  index: number
  onDelete: () => void
  onSetValue: UseFormReturn<EducationSectionFormValues>["setValue"]
}) {
  const { control } = form
  const prefix = `course-${index + 1}`
  const description =
    useWatch({
      control,
      name: `coursesAndCerfifications.${index}.description`,
    }) ?? ""
  const isRemote =
    useWatch({
      control,
      name: `coursesAndCerfifications.${index}.isRemote`,
    }) ?? false
  const isCurrent =
    useWatch({
      control,
      name: `coursesAndCerfifications.${index}.isCurrent`,
    }) ?? false

  return (
    <CollapsibleDeletableItem
      title={`Curso o certificado ${index + 1}`}
      collapsible
      expandOnFormId={educationSectionFormId}
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar curso o certificado ${index + 1}`}
              aria-label={`Eliminar curso o certificado ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar curso o certificado"
          description="Estas seguro de eliminar este curso o certificado? Esta accion sera irreversible."
          actionLabel="Eliminar curso o certificado"
          loadingLabel="Eliminando"
          successTitle="Curso o certificado eliminado"
          successDescription="El elemento se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el curso o certificado"
          errorDescription="No se ha podido eliminar el elemento. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name={`coursesAndCerfifications.${index}.title`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-title`}
              name={field.name}
              label="Nombre"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del curso o certificado"
              icon={<BadgeCheck className="size-4" />}
              maxLength={eduactionCoursesAndCerfificationsTitleMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`coursesAndCerfifications.${index}.institution`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-institution`}
              name={field.name}
              label="Centro"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del centro"
              icon={<Building2 className="size-4" />}
              maxLength={eduactionCoursesAndCerfificationsInstitutionMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`coursesAndCerfifications.${index}.location`}
          control={control}
          render={({ field, fieldState }) => (
            <MunicipalityComboboxWithCheckboxField
              id={`${prefix}-location`}
              label="Localizacion"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isRemote}
              onCheckedChange={(checked) =>
                onSetValue(
                  `coursesAndCerfifications.${index}.isRemote`,
                  checked,
                  {
                    shouldValidate: true,
                  }
                )
              }
              placeholder="Ciudad o modalidad"
              checkedPlaceholder="Online"
              checkboxLabel="Online"
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
          name={`coursesAndCerfifications.${index}.start`}
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
          name={`coursesAndCerfifications.${index}.end`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerWithCheckboxField
              id={`${prefix}-end-date`}
              label="Fecha fin"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isCurrent}
              onCheckedChange={(checked) =>
                onSetValue(
                  `coursesAndCerfifications.${index}.isCurrent`,
                  checked,
                  {
                    shouldValidate: true,
                  }
                )
              }
              placeholder="Selecciona mes y ano"
              checkedLabel="Actualmente en curso"
              checkboxId={`${prefix}-current`}
              className="self-start"
              disabledLabel="Actualmente en curso"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`coursesAndCerfifications.${index}.description`}
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
              placeholder="Describe el contenido, enfoque o valor del curso o certificado"
              className="sm:col-span-2"
              icon={<FileText className="size-4" />}
              maxLength={
                eduactionCoursesAndCerfificationsDescriptionMaxLength
              }
              rows={5}
              autoResize
              maxAutoResizeHeightPx={416}
              characterCountLabel={`${description.length}/${eduactionCoursesAndCerfificationsDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <MultimediaEditorList
        form={form}
        itemsName={`coursesAndCerfifications.${index}.media`}
        itemIdPrefix={`course-${index + 1}-media`}
        createItemAction={createDefaultMultimediaFormValues}
        className="mt-5 border-t border-border/70 pt-5"
      />
    </CollapsibleDeletableItem>
  )
}
