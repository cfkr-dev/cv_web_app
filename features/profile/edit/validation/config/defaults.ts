export function createDefaultPersonalDataFormValues() {
  return {
    role: "",
    linkedin: "",
    website: "",
    summary: "",
  }
}

export function createDefaultWorkExperienceFormValues() {
  return {
    title: "",
    company: "",
    location: "",
    isRemote: false,
    start: "",
    end: "",
    isCurrent: false,
    description: "",
    media: [],
  }
}

export function createDefaultEducationStudiesFormValues() {
  return {
    title: "",
    institution: "",
    location: "",
    isRemote: false,
    start: "",
    end: "",
    isCurrent: false,
    description: "",
    media: [],
  }
}

export function createDefaultEducationLanguageFormValues() {
  return {
    code: "",
    name: "",
    level: "",
    media: [],
  }
}

export function createDefaultEduactionCoursesAndCerfificationsFormValues() {
  return {
    title: "",
    institution: "",
    location: "",
    isRemote: false,
    start: "",
    end: "",
    isCurrent: false,
    description: "",
    media: [],
  }
}

export function createDefaultEducationSectionFormValues() {
  return {
    studies: [createDefaultEducationStudiesFormValues()],
    languages: [createDefaultEducationLanguageFormValues()],
    coursesAndCerfifications: [
      createDefaultEduactionCoursesAndCerfificationsFormValues(),
    ],
  }
}

export function createDefaultSkillFormValues() {
  return {
    name: "",
    customDescription: "",
    level: "Principiante",
    description: "",
  }
}

export function createDefaultSkillGroupFormValues() {
  return {
    title: "",
    description: "",
    skills: [createDefaultSkillFormValues()],
  }
}

export function createDefaultProjectFormValues() {
  return {
    name: "",
    start: "",
    end: "",
    isCurrent: false,
    description: "",
    media: [],
  }
}

export function createDefaultCollaborationProjectFormValues() {
  return {
    id: "",
    name: "",
    start: "",
    end: "",
    isCurrent: false,
    description: "",
  }
}
