import type { EducationSectionFormValues } from "@/features/profile/edit/sections/education"
import { bytes } from "@/lib/utils/general/bytes"

const educationData: EducationSectionFormValues = {
  studies: [
    {
      id: "1",
      title: "Grado en Ingenieria Informatica",
      institution: "Universidad Complutense de Madrid",
      location: "Barcelona, Cataluña, España",
      isRemote: false,
      start: "2019-09",
      end: "2023-06",
      isCurrent: false,
      description:
        "Formacion centrada en desarrollo de software, bases de datos y arquitectura de aplicaciones web.",
      media: [
        {
          id: "11",
          title: "Expediente academico",
          isLink: false,
          isLocalFile: false,
          url: "",
          description: "Documento remoto asociado al estudio.",
          file: null,
          fileName: "expediente.pdf",
          fileSize: bytes.MB(2),
        },
      ],
    },
    {
      id: "2",
      title: "Master en Desarrollo Web y GIS",
      institution: "Universidad Politecnica de Madrid",
      location: "",
      isRemote: true,
      start: "2023-09",
      end: "",
      isCurrent: true,
      description:
        "Especializacion en interfaces web, modelado de datos geograficos y productos digitales.",
      media: [],
    },
  ],
  languages: [
    {
      id: "1",
      code: "es",
      name: "Español",
      level: "Nativo",
      media: [],
    },
    {
      id: "2",
      code: "en",
      name: "English",
      level: "C1 avanzado",
      media: [
        {
          id: "21",
          title: "Certificado de ingles",
          isLink: false,
          isLocalFile: false,
          url: "",
          description: "Certificacion de nivel remoto ya asociada al idioma.",
          file: null,
          fileName: "english-certificate.pdf",
          fileSize: bytes.KB(850),
        },
      ],
    },
  ],
  coursesAndCertifications: [
    {
      id: "1",
      title: "Curso avanzado de React y Next.js",
      institution: "OpenWeb Academy",
      location: "",
      isRemote: true,
      start: "2024-02",
      end: "2024-05",
      isCurrent: false,
      description:
        "Curso practico orientado a componentes reutilizables, TypeScript y arquitectura frontend.",
      media: [
        {
          id: "31",
          title: "Pagina del curso",
          isLink: true,
          isLocalFile: false,
          url: "https://example.com/react-next-course",
          description: "Referencia publica del curso realizado.",
          file: null,
          fileName: "",
          fileSize: null,
        },
      ],
    },
  ],
}

export async function getEducation() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  return {
    studies: educationData.studies.map((study) => ({
      ...study,
      media: study.media.map((mediaItem) => ({
        ...mediaItem,
      })),
    })),
    languages: educationData.languages.map((language) => ({
      ...language,
      media: language.media.map((mediaItem) => ({
        ...mediaItem,
      })),
    })),
    coursesAndCertifications: educationData.coursesAndCertifications.map(
      (course) => ({
        ...course,
        media: course.media.map((mediaItem) => ({
          ...mediaItem,
        })),
      })
    ),
  }
}
