import type { RefObject } from "react"

import type { SectionState } from "@/features/profile/edit/types/section"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"
import {
  personalDataFormId,
  workExperienceSectionFormId,
  educationSectionFormId,
  skillsSectionFormId,
  projectsSectionFormId,
} from "@/features/profile/edit/validation/config/constants"
import { focusFirstErrorInForms } from "@/lib/utils/validation/form-error-focus"

type SectionRef = RefObject<SectionSubmitHandle | null>

type GlobalProfileSubmitRefs = {
  personalDataRef: SectionRef
  workExperienceRef: SectionRef
  educationRef: SectionRef
  skillsRef: SectionRef
  projectsRef: SectionRef
}

function isSectionVisible(sections: SectionState[], key: SectionState["key"]) {
  return sections.some((section) => section.key === key && section.present)
}

function getVisibleFormIds(sections: SectionState[]) {
  const formIds = [personalDataFormId]

  if (isSectionVisible(sections, "work-experience")) {
    formIds.push(workExperienceSectionFormId)
  }

  if (isSectionVisible(sections, "education")) {
    formIds.push(educationSectionFormId)
  }

  if (isSectionVisible(sections, "skills")) {
    formIds.push(skillsSectionFormId)
  }

  if (isSectionVisible(sections, "projects")) {
    formIds.push(projectsSectionFormId)
  }

  return formIds
}

export async function validateGlobalProfileSections(
  sections: SectionState[],
  refs: GlobalProfileSubmitRefs
) {
  const validators: Array<() => Promise<boolean>> = [
    () =>
      refs.personalDataRef.current?.validate({
        focusOnInvalid: false,
      }) ?? Promise.resolve(false),
  ]

  if (isSectionVisible(sections, "work-experience")) {
    validators.push(
      () =>
        refs.workExperienceRef.current?.validate({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "education")) {
    validators.push(
      () =>
        refs.educationRef.current?.validate({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "skills")) {
    validators.push(
      () =>
        refs.skillsRef.current?.validate({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "projects")) {
    validators.push(
      () =>
        refs.projectsRef.current?.validate({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  const results = await Promise.all(
    validators.map((validateSection) => validateSection())
  )

  if (!results.every(Boolean)) {
    await focusFirstErrorInForms(getVisibleFormIds(sections))
    return false
  }

  return true
}

export async function submitGlobalProfileSections(
  sections: SectionState[],
  refs: GlobalProfileSubmitRefs
) {
  const submitters: Array<() => Promise<boolean>> = [
    () =>
      refs.personalDataRef.current?.submit({
        focusOnInvalid: false,
      }) ?? Promise.resolve(false),
  ]

  if (isSectionVisible(sections, "work-experience")) {
    submitters.push(
      () =>
        refs.workExperienceRef.current?.submit({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "education")) {
    submitters.push(
      () =>
        refs.educationRef.current?.submit({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "skills")) {
    submitters.push(
      () =>
        refs.skillsRef.current?.submit({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "projects")) {
    submitters.push(
      () =>
        refs.projectsRef.current?.submit({
          focusOnInvalid: false,
        }) ?? Promise.resolve(false)
    )
  }

  for (const submitSection of submitters) {
    const ok = await submitSection()

    if (!ok) {
      await focusFirstErrorInForms(getVisibleFormIds(sections))
      throw new Error("Corrige los errores del formulario antes de guardar.")
    }
  }
}

export function clearGlobalProfileSectionsValidationState(
  sections: SectionState[],
  refs: GlobalProfileSubmitRefs
) {
  refs.personalDataRef.current?.clearValidationStatePreservingValues()

  if (isSectionVisible(sections, "work-experience")) {
    refs.workExperienceRef.current?.clearValidationStatePreservingValues()
  }

  if (isSectionVisible(sections, "education")) {
    refs.educationRef.current?.clearValidationStatePreservingValues()
  }

  if (isSectionVisible(sections, "skills")) {
    refs.skillsRef.current?.clearValidationStatePreservingValues()
  }

  if (isSectionVisible(sections, "projects")) {
    refs.projectsRef.current?.clearValidationStatePreservingValues()
  }
}
