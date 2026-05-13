import type { SkillsSectionFormValues } from "@/features/profile/edit/validation/schemas/skills"

const skillsData: SkillsSectionFormValues = {
  groups: [
    {
      id: "1",
      title: "Frontend",
      description:
        "Tecnologias y practicas relacionadas con la construccion de interfaces web.",
      skills: [
        {
          id: "11",
          name: "React",
          customDescription: "",
          level: "Experto",
          description:
            "Desarrollo de componentes, flujos de formulario y experiencia de usuario en aplicaciones complejas.",
        },
        {
          id: "12",
          name: "TypeScript",
          customDescription: "",
          level: "Avanzado",
          description:
            "Tipado estricto, modelado de tipos y mantenimiento de contratos estables entre componentes y servicios.",
        },
      ],
    },
    {
      id: "2",
      title: "GIS y datos",
      description:
        "Herramientas y conceptos para trabajar con informacion geografica y modelado de datos.",
      skills: [
        {
          id: "21",
          name: "PostGIS",
          customDescription: "",
          level: "Avanzado",
          description:
            "Consultas espaciales, modelado geoespacial y soporte a visualizaciones cartograficas.",
        },
      ],
    },
  ],
}

export async function getSkills() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  return {
    groups: skillsData.groups.map((group) => ({
      ...group,
      skills: group.skills.map((skill) => ({
        ...skill,
      })),
    })),
  }
}
