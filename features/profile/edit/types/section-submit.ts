export type SectionSubmitHandle = {
  validateSilently: () => Promise<boolean>
  submitSilently: () => Promise<boolean>
}
