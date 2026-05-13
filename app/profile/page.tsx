"use client"

import Image from "next/image"
import Link from "next/link"
import germanIcon from "language-icons/icons/de.svg"
import englishIcon from "language-icons/icons/en.svg"
import spanishIcon from "language-icons/icons/es.svg"
import frenchIcon from "language-icons/icons/fr.svg"
import portugueseIcon from "language-icons/icons/pt.svg"
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
  Globe,
  GraduationCap,
  Languages,
  Layers3,
  LogOut,
  Mail,
  Phone,
  Settings2,
  Share2,
  SquarePen,
  UserRound,
} from "lucide-react"
import { IconLinkedin } from "nucleo-social-media"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ProfileFileGallery,
  type ProfileFileGalleryItem,
} from "@/components/profile-file-gallery"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Progress } from "@/components/ui/progress"
import {
  getLanguageDefinition,
  type Iso6391LanguageCode,
} from "@/lib/utils/general/search/language-definitions"
import { cn } from "@/lib/utils"

const cvNavItems = [
  { href: "#perfil", label: "Datos personales" },
  { href: "#experiencia", label: "Experiencia laboral" },
  { href: "#educacion", label: "Educacion" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#proyectos", label: "Proyectos" },
]

const mainNavItems = [
  { href: "#contactos", label: "Contactos" },
  { href: "#busqueda", label: "Busqueda" },
]

type ExperienceItem = {
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  media?: ProfileFileGalleryItem[]
  subtitle?: string
}

type EducationRecordItem = {
  title: string
  center: string
  location: string
  startDate: string
  endDate: string
  description: string
  media?: ProfileFileGalleryItem[]
}

type ProfileLanguageCode = "de" | "en" | "es" | "fr" | "pt"

type LanguageItem = {
  code: ProfileLanguageCode
  level: string
  media?: ProfileFileGalleryItem[]
}

type SkillLevel = "Principiante" | "Medio" | "Avanzado" | "Experto"

type SkillSortOrder = "none" | "asc" | "desc"

type SkillItem = {
  name: string
  progress: number
  level: SkillLevel
}

type SkillGroup = {
  title: string
  description: string
  skills: SkillItem[]
}

type PersonalProjectItem = {
  name: string
  startDate: string
  endDate: string
  description: string
  media?: ProfileFileGalleryItem[]
}

const languageIconByCode = {
  de: germanIcon,
  en: englishIcon,
  es: spanishIcon,
  fr: frenchIcon,
  pt: portugueseIcon,
} satisfies Record<ProfileLanguageCode, unknown>

const languageNameByCode: Record<ProfileLanguageCode, string> = {
  de: "Aleman",
  en: "Ingles",
  es: "Espanol",
  fr: "Frances",
  pt: "Portugues",
}

const experienceItems: ExperienceItem[] = [
  {
    position: "Product Frontend Developer",
    company: "MyWorkspace Studio",
    location: "Madrid",
    startDate: "01-2023",
    endDate: "Presente",
    subtitle: "Product Frontend Developer · 2023 - Actualidad",
    description:
      "Diseno y construccion de experiencias web orientadas a la presentacion de informacion profesional, con foco en rendimiento, claridad visual y reutilizacion de componentes.",
    media: [
      {
        title: "Captura de interfaz",
        description:
          "Vista general de la interfaz principal creada para presentar informacion profesional de forma clara.",
        type: "Imagen",
        thumbnailSrc: "/media/thumb/1.jpg",
        fileSrc: "/media/files/1.jpg",
      },
      {
        title: "Documento funcional",
        description:
          "Documento PDF con requisitos, decisiones de producto y criterios de validacion usados durante el desarrollo.",
        type: "PDF",
        thumbnailSrc: "/media/thumb/2.png",
        fileSrc: "/media/files/2.pdf",
      },
      {
        title: "Presentacion de producto",
        description:
          "Presentacion preparada para explicar el flujo de usuario, los objetivos del proyecto y los resultados conseguidos.",
        type: "Presentacion",
        thumbnailSrc: "/media/thumb/3.png",
        slideSrcs: [
          "/media/files/3/3-1.png",
          "/media/files/3/3-2.png",
          "/media/files/3/3-3.png",
          "/media/files/3/3-4.png",
          "/media/files/3/3-5.png",
          "/media/files/3/3-6.png",
          "/media/files/3/3-7.png",
          "/media/files/3/3-8.png",
          "/media/files/3/3-9.png",
          "/media/files/3/3-10.png",
        ],
      },
      {
        title: "Pagina publicada",
        description:
          "Enlace de referencia a una pagina web relacionada con el proyecto y su resultado final.",
        type: "Pagina web",
        thumbnailSrc: "/media/thumb/4.png",
        linkHref: "https://www.linkedin.com/in/albperezpe",
      },
    ],
  },
  {
    position: "Frontend Engineer",
    company: "Nova Digital Labs",
    location: "Barcelona",
    startDate: "04-2021",
    endDate: "12-2022",
    subtitle: "Frontend Engineer · 2021 - 2023",
    description:
      "Participacion en proyectos de modernizacion de portales internos y publicos, reorganizando informacion compleja en estructuras mas navegables.",
  },
  {
    position: "UI Developer",
    company: "CartoWeb Solutions",
    location: "Valencia",
    startDate: "09-2019",
    endDate: "03-2021",
    description:
      "Implementacion de interfaces responsive, componentes reutilizables y mejoras de accesibilidad para productos digitales con alto volumen de informacion.",
  },
  {
    position: "Junior Web Developer",
    company: "Pixel Norte",
    location: "Bilbao",
    startDate: "06-2018",
    endDate: "08-2019",
    description:
      "Desarrollo de paginas corporativas, mantenimiento frontend y apoyo en la integracion de formularios, contenidos dinamicos y estilos visuales.",
  },
]

const projectItems: PersonalProjectItem[] = [
  {
    name: "Curriculum Hub",
    startDate: "01-2026",
    endDate: "Presente",
    description:
      "Pagina personal para organizar un CV interactivo con secciones desplegables, galeria multimedia y una estructura preparada para contenido dinamico.",
    media: [
      {
        title: "Vista del perfil",
        description:
          "Captura del proyecto con la composicion general del perfil y sus principales bloques de informacion.",
        type: "Imagen",
        thumbnailSrc: "/media/thumb/1.jpg",
        fileSrc: "/media/files/1.jpg",
      },
      {
        title: "Presentacion del proyecto",
        description:
          "Presentacion con el flujo principal, la organizacion de contenidos y la propuesta de valor del CV interactivo.",
        type: "Presentacion",
        thumbnailSrc: "/media/thumb/3.png",
        slideSrcs: [
          "/media/files/3/3-1.png",
          "/media/files/3/3-2.png",
          "/media/files/3/3-3.png",
          "/media/files/3/3-4.png",
          "/media/files/3/3-5.png",
          "/media/files/3/3-6.png",
          "/media/files/3/3-7.png",
          "/media/files/3/3-8.png",
          "/media/files/3/3-9.png",
          "/media/files/3/3-10.png",
        ],
      },
    ],
  },
  {
    name: "GeoPortfolio",
    startDate: "09-2025",
    endDate: "12-2025",
    description:
      "Aplicacion experimental para presentar proyectos sobre mapa, combinar informacion profesional con ubicaciones y filtrar trabajos por tecnologia o tematica.",
    media: [
      {
        title: "Documento tecnico",
        description:
          "Documento con decisiones de estructura, criterios de visualizacion y posibles mejoras del prototipo GIS.",
        type: "PDF",
        thumbnailSrc: "/media/thumb/2.png",
        fileSrc: "/media/files/2.pdf",
      },
    ],
  },
  {
    name: "Panel de habitos de aprendizaje",
    startDate: "03-2025",
    endDate: "07-2025",
    description:
      "Dashboard personal para registrar cursos, lecturas, practicas tecnicas y objetivos semanales con una visualizacion sencilla del progreso.",
  },
  {
    name: "Landing de comunidad profesional",
    startDate: "10-2024",
    endDate: "02-2025",
    description:
      "Prototipo de pagina para una comunidad de perfiles profesionales, con foco en claridad de lectura, llamadas a la accion y adaptacion responsive.",
    media: [
      {
        title: "Pagina de referencia",
        description:
          "Enlace externo usado como referencia de publicacion y presencia profesional asociada al prototipo.",
        type: "Pagina web",
        thumbnailSrc: "/media/thumb/4.png",
        linkHref: "https://www.linkedin.com/in/albperezpe",
      },
    ],
  },
]

const studyItems: EducationRecordItem[] = [
  {
    title: "Grado en Ingenieria Informatica",
    center: "Universidad Complutense de Madrid",
    location: "Madrid",
    startDate: "09-2019",
    endDate: "06-2023",
    description:
      "Formacion centrada en desarrollo de software, bases de datos, arquitectura web y resolucion metodica de problemas tecnicos.",
    media: [
      {
        title: "Expediente academico",
        description:
          "Documento de ejemplo asociado al estudio con informacion academica y detalle de asignaturas cursadas.",
        type: "PDF",
        thumbnailSrc: "/media/thumb/2.png",
        fileSrc: "/media/files/2.pdf",
      },
    ],
  },
  {
    title: "Master en Desarrollo Web y Aplicaciones GIS",
    center: "Universidad Politecnica de Madrid",
    location: "Madrid",
    startDate: "09-2023",
    endDate: "Presente",
    description:
      "Especializacion en interfaces web modernas, visualizacion geografica, productos digitales y procesamiento de informacion espacial.",
  },
  {
    title: "Bachillerato Tecnologico",
    center: "IES San Isidro",
    location: "Madrid",
    startDate: "09-2017",
    endDate: "06-2019",
    description:
      "Base tecnica previa en matematicas, dibujo tecnico y fundamentos cientificos orientados a estudios superiores de ingenieria.",
  },
]

const languageItems: LanguageItem[] = [
  {
    code: "es",
    level: "Nativo",
  },
  {
    code: "en",
    level: "C1 avanzado",
    media: [
      {
        title: "Certificado de ingles",
        description:
          "Documento acreditativo de nivel avanzado usado como evidencia dentro del perfil profesional.",
        type: "PDF",
        thumbnailSrc: "/media/thumb/2.png",
        fileSrc: "/media/files/2.pdf",
      },
    ],
  },
  {
    code: "fr",
    level: "B2 intermedio alto",
  },
  {
    code: "de",
    level: "B1 intermedio",
  },
  {
    code: "pt",
    level: "A2 basico",
  },
]

const courseItems: EducationRecordItem[] = [
  {
    title: "Certificacion Profesional en React y Next.js",
    center: "OpenWeb Academy",
    location: "Online",
    startDate: "02-2024",
    endDate: "05-2024",
    description:
      "Programa practico orientado a componentes reutilizables, renderizado con Next.js, TypeScript y buenas practicas de entrega frontend.",
    media: [
      {
        title: "Proyecto final",
        description:
          "Captura del proyecto final presentado para validar la certificacion y los criterios tecnicos trabajados.",
        type: "Imagen",
        thumbnailSrc: "/media/thumb/1.jpg",
        fileSrc: "/media/files/1.jpg",
      },
    ],
  },
  {
    title: "Curso de Accesibilidad Web WCAG",
    center: "Design Systems School",
    location: "Online",
    startDate: "10-2023",
    endDate: "12-2023",
    description:
      "Formacion aplicada en semantica HTML, navegacion con teclado, contraste, contenido accesible y revision de interfaces inclusivas.",
  },
  {
    title: "Certificado en Sistemas GIS aplicados a producto digital",
    center: "GeoData Institute",
    location: "Valencia",
    startDate: "03-2022",
    endDate: "06-2022",
    description:
      "Curso especializado en capas geograficas, modelos de datos espaciales y visualizacion de mapas dentro de productos web.",
    media: [
      {
        title: "Pagina del certificado",
        description:
          "Enlace de referencia asociado al certificado y al programa de especializacion realizado.",
        type: "Pagina web",
        thumbnailSrc: "/media/thumb/4.png",
        linkHref: "https://www.linkedin.com/in/albperezpe",
      },
    ],
  },
]

const skillGroups: SkillGroup[] = [
  {
    title: "Tecnologias frontend",
    description:
      "Lenguajes, frameworks y herramientas usadas para construir interfaces web mantenibles.",
    skills: [
      { name: "React", progress: 92, level: "Experto" },
      { name: "Next.js", progress: 86, level: "Avanzado" },
      { name: "TypeScript", progress: 84, level: "Avanzado" },
      { name: "Tailwind CSS", progress: 80, level: "Avanzado" },
      { name: "React Hook Form", progress: 74, level: "Avanzado" },
      { name: "Testing Library", progress: 58, level: "Medio" },
    ],
  },
  {
    title: "Producto y diseno",
    description:
      "Competencias ligadas a claridad visual, experiencia de usuario y sistemas de interfaz.",
    skills: [
      { name: "Jerarquia visual", progress: 88, level: "Avanzado" },
      { name: "Sistemas de diseno", progress: 82, level: "Avanzado" },
      { name: "Accesibilidad", progress: 76, level: "Avanzado" },
      { name: "Wireframing", progress: 68, level: "Medio" },
      { name: "UX writing", progress: 62, level: "Medio" },
      { name: "Investigacion de usuario", progress: 44, level: "Principiante" },
    ],
  },
  {
    title: "GIS y datos",
    description:
      "Habilidades relacionadas con informacion geografica, visualizacion y modelado de datos.",
    skills: [
      { name: "Modelado de datos", progress: 78, level: "Avanzado" },
      { name: "Visualizacion GIS", progress: 72, level: "Avanzado" },
      { name: "PostGIS", progress: 60, level: "Medio" },
      { name: "GeoJSON", progress: 58, level: "Medio" },
      { name: "Mapbox", progress: 52, level: "Medio" },
      { name: "QGIS", progress: 46, level: "Principiante" },
    ],
  },
  {
    title: "Metodologia y colaboracion",
    description:
      "Formas de trabajo aplicadas a entregas iterativas, mantenimiento y comunicacion tecnica.",
    skills: [
      { name: "Analisis funcional", progress: 84, level: "Avanzado" },
      { name: "Documentacion tecnica", progress: 80, level: "Avanzado" },
      { name: "Refactorizacion", progress: 78, level: "Avanzado" },
      { name: "Trabajo iterativo", progress: 74, level: "Avanzado" },
      { name: "Revision de codigo", progress: 66, level: "Medio" },
      { name: "Gestion de incidencias", progress: 56, level: "Medio" },
    ],
  },
]

type ProfileSectionProps = {
  id: string
  title: string
  description: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function ProfileSection({
  id,
  title,
  description,
  defaultOpen = true,
  children,
}: ProfileSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section id={id} className="scroll-mt-28">
      <Collapsible open={open} onOpenChange={setOpen}>
        <Card className="overflow-hidden border-border/70 bg-background/88 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6"
            >
              <div className="space-y-2">
                <div className="space-y-1">
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    {title}
                  </h2>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background">
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="border-t border-border/70 px-5 py-5 sm:px-6">
              {children}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </section>
  )
}

function ProfileSubsection({
  title,
  description,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string
  description: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/18">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
          >
            <div className="flex min-w-0 gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-primary">
                {icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background">
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  open && "rotate-180"
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/70 p-4 sm:p-5">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function ExperienceCard({
  position,
  company,
  location,
  startDate,
  endDate,
  description,
  media,
}: {
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  media?: ProfileFileGalleryItem[]
}) {
  return (
    <article className="rounded-2xl border border-border/70 bg-background/78 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-lg font-semibold text-foreground">
        <span>{position}</span>
        <span className="text-border">|</span>
        <span>{company}</span>
        <span className="text-border">|</span>
        <span>{location}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-primary">
        {startDate} - {endDate}
      </p>
      <div className="my-4 border-t border-border/70" />
      <div className="rounded-xl border border-border/70 bg-muted/18 p-4">
        <p className="text-sm leading-7 text-foreground/85">{description}</p>
      </div>
      {media && media.length > 0 && (
        <div className="mt-5 border-t border-border/70 pt-5">
          <ProfileFileGallery items={media} />
        </div>
      )}
    </article>
  )
}

function PersonalProjectCard({
  name,
  startDate,
  endDate,
  description,
  media,
}: PersonalProjectItem) {
  return (
    <article className="rounded-2xl border border-border/70 bg-background/78 p-5 shadow-sm">
      <h3 className="font-heading text-lg font-semibold text-foreground">
        {name}
      </h3>
      <p className="mt-2 text-sm font-medium text-primary">
        {startDate} - {endDate}
      </p>
      <div className="my-4 border-t border-border/70" />
      <div className="rounded-xl border border-border/70 bg-muted/18 p-4">
        <p className="text-sm leading-7 text-foreground/85">{description}</p>
      </div>
      {media && media.length > 0 && (
        <div className="mt-5 border-t border-border/70 pt-5">
          <ProfileFileGallery items={media} />
        </div>
      )}
    </article>
  )
}

function EducationRecordCard({
  title,
  center,
  location,
  startDate,
  endDate,
  description,
  media,
}: EducationRecordItem) {
  return (
    <article className="rounded-2xl border border-border/70 bg-background/78 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-lg font-semibold text-foreground">
        <span>{title}</span>
        <span className="text-border">|</span>
        <span>{center}</span>
        <span className="text-border">|</span>
        <span>{location}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-primary">
        {startDate} - {endDate}
      </p>
      <div className="my-4 border-t border-border/70" />
      <div className="rounded-xl border border-border/70 bg-muted/18 p-4">
        <p className="text-sm leading-7 text-foreground/85">{description}</p>
      </div>
      {media && media.length > 0 && (
        <div className="mt-5 border-t border-border/70 pt-5">
          <ProfileFileGallery items={media} />
        </div>
      )}
    </article>
  )
}

function LanguageCard({ code, level, media }: LanguageItem) {
  const languageDefinition = getLanguageDefinition(code as Iso6391LanguageCode)
  const languageName = languageNameByCode[code] ?? languageDefinition.name

  return (
    <article className="rounded-2xl border border-border/70 bg-background/78 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background">
          <Image
            src={languageIconByCode[code]}
            alt={`Icono de ${languageName}`}
            width={40}
            height={40}
            className="size-10"
            unoptimized
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-lg font-semibold text-foreground">
          <span>{languageName}</span>
          <span className="text-border">|</span>
          <span>{level}</span>
        </div>
      </div>
      {media && media.length > 0 && (
        <div className="mt-5 border-t border-border/70 pt-5">
          <ProfileFileGallery items={media} />
        </div>
      )}
    </article>
  )
}

function getSkillProgressColor(progress: number) {
  if (progress >= 85) {
    return "bg-emerald-500"
  }

  if (progress >= 70) {
    return "bg-sky-500"
  }

  if (progress >= 50) {
    return "bg-amber-500"
  }

  return "bg-rose-500"
}

function getSkillSortLabel(sortOrder: SkillSortOrder) {
  if (sortOrder === "desc") {
    return "Mayor experiencia primero"
  }

  if (sortOrder === "asc") {
    return "Menor experiencia primero"
  }

  return "Sin filtros aplicados"
}

function SkillGroupSubsection({ title, description, skills }: SkillGroup) {
  const [sortOrder, setSortOrder] = useState<SkillSortOrder>("none")
  const visibleSkills =
    sortOrder === "none"
      ? skills
      : [...skills].sort((firstSkill, secondSkill) =>
          sortOrder === "desc"
            ? secondSkill.progress - firstSkill.progress
            : firstSkill.progress - secondSkill.progress
        )

  return (
    <ProfileSubsection
      title={title}
      description={description}
      icon={<Layers3 className="size-4" />}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 p-3">
        <p className="text-sm font-medium text-muted-foreground">
          {getSkillSortLabel(sortOrder)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={sortOrder === "desc" ? "default" : "outline"}
            aria-pressed={sortOrder === "desc"}
            onClick={() => setSortOrder("desc")}
          >
            Mayor experiencia
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sortOrder === "asc" ? "default" : "outline"}
            aria-pressed={sortOrder === "asc"}
            onClick={() => setSortOrder("asc")}
          >
            Menor experiencia
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={sortOrder === "none"}
            onClick={() => setSortOrder("none")}
          >
            Eliminar filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleSkills.map((skill) => (
          <SkillCard key={skill.name} {...skill} />
        ))}
      </div>
    </ProfileSubsection>
  )
}

function SkillCard({ name, progress, level }: SkillItem) {
  return (
    <article className="rounded-2xl border border-border/70 bg-background/78 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-heading text-lg font-semibold text-foreground">
          {name}
        </h4>
        <span className="rounded-full border border-border/70 bg-muted/22 px-2 py-1 text-xs font-semibold text-foreground">
          {progress}%
        </span>
      </div>

      <Progress
        value={progress}
        aria-label={`${name}: ${progress}%`}
        className="mt-4"
        indicatorClassName={getSkillProgressColor(progress)}
      />

      <p className="mt-3 text-sm font-medium text-muted-foreground">
        Rango: nivel {level.toLowerCase()}
      </p>
    </article>
  )
}

export default function ProfilePage() {
  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.14),_transparent_24%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_6%,white),_var(--color-background)_24%,_color-mix(in_oklab,var(--color-muted)_64%,white))]">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/profile" className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <BriefcaseBusiness className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.68rem] font-medium tracking-[0.26em] text-primary uppercase">
                MyWorkSpace
              </p>
              <p className="truncate font-heading text-lg font-semibold text-foreground">
                Curriculum Hub
              </p>
            </div>
          </Link>

          <NavigationMenu
            viewport={false}
            className="hidden flex-1 justify-center md:flex"
          >
            <NavigationMenuList className="flex flex-wrap justify-center gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-5 text-[0.95rem]">
                  CV
                </NavigationMenuTrigger>
                <NavigationMenuContent className="top-full mt-2 rounded-2xl border border-border/70 bg-popover p-2 text-popover-foreground shadow-lg">
                  <div className="grid w-64 gap-1">
                    {cvNavItems.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <a href={item.href} className="text-sm font-medium">
                          {item.label}
                        </a>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-10 px-5 text-[0.95rem]"
                    )}
                  >
                    <a href={item.href}>{item.label}</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center">
            <Menubar className="border-none bg-transparent p-0">
              <MenubarMenu>
                <MenubarTrigger className="flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/80 p-0 hover:bg-accent data-[state=open]:bg-accent">
                  <UserRound className="size-5" />
                </MenubarTrigger>
                <MenubarContent className="min-w-56 rounded-2xl">
                  <MenubarItem asChild>
                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-2"
                    >
                      <SquarePen className="size-4" />
                      Editar curriculum
                    </Link>
                  </MenubarItem>
                  <MenubarItem className="flex items-center gap-2">
                    <Settings2 className="size-4" />
                    Opciones de perfil
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                    <LogOut className="size-4" />
                    Cerrar sesion
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section id="perfil" className="scroll-mt-28">
          <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,_color-mix(in_oklab,var(--color-primary)_12%,white),_background_45%,_color-mix(in_oklab,var(--color-muted)_70%,white))] shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)]">
            <CardContent className="space-y-6 p-6 sm:p-8 lg:p-10">
              <div className="grid gap-5 xl:grid-cols-[14rem_minmax(0,1fr)_13rem]">
                <div className="mx-auto w-full max-w-[14rem] xl:mx-0">
                  <div className="overflow-hidden rounded-[1.9rem] border border-border/80 bg-background shadow-sm">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src="/profile_default.png"
                        alt="Foto de perfil de Alberto Perez Perez"
                        fill
                        priority
                        sizes="14rem"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-2 sm:p-4">
                  <div className="space-y-3 text-center">
                    <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      Alberto Pérez Pérez
                    </h2>
                    <p className="text-lg font-medium text-primary sm:text-xl">
                      Frontend Developer
                    </p>
                  </div>

                  <div className="border-y border-border/70 py-4 text-center">
                    <p className="text-lg font-semibold text-foreground">
                      Madrid, 28001
                    </p>
                  </div>

                  <div
                    id="contactos"
                    className="grid scroll-mt-28 gap-x-6 gap-y-3 text-center sm:grid-cols-2"
                  >
                    <a
                      href="tel:+34612345678"
                      className="inline-flex items-center justify-center gap-2 text-base font-semibold text-foreground transition hover:text-primary"
                    >
                      <Phone className="size-4 text-primary" />
                      +34 612 345 678
                    </a>
                    <a
                      href="mailto:alberto@myworkspace.dev"
                      className="inline-flex items-center justify-center gap-2 text-base font-semibold text-foreground transition hover:text-primary"
                    >
                      <Mail className="size-4 text-primary" />
                      alberto@myworkspace.dev
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:justify-start">
                  <Link
                    href="https://www.linkedin.com"
                    className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    <IconLinkedin className="size-5 text-primary" />
                    Perfil en LinkedIn
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    <Globe className="size-5 text-primary" />
                    Visitar web
                  </Link>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  >
                    <Share2 className="size-5 text-primary" />
                    Compartir perfil
                  </button>
                </div>
              </div>

              <div className="rounded-[1.9rem] border border-border/70 bg-background/82 p-5 sm:p-6">
                <p className="text-base leading-8 text-foreground/85 sm:text-lg">
                  Frontend developer orientado a producto con experiencia
                  creando experiencias digitales claras, mantenibles y
                  visualmente solidas. Trabajo con foco en jerarquia de
                  informacion, usabilidad, identidad profesional digital y
                  construccion de interfaces que ayudan a comunicar valor con
                  precision.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <ProfileSection
          id="experiencia"
          title="Experiencia laboral"
          description="Puestos, empresas, ubicaciones y responsabilidades principales ordenadas como historial profesional."
        >
          <div className="grid gap-4">
            {experienceItems.map((item) => (
              <ExperienceCard
                key={`${item.company}-${item.position}`}
                {...item}
              />
            ))}
          </div>
        </ProfileSection>

        <ProfileSection
          id="educacion"
          title="Educacion"
          description="Estudios, idiomas, cursos y certificados organizados como bloques desplegables dentro del CV."
        >
          <div className="space-y-4">
            <ProfileSubsection
              title="Estudios"
              description="Formacion academica con centro, ubicacion, fechas, descripcion y archivos asociados cuando existan."
              icon={<GraduationCap className="size-4" />}
            >
              <div className="grid gap-4">
                {studyItems.map((item) => (
                  <EducationRecordCard
                    key={`${item.center}-${item.title}`}
                    {...item}
                  />
                ))}
              </div>
            </ProfileSubsection>

            <ProfileSubsection
              title="Idiomas"
              description="Idiomas con icono ISO 639-1, nombre y nivel de destreza."
              icon={<Languages className="size-4" />}
            >
              <div className="grid gap-4">
                {languageItems.map((item) => (
                  <LanguageCard key={item.code} {...item} />
                ))}
              </div>
            </ProfileSubsection>

            <ProfileSubsection
              title="Cursos y certificados"
              description="Cursos, certificaciones y especializaciones con centro, ubicacion, fechas, descripcion y multimedia opcional."
              icon={<BadgeCheck className="size-4" />}
            >
              <div className="grid gap-4">
                {courseItems.map((item) => (
                  <EducationRecordCard
                    key={`${item.center}-${item.title}`}
                    {...item}
                  />
                ))}
              </div>
            </ProfileSubsection>
          </div>
        </ProfileSection>

        <ProfileSection
          id="habilidades"
          title="Habilidades"
          description="Bloques de habilidades organizados por tematica, con nivel, progreso y filtros independientes por experiencia."
        >
          <div className="space-y-4">
            {skillGroups.map((group) => (
              <SkillGroupSubsection key={group.title} {...group} />
            ))}
          </div>
        </ProfileSection>

        <ProfileSection
          id="proyectos"
          title="Proyectos personales"
          description="Proyectos propios con fechas, descripcion y galeria multimedia opcional."
        >
          <div className="grid gap-4">
            {projectItems.map((item) => (
              <PersonalProjectCard key={item.name} {...item} />
            ))}
          </div>
        </ProfileSection>
      </div>
    </main>
  )
}
