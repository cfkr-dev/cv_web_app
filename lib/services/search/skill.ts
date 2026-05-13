import { getNormalizedSearchValue } from "@/lib/utils/general/search"

export type SkillSearchResult = {
  id: string
  name: string
  description: string
}

type GetSkillOptions = {
  signal?: AbortSignal
}

const skillCatalog: SkillSearchResult[] = [
  {
    id: "react",
    name: "React",
    description: "Desarrollo de interfaces basadas en componentes.",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "Framework full stack para aplicaciones React.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "JavaScript tipado para proyectos mantenibles y seguros.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "Lenguaje base para desarrollo web interactivo.",
  },
  {
    id: "tailwind-css",
    name: "Tailwind CSS",
    description: "Maquetacion y estilos con utilidades CSS.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    description: "Ejecucion de JavaScript en servidor y tooling.",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Base de datos relacional orientada a datos complejos.",
  },
  {
    id: "postgis",
    name: "PostGIS",
    description: "Extension espacial de PostgreSQL para datos geograficos.",
  },
  {
    id: "qgis",
    name: "QGIS",
    description: "Herramienta SIG de escritorio para analisis y cartografia.",
  },
  {
    id: "arcgis",
    name: "ArcGIS",
    description: "Suite SIG para analisis, publicacion y gestion espacial.",
  },
  {
    id: "leaflet",
    name: "Leaflet",
    description: "Libreria ligera para mapas interactivos en web.",
  },
  {
    id: "openlayers",
    name: "OpenLayers",
    description: "Libreria avanzada para visualizacion cartografica web.",
  },
  {
    id: "python",
    name: "Python",
    description: "Automatizacion, analisis de datos y scripting tecnico.",
  },
  {
    id: "geopandas",
    name: "GeoPandas",
    description: "Analisis geoespacial en Python sobre estructuras tabulares.",
  },
  {
    id: "docker",
    name: "Docker",
    description: "Contenerizacion de aplicaciones y entornos de trabajo.",
  },
  {
    id: "liderazgo",
    name: "Liderazgo",
    description: "Coordinacion de equipos, decisiones y acompanamiento.",
  },
]

export function getSkillCatalog() {
  return skillCatalog
}

export async function getSkill(
  query: string,
  options: GetSkillOptions = {}
): Promise<SkillSearchResult[]> {
  if (options.signal?.aborted) {
    throw new DOMException("Aborted", "AbortError")
  }

  const normalizedQuery = getNormalizedSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  return skillCatalog.filter((skill) =>
    [skill.name, skill.description].some((value) =>
      getNormalizedSearchValue(value).includes(normalizedQuery)
    )
  ).slice(0, 8)
}
