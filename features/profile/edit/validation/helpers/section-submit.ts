type SubmitSectionSilentlyOptions = {
  trigger: () => Promise<boolean>
  runImmediateSubmit: () => Promise<boolean>
}

type ValidateSectionSilentlyOptions = {
  trigger: () => Promise<boolean>
}

export async function validateSectionSilently({
  trigger,
}: ValidateSectionSilentlyOptions) {
  return await trigger()
}

export async function submitSectionSilently({
  trigger,
  runImmediateSubmit,
}: SubmitSectionSilentlyOptions) {
  const isValid = await trigger()

  if (!isValid) {
    return false
  }

  return await runImmediateSubmit()
}
