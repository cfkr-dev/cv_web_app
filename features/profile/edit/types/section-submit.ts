export type SectionSubmitOptions = {
  focusOnInvalid?: boolean
}

export type SectionSubmitHandle = {
  clearValidationStatePreservingValues: () => void
  validate: (options?: SectionSubmitOptions) => Promise<boolean>
  submit: (options?: SectionSubmitOptions) => Promise<boolean>
}
