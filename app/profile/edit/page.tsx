"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import {
  BriefcaseBusiness,
  FilePlus2,
  GraduationCap,
  Layers3,
  Save,
  UserRound,
} from "lucide-react"

import { AsyncActionDialog } from "@/components/dialog/async-action-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Education } from "@/features/profile/edit/components/education"
import { Introduction } from "@/features/profile/edit/components/introduction"
import { PersonalData } from "@/features/profile/edit/components/personal-data"
import { ProfileEditActions } from "@/features/profile/edit/components/profile-edit-actions"
import { Projects } from "@/features/profile/edit/components/projects"
import {
  handleSectionAdd,
  handleSectionDelete,
  handleSectionNavigation,
  isSectionPresent,
  Section,
} from "@/features/profile/edit/components/section"
import { Sidebar } from "@/features/profile/edit/components/sidebar"
import { Skills } from "@/features/profile/edit/components/skills"
import { WorkExperience } from "@/features/profile/edit/components/work-experience"
import { initialSectionsDefault } from "@/features/profile/edit/config/section-defaults"
import { useIntroductionHydration } from "@/features/profile/edit/hooks/use-introduction-hydration"
import { useEducationHydration } from "@/features/profile/edit/hooks/use-education-hydration"
import { usePersonalDataHydration } from "@/features/profile/edit/hooks/use-personal-data-hydration"
import { useSkillsHydration } from "@/features/profile/edit/hooks/use-skills-hydration"
import { useWorkExperienceHydration } from "@/features/profile/edit/hooks/use-work-experience-hydration"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"
import { useGlobalProfileSave } from "@/features/profile/edit/validation/hooks/use-global-profile-save"
import {
  educationSectionFormId,
  personalDataFormId,
  projectsSectionFormId,
  skillsSectionFormId,
  workExperienceSectionFormId,
} from "@/features/profile/edit/validation/config/constants"
import { useElementBottomVisibility } from "@/hooks/use-element-bottom-visibility"

export default function ProfileEditPage() {
  const router = useRouter()
  const [cvSections, setCvSections] = useState(initialSectionsDefault)
  const {
    data: introduction,
    isLoading: isIntroductionLoading,
  } = useIntroductionHydration()
  const {
    data: personalDataInitialData,
    isLoading: isPersonalDataLoading,
  } = usePersonalDataHydration()
  const {
    data: workExperienceInitialData,
    isLoading: isWorkExperienceLoading,
  } = useWorkExperienceHydration()
  const {
    data: educationInitialData,
    isLoading: isEducationLoading,
  } = useEducationHydration()
  const {
    data: skillsInitialData,
    isLoading: isSkillsLoading,
  } = useSkillsHydration()
  const headerRef = useRef<HTMLElement | null>(null)
  const isHeaderVisible = useElementBottomVisibility(headerRef)
  const personalDataRef = useRef<SectionSubmitHandle | null>(null)
  const workExperienceRef = useRef<SectionSubmitHandle | null>(null)
  const educationRef = useRef<SectionSubmitHandle | null>(null)
  const skillsRef = useRef<SectionSubmitHandle | null>(null)
  const projectsRef = useRef<SectionSubmitHandle | null>(null)
  const sectionSubmitRefs = {
    personalDataRef,
    workExperienceRef,
    educationRef,
    skillsRef,
    projectsRef,
  }
  const {
    dialogOpen: globalSaveDialogOpen,
    handleDialogOpenChange: handleGlobalSaveDialogOpenChange,
    handleGlobalSaveClick,
    handleSuccessClose: handleGlobalSaveSuccessClose,
    runGlobalConfirmAction,
  } = useGlobalProfileSave({
    sections: cvSections,
    refs: sectionSubmitRefs,
    router,
  })

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.14),_transparent_24%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_6%,white),_var(--color-background)_24%,_color-mix(in_oklab,var(--color-muted)_64%,white))]">
      <header
        ref={headerRef}
        className="z-40 border-b border-border/60 bg-background/82 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <BriefcaseBusiness className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.68rem] font-medium tracking-[0.26em] text-primary uppercase">
                MyWorkSpace
              </p>
              <p className="truncate font-heading text-lg font-semibold text-foreground">
                Editor de curriculum
              </p>
            </div>
          </div>

          <ProfileEditActions
            onSaveClick={() => void handleGlobalSaveClick()}
            className={
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-2"
            }
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Sidebar
              sections={cvSections}
              onNavigate={handleSectionNavigation}
              onDelete={(key) => handleSectionDelete(key, setCvSections)}
              onAdd={(key, href) => handleSectionAdd(key, href, setCvSections)}
              actionsSlot={
                <ProfileEditActions
                  onSaveClick={() => void handleGlobalSaveClick()}
                  className={
                    isHeaderVisible
                      ? "pointer-events-none max-h-0 overflow-hidden opacity-0 -translate-y-2"
                      : "mb-4 max-h-16 opacity-100 translate-y-0"
                  }
                />
              }
            />
          </aside>

          <div className="space-y-6">
            <Introduction
              data={introduction}
              isLoading={isIntroductionLoading}
            />

            {isPersonalDataLoading ? (
              <Skeleton
                className="w-full rounded-[1.9rem]"
                style={{ height: "24rem" }}
              />
            ) : (
              <Section
                id="datos-personales"
                title="Datos personales"
                description="Informacion principal que aparece en la cabecera publica del perfil."
                icon={<UserRound className="size-5" />}
                showSectionSave
                saveFormId={personalDataFormId}
              >
                <PersonalData
                  ref={personalDataRef}
                  initialData={personalDataInitialData}
                />
              </Section>
            )}

            {isSectionPresent(cvSections, "work-experience") ? (
              isWorkExperienceLoading ? (
                <Skeleton
                  className="w-full rounded-[1.9rem]"
                  style={{ height: "32rem" }}
                />
              ) : (
                <Section
                  id="experiencia"
                  title="Experiencia laboral"
                  description="Puestos, empresas, ubicaciones, fechas y documentos asociados."
                  icon={<BriefcaseBusiness className="size-5" />}
                  showSectionSave
                  saveFormId={workExperienceSectionFormId}
                >
                  <WorkExperience
                    ref={workExperienceRef}
                    initialData={workExperienceInitialData}
                  />
                </Section>
              )
            ) : null}

            {isSectionPresent(cvSections, "education") ? (
              isEducationLoading ? (
                <Skeleton
                  className="w-full rounded-[1.9rem]"
                  style={{ height: "36rem" }}
                />
              ) : (
                <Section
                  id="educacion"
                  title="Educacion"
                  description="Estudios, idiomas, cursos y certificados del curriculum."
                  icon={<GraduationCap className="size-5" />}
                  showSectionSave
                  saveFormId={educationSectionFormId}
                >
                  <Education
                    ref={educationRef}
                    initialData={educationInitialData}
                  />
                </Section>
              )
            ) : null}

            {isSectionPresent(cvSections, "skills") ? (
              isSkillsLoading ? (
                <Skeleton
                  className="w-full rounded-[1.9rem]"
                  style={{ height: "32rem" }}
                />
              ) : (
                <Section
                  id="habilidades"
                  title="Habilidades"
                  description="Grupos de habilidades con nivel y descripcion."
                  icon={<Layers3 className="size-5" />}
                  showSectionSave
                  saveFormId={skillsSectionFormId}
                >
                  <Skills ref={skillsRef} initialData={skillsInitialData} />
                </Section>
              )
            ) : null}

            {isSectionPresent(cvSections, "projects") ? (
              <Section
                id="proyectos"
                title="Proyectos personales"
                description="Proyectos propios con fechas, descripcion y galeria multimedia."
                icon={<FilePlus2 className="size-5" />}
                showSectionSave
                saveFormId={projectsSectionFormId}
              >
                <Projects ref={projectsRef} />
              </Section>
            ) : null}
          </div>
        </div>
      </div>

      <AsyncActionDialog
        open={globalSaveDialogOpen}
        onOpenChange={handleGlobalSaveDialogOpenChange}
        title="Guardar perfil"
        description="Deseas guardar todos los apartados del formulario?"
        actionLabel="Guardar"
        loadingLabel="Guardando"
        successTitle="Perfil guardado"
        successDescription="Los datos del perfil se han guardado correctamente."
        errorTitle="No se pudo guardar el perfil"
        errorDescription="No se han podido guardar todos los apartados. Intentalo de nuevo."
        actionIcon={<Save className="size-4" />}
        onAction={runGlobalConfirmAction}
        onSuccessClose={handleGlobalSaveSuccessClose}
      />
    </main>
  )
}
