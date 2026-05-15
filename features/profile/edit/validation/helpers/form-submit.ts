type SubmitProfileSectionValuesOptions<TValues> = {
  values: TValues
  reset: (values: TValues) => void
  onConfirmAction: (values: TValues) => Promise<void>
}

export async function submitProfileSectionValues<TValues>({
  values,
  reset,
  onConfirmAction,
}: SubmitProfileSectionValuesOptions<TValues>) {
  console.log("Form submit payload:", values)
  await onConfirmAction(values)
  reset(values)

  return true
}
