"use client"

import {
  useFieldArray,
  type FieldArray,
  type FieldArrayPath,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useAppToast, type AppToastOptions } from "@/hooks/use-app-toast"

type UseValidatedPrependFieldArrayParams<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
> = {
  form: UseFormReturn<TFieldValues>
  name: TFieldArrayName
  createItem: () => unknown
  validationErrorToast?: AppToastOptions
}

export function useValidatedPrependFieldArray<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
>({
  form,
  name,
  createItem,
  validationErrorToast,
}: UseValidatedPrependFieldArrayParams<TFieldValues, TFieldArrayName>) {
  const { control, trigger, reset, getValues } = form
  const appToast = useAppToast()
  const fieldArray = useFieldArray({
    control,
    name,
  })

  async function handleAddItem() {
    const isValid = await trigger(name as Path<TFieldValues>, {
      shouldFocus: true,
    })

    reset(getValues())

    if (!isValid) {
      appToast.error(
        validationErrorToast ?? {
          title: "No se puede anadir el elemento",
          description: "Corrige los errores antes de continuar.",
        }
      )
      return
    }

    fieldArray.prepend(
      createItem() as FieldArray<TFieldValues, TFieldArrayName>
    )
  }

  return {
    ...fieldArray,
    handleAddItem,
  }
}
