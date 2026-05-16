import type { WorkExperienceSectionFormValues } from "@/features/profile/edit/sections/work-experience"
import { bytes } from "@/lib/utils/general/bytes"

const workExperienceData: WorkExperienceSectionFormValues = {
  experiences: [
    {
      id: "1",
      title: "Frontend Developer",
      company: "Acme Studio",
      location: "Madrid, Comunidad de Madrid, España",
      isRemote: false,
      start: "2022-01",
      end: "",
      isCurrent: true,
      description:
        "Desarrollo de interfaces, evolucion del design system y colaboracion con producto y negocio.",
      media: [
        {
          id: "1",
          title: "Caso de estudio",
          isLink: true,
          isLocalFile: false,
          url: "https://example.com/case-study",
          description: "Resumen del proyecto y resultados principales.",
          file: null,
          fileName: "",
          fileSize: null,
        },
        {
          id: "2",
          title: "Presentacion ejecutiva",
          isLink: false,
          isLocalFile: false,
          url: "",
          description: "Presentacion remota ya asociada a la experiencia.",
          file: null,
          fileName: "slides.pptx",
          fileSize: bytes.MB(23),
        },
      ],
    },
    {
      id: "2",
      title: "UI Developer",
      company: "Northwind",
      location: "",
      isRemote: true,
      start: "2020-03",
      end: "2021-12",
      isCurrent: false,
      description:
        "Implementacion de componentes reutilizables y pantallas de producto con foco en consistencia visual.",
      media: [],
    },
  ],
}

export async function getWorkExperience() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  return {
    experiences: workExperienceData.experiences.map((experience) => ({
      ...experience,
      media: experience.media.map((mediaItem) => ({
        ...mediaItem,
      })),
    })),
  }
}
