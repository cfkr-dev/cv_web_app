import type { RefObject } from "react"

import type { SectionState } from "@/features/profile/edit/types/section"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"

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

function logHiddenSectionSubmit(label: string, payload: unknown) {
  console.log(`Form submit payload (${label}):`, payload)
}

export async function validateGlobalProfileSections(
  sections: SectionState[],
  refs: GlobalProfileSubmitRefs
) {
  const validators: Array<() => Promise<boolean>> = [
    () => refs.personalDataRef.current?.validateSilently() ?? Promise.resolve(false),
  ]

  if (isSectionVisible(sections, "work-experience")) {
    validators.push(
      () => refs.workExperienceRef.current?.validateSilently() ?? Promise.resolve(false)
    )
  }

  if (isSectionVisible(sections, "education")) {
    validators.push(() => refs.educationRef.current?.validateSilently() ?? Promise.resolve(false))
  }

  if (isSectionVisible(sections, "skills")) {
    validators.push(() => refs.skillsRef.current?.validateSilently() ?? Promise.resolve(false))
  }

  if (isSectionVisible(sections, "projects")) {
    validators.push(() => refs.projectsRef.current?.validateSilently() ?? Promise.resolve(false))
  }

  const results = await Promise.all(validators.map((validateSection) => validateSection()))

  return results.every(Boolean)
}

export async function submitGlobalProfileSections(
  sections: SectionState[],
  refs: GlobalProfileSubmitRefs
) {
  const submitters: Array<() => Promise<boolean>> = [
    () => refs.personalDataRef.current?.submitSilently() ?? Promise.resolve(false),
  ]

  if (isSectionVisible(sections, "work-experience")) {
    submitters.push(
      () => refs.workExperienceRef.current?.submitSilently() ?? Promise.resolve(false)
    )
  } else {
    submitters.push(async () => {
      logHiddenSectionSubmit("workExperience", { experiences: [] })
      return true
    })
  }

  if (isSectionVisible(sections, "education")) {
    submitters.push(() => refs.educationRef.current?.submitSilently() ?? Promise.resolve(false))
  } else {
    submitters.push(async () => {
      logHiddenSectionSubmit("education", {
        studies: [],
        languages: [],
        coursesAndCerfifications: [],
      })
      return true
    })
  }

  if (isSectionVisible(sections, "skills")) {
    submitters.push(() => refs.skillsRef.current?.submitSilently() ?? Promise.resolve(false))
  } else {
    submitters.push(async () => {
      logHiddenSectionSubmit("skills", { groups: [] })
      return true
    })
  }

  if (isSectionVisible(sections, "projects")) {
    submitters.push(() => refs.projectsRef.current?.submitSilently() ?? Promise.resolve(false))
  } else {
    submitters.push(async () => {
      logHiddenSectionSubmit("projects", { projects: [] })
      return true
    })
  }

  for (const submitSection of submitters) {
    const ok = await submitSection()

    if (!ok) {
      throw new Error("Corrige los errores del formulario antes de guardar.")
    }
  }
}
