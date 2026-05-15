"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BriefcaseBusiness, FileText, Globe, Save } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { IconLinkedin } from "nucleo-social-media"
import { Controller, useForm, useWatch } from "react-hook-form"

import { AsyncActionDialog } from "components/dialog/async-action-dialog"
import { TextInputField } from "components/form/text-input-field"
import { TextareaField } from "components/form/textarea-field"
import { UrlNavigationButton } from "components/url-navigation-button"
import { getNavigableUrl } from "@/lib/utils/general/url"
import {
  personalDataSchema,
  type PersonalDataFormValues,
} from "features/profile/edit/validation/schemas/personal-data"
import {
  createDefaultPersonalDataFormValues
} from "@/features/profile/edit/validation/config/defaults"
import { fakeRequest } from "@/lib/services/mock/fake-request"
import {
  personalDataFormId,
  profileSectionSaveDialogTexts,
  personalDataSummaryMaxLength,
} from "@/features/profile/edit/validation/config/constants"
import {
  submitSection,
  validateSection,
} from "@/features/profile/edit/validation/helpers/section-submit"
import { useProfileSectionSave } from "@/features/profile/edit/validation/hooks/use-profile-section-save"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"

type PersonalDataProps = {
  initialData?: PersonalDataFormValues | null
}

export const PersonalData = forwardRef<SectionSubmitHandle, PersonalDataProps>(function PersonalData(
  { initialData = null },
  ref
) {
  const form = useForm<PersonalDataFormValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: createDefaultPersonalDataFormValues()
  })
  const { control, getValues, handleSubmit, reset } = form
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
        formId: personalDataFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
    submit: (options) =>
      submitSection({
        handleSubmit,
        onValidSubmit: runConfirmAction,
        formId: personalDataFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
  }))
  useEffect(() => {
    if (!initialData) {
      return
    }

    reset(initialData)
  }, [initialData, reset])
  const linkedinUrl = useWatch({ control, name: "linkedin" }) ?? ""
  const websiteUrl = useWatch({ control, name: "website" }) ?? ""
  const summary = useWatch({ control, name: "summary" }) ?? ""

  return (
    <>
      <form
        id={personalDataFormId}
        className="grid gap-5 sm:grid-cols-2"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void submitSection({
            handleSubmit,
            formId: personalDataFormId,
            onInvalid: handleInvalidSubmit,
            onValidSubmit: () => {
              openConfirmDialog()
              return true
            },
          })
        }}
      >
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={field.name}
              name={field.name}
              label="Puesto profesional"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Tu puesto profesional"
              className="sm:col-span-2"
              icon={<BriefcaseBusiness className="size-4" />}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name="linkedin"
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={field.name}
              name={field.name}
              label="LinkedIn"
              type="url"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="https://www.linkedin.com/in/tu-perfil"
              icon={<IconLinkedin className="size-4" />}
              invalid={fieldState.invalid}
              error={fieldState.error}
              trailingAction={
                linkedinUrl.trim() ? (
                  <UrlNavigationButton
                    value={linkedinUrl}
                    label="Abrir perfil de LinkedIn"
                    getNavigableUrl={getNavigableUrl}
                  />
                ) : null
              }
            />
          )}
        />

        <Controller
          name="website"
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={field.name}
              name={field.name}
              label="Pagina web"
              type="url"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="https://tu-web.com"
              icon={<Globe className="size-4" />}
              invalid={fieldState.invalid}
              error={fieldState.error}
              trailingAction={
                websiteUrl.trim() ? (
                  <UrlNavigationButton
                    value={websiteUrl}
                    label="Abrir pagina web"
                    getNavigableUrl={getNavigableUrl}
                  />
                ) : null
              }
            />
          )}
        />

        <Controller
          name="summary"
          control={control}
          render={({ field, fieldState }) => (
            <TextareaField
              id={field.name}
              name={field.name}
              label="Resumen profesional"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              textareaRef={field.ref}
              placeholder="Resume tu perfil profesional"
              className="sm:col-span-2"
              icon={<FileText className="size-4" />}
              maxLength={personalDataSummaryMaxLength}
              rows={5}
              autoResize
              maxAutoResizeHeightPx={416}
              characterCountLabel={`${summary.length}/${personalDataSummaryMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
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
