import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormHandleSubmit } from "react-hook-form"

import { expandFormCollapsibles } from "@/lib/utils/validation/form-collapsible"
import { focusFirstFormError } from "@/lib/utils/validation/form-error-focus"

type SubmitSectionOptions<TValues extends FieldValues> = {
  handleSubmit: UseFormHandleSubmit<TValues>
  onValidSubmit: () => Promise<boolean> | boolean
  formId?: string
  focusOnInvalid?: boolean
  onInvalid?: () => void
}

type ValidateSectionOptions<TValues extends FieldValues> = {
  handleSubmit: UseFormHandleSubmit<TValues>
  formId?: string
  focusOnInvalid?: boolean
  onInvalid?: () => void
}

async function runFormValidation<TValues extends FieldValues>(
  handleSubmit: UseFormHandleSubmit<TValues>,
  onValid: SubmitHandler<TValues>,
  onInvalid: SubmitErrorHandler<TValues>
) {
  await handleSubmit(onValid, onInvalid)()
}

export async function validateSection<TValues extends FieldValues>({
  handleSubmit,
  formId,
  focusOnInvalid = true,
  onInvalid,
}: ValidateSectionOptions<TValues>) {
  await expandFormCollapsibles(formId)
  let isValid = false

  await runFormValidation(
    handleSubmit,
    async () => {
      isValid = true
    },
    async () => {
      isValid = false
    }
  )

  if (!isValid && focusOnInvalid) {
    onInvalid?.()
    await focusFirstFormError(formId)
  } else if (!isValid) {
    onInvalid?.()
  }

  return isValid
}

export async function submitSection<TValues extends FieldValues>({
  handleSubmit,
  onValidSubmit,
  formId,
  focusOnInvalid = true,
  onInvalid,
}: SubmitSectionOptions<TValues>) {
  await expandFormCollapsibles(formId)
  let isValid = false
  let submitResult = false

  await runFormValidation(
    handleSubmit,
    async () => {
      isValid = true
      submitResult = await onValidSubmit()
    },
    async () => {
      isValid = false
    }
  )

  if (!isValid && focusOnInvalid) {
    onInvalid?.()
    await focusFirstFormError(formId)
    return false
  }

  if (!isValid) {
    onInvalid?.()
    return false
  }

  return submitResult
}
