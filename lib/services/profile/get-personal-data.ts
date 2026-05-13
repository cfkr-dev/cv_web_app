import type { PersonalDataFormValues } from "@/features/profile/edit/validation/schemas/personal-data"

const personalData: PersonalDataFormValues = {
  role: "Frontend Developer",
  linkedin: "https://www.linkedin.com/in/alberto-perez",
  website: "https://myworkspace.dev",
  summary:
    "Frontend developer orientado a producto con experiencia creando experiencias digitales claras, mantenibles y visualmente solidas.",
}

export async function getPersonalData() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  return {
    ...personalData,
  }
}
