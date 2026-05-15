"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Layers3, Plus, Save, Trash2 } from "lucide-react"
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
import { SkillComboboxField } from "components/form/skill-combobox-field"
import { SteppedSliderField } from "components/form/stepped-slider-field"
import { TextInputField } from "components/form/text-input-field"
import { TextareaField } from "components/form/textarea-field"
import { Button } from "components/ui/button"
import { FieldError } from "components/ui/field"
import {
  createDefaultSkillFormValues,
  createDefaultSkillGroupFormValues,
} from "../validation/config/defaults"
import { skillLevels } from "@/features/profile/edit/config/skills-defaults"
import {
  SkillsSectionFormValues,
  skillsSectionSchema,
} from "@/features/profile/edit/validation/schemas/skills"
import { fakeRequest } from "@/lib/services/mock/fake-request"
import { getSkill, getSkillCatalog } from "@/lib/services/search/skill"
import { getNormalizedSearchValue } from "@/lib/utils/general/search"
import { validateSkillName } from "@/lib/utils/validation/skill"
import { useValidatedPrependFieldArray } from "@/hooks/use-validated-prepend-field-array"
import {
  profileSectionSaveDialogTexts,
  skillsGroupDescriptionMaxLength,
  skillsGroupTitleMaxLength,
  skillsItemCustomDescriptionMaxLength,
  skillsItemDescriptionMaxLength,
  skillsSectionFormId,
} from "@/features/profile/edit/validation/config/constants"
import {
  submitSection,
  validateSection,
} from "@/features/profile/edit/validation/helpers/section-submit"
import { useProfileSectionSave } from "@/features/profile/edit/validation/hooks/use-profile-section-save"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"

type SkillsProps = {
  initialData?: SkillsSectionFormValues | null
}

export const Skills = forwardRef<SectionSubmitHandle, SkillsProps>(function Skills(
  { initialData = null },
  ref
) {
  const form = useForm<SkillsSectionFormValues>({
    resolver: zodResolver(skillsSectionSchema),
    defaultValues: {
      groups: [createDefaultSkillGroupFormValues()],
    },
  })
  const { getValues, handleSubmit, reset } = form
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
        formId: skillsSectionFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
    submit: (options) =>
      submitSection({
        handleSubmit,
        onValidSubmit: runConfirmAction,
        formId: skillsSectionFormId,
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
    fields: groupFields,
    remove: removeGroup,
    handleAddItem: handleAddGroupItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "groups",
    createItem: createDefaultSkillGroupFormValues,
    validationErrorToast: {
      title: "No se puede anadir otro grupo",
      description:
        "Rellena correctamente el formulario ya creado para anadir otro grupo de habilidades.",
    },
  })

  return (
    <>
      <form
        id={skillsSectionFormId}
        className="space-y-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void submitSection({
            handleSubmit,
            formId: skillsSectionFormId,
            onInvalid: handleInvalidSubmit,
            onValidSubmit: () => {
              openConfirmDialog()
              return true
            },
          })
        }}
      >
        <CollapsibleDeletableItemList
          addLabel="Anadir nuevo grupo de habilidades"
          onAdd={() => void handleAddGroupItem()}
          className="space-y-5"
          listClassName="space-y-5"
        >
          {groupFields.map((field, index) => (
            <SkillGroupItem
              key={field.id}
              form={form}
              index={index}
              onDelete={() => removeGroup(index)}
            />
          ))}
        </CollapsibleDeletableItemList>
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

function SkillGroupItem({
  form,
  index,
  onDelete,
}: {
  form: UseFormReturn<SkillsSectionFormValues>
  index: number
  onDelete: () => void
}) {
  const { clearErrors, control, getValues } = form
  const prefix = `skill-group-${index + 1}`
  const groupDescription =
    useWatch({
      control,
      name: `groups.${index}.description`,
    }) ?? ""
  const {
    fields: skillFields,
    prepend: prependSkill,
    remove: removeSkill,
    handleAddItem: handleAddSkillItem,
  } = useValidatedPrependFieldArray({
    form,
    name: `groups.${index}.skills` as const,
    createItem: createDefaultSkillFormValues,
    validationErrorToast: {
      title: "No se puede anadir otra habilidad",
      description:
        "Rellena correctamente el formulario ya creado para anadir otra habilidad.",
    },
  })
  const skillsError = form.formState.errors.groups?.[index]?.skills
  const skillsErrorMessage =
    typeof skillsError?.message === "string"
      ? skillsError.message
      : typeof skillsError?.root?.message === "string"
        ? skillsError.root.message
        : undefined

  async function handleAddSkill() {
    const currentSkills = getValues(`groups.${index}.skills`)

    if (!currentSkills.length) {
      prependSkill(createDefaultSkillFormValues())
      clearErrors(`groups.${index}.skills`)
      return
    }

    await handleAddSkillItem()
  }

  function handleDeleteSkill(skillIndex: number) {
    removeSkill(skillIndex)
    clearErrors(`groups.${index}.skills`)
  }

  return (
    <CollapsibleDeletableItem
      title={`Grupo de habilidades ${index + 1}`}
      collapsible
      expandOnFormId={skillsSectionFormId}
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar grupo de habilidades ${index + 1}`}
              aria-label={`Eliminar grupo de habilidades ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar grupo de habilidades"
          description="Estas seguro de eliminar este grupo de habilidades? Esta accion sera irreversible."
          actionLabel="Eliminar grupo"
          loadingLabel="Eliminando"
          successTitle="Grupo eliminado"
          successDescription="El grupo se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el grupo"
          errorDescription="No se ha podido eliminar el grupo. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5">
        <Controller
          name={`groups.${index}.title`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-title`}
              name={field.name}
              label="Nombre del grupo"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Frontend, GIS, backend..."
              icon={<Layers3 className="size-4" />}
              maxLength={skillsGroupTitleMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`groups.${index}.description`}
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
              placeholder="Describe brevemente el alcance o enfoque de este grupo de habilidades"
              icon={<FileText className="size-4" />}
              maxLength={skillsGroupDescriptionMaxLength}
              rows={4}
              autoResize
              maxAutoResizeHeightPx={320}
              characterCountLabel={`${groupDescription.length}/${skillsGroupDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <div className="mt-5 border-t border-border/70 pt-5">
        <CollapsibleDeletableItemList
          className="space-y-5"
          listClassName="space-y-5"
          addButton={
            <div className="flex flex-col items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-invalid={Boolean(skillsErrorMessage)}
                className={
                  skillsErrorMessage
                    ? "text-destructive hover:bg-destructive/5 hover:text-destructive"
                    : undefined
                }
                onClick={() => void handleAddSkill()}
              >
                <Plus className="size-4" />
                Anadir nueva habilidad
              </Button>
              {skillsErrorMessage ? <FieldError>{skillsErrorMessage}</FieldError> : null}
            </div>
          }
        >
          {skillFields.map((field, skillIndex) => (
            <SkillItem
              key={field.id}
              form={form}
              groupIndex={index}
              skillIndex={skillIndex}
              onDelete={() => handleDeleteSkill(skillIndex)}
            />
          ))}
        </CollapsibleDeletableItemList>
      </div>
    </CollapsibleDeletableItem>
  )
}

function SkillItem({
  form,
  groupIndex,
  skillIndex,
  onDelete,
}: {
  form: UseFormReturn<SkillsSectionFormValues>
  groupIndex: number
  skillIndex: number
  onDelete: () => void
}) {
  const { control } = form
  const prefix = `skill-group-${groupIndex + 1}-skill-${skillIndex + 1}`
  const skillName =
    useWatch({
      control,
      name: `groups.${groupIndex}.skills.${skillIndex}.name`,
    }) ?? ""
  const normalizedSkillName = skillName.trim()
  const matchedSuggestedSkill = getSkillCatalog().find(
    (skill) =>
      getNormalizedSearchValue(skill.name) ===
      getNormalizedSearchValue(normalizedSkillName)
  )
  const shouldShowCustomDescription = Boolean(normalizedSkillName)
  const isSuggestedSkill = Boolean(matchedSuggestedSkill)
  const skillDescription =
    useWatch({
      control,
      name: `groups.${groupIndex}.skills.${skillIndex}.description`,
    }) ?? ""

  return (
    <CollapsibleDeletableItem
      title={`Habilidad ${skillIndex + 1}`}
      collapsible
      expandOnFormId={skillsSectionFormId}
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar habilidad ${skillIndex + 1}`}
              aria-label={`Eliminar habilidad ${skillIndex + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar habilidad"
          description="Estas seguro de eliminar esta habilidad? Esta accion sera irreversible."
          actionLabel="Eliminar habilidad"
          loadingLabel="Eliminando"
          successTitle="Habilidad eliminada"
          successDescription="La habilidad se ha eliminado correctamente."
          errorTitle="No se pudo eliminar la habilidad"
          errorDescription="No se ha podido eliminar la habilidad. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5">
        <Controller
          name={`groups.${groupIndex}.skills.${skillIndex}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <SkillComboboxField
              id={`${prefix}-name`}
              label="Nombre de la habilidad"
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value)

                if (validateSkillName(value)) {
                  form.setValue(
                    `groups.${groupIndex}.skills.${skillIndex}.customDescription`,
                    "",
                    {
                      shouldValidate: true,
                    }
                  )
                }
              }}
              placeholder="React, PostGIS, liderazgo..."
              invalid={fieldState.invalid}
              error={fieldState.error}
              searchItems={getSkill}
              getItemKey={(item) => item.id}
              getItemName={(item) => item.name}
              getItemDescription={(item) => item.description}
            />
          )}
        />

        {shouldShowCustomDescription && isSuggestedSkill ? (
          <TextInputField
            id={`${prefix}-custom-description`}
            label="Descripcion breve de la habilidad"
            value={matchedSuggestedSkill?.description ?? ""}
            placeholder="Descripcion de la habilidad seleccionada"
            maxLength={skillsItemCustomDescriptionMaxLength}
            disabled
          />
        ) : null}

        {shouldShowCustomDescription && !isSuggestedSkill ? (
          <Controller
            name={`groups.${groupIndex}.skills.${skillIndex}.customDescription`}
            control={control}
            render={({ field, fieldState }) => (
              <TextInputField
                id={`${prefix}-custom-description`}
                name={field.name}
                label="Descripcion breve de la habilidad"
                value={
                  isSuggestedSkill
                    ? matchedSuggestedSkill?.description ?? ""
                    : field.value ?? ""
                }
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                placeholder="Resume brevemente el concepto de esta habilidad"
                maxLength={skillsItemCustomDescriptionMaxLength}
                invalid={fieldState.invalid}
                error={fieldState.error}
              />
            )}
          />
        ) : null}

        <Controller
          name={`groups.${groupIndex}.skills.${skillIndex}.level`}
          control={control}
          render={({ field }) => (
            <SteppedSliderField
              id={`${prefix}-level`}
              label="Nivel"
              value={field.value ?? skillLevels[0]}
              onChange={field.onChange}
              levels={skillLevels}
            />
          )}
        />

        <Controller
          name={`groups.${groupIndex}.skills.${skillIndex}.description`}
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
              placeholder="Describe el alcance, experiencia o contexto de esta habilidad"
              icon={<FileText className="size-4" />}
              maxLength={skillsItemDescriptionMaxLength}
              rows={4}
              autoResize
              maxAutoResizeHeightPx={320}
              characterCountLabel={`${skillDescription.length}/${skillsItemDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>
    </CollapsibleDeletableItem>
  )
}
