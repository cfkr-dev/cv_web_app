"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronDown,
  FilePlus2,
  FileText,
  FolderGit2,
  LogOut,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react"
import { forwardRef, useImperativeHandle } from "react"
import {
  Controller,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form"

import { AsyncActionDialog } from "components/dialog/async-action-dialog"
import {
  CollapsibleDeletableItem,
  CollapsibleDeletableItemList,
} from "components/collapsible-deletable-item-list"
import { MonthPickerField } from "components/form/month-picker-field"
import { MonthPickerWithCheckboxField } from "components/form/month-picker-with-checkbox-field"
import { TextInputField } from "components/form/text-input-field"
import { TextareaField } from "components/form/textarea-field"
import { Button } from "components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { MultimediaEditorList } from "@/features/multimedia/edit/components/multimedia"
import { createDefaultMultimediaFormValues } from "@/features/multimedia/edit/validation/config/defaults"
import { ParticipantsDataTable } from "@/features/social/participants/edit/components/participants-data-table"
import { fakeProjectParticipantRecords } from "@/features/social/participants/edit/type/participant-table"
import { UsersMultiSearchCombobox } from "@/features/social/search/multiple/components/users-multi-search-combobox"
import {
  createDefaultCollaborationProjectFormValues,
  createDefaultProjectFormValues,
} from "@/features/profile/edit/validation/config/defaults"
import {
  profileSectionSaveDialogTexts,
  projectsItemDescriptionMaxLength,
  projectsItemNameMaxLength,
  projectsSectionFormId,
} from "@/features/profile/edit/validation/config/constants"
import {
  ProjectsSectionFormValues,
  projectsSectionSchema,
} from "@/features/profile/edit/validation/schemas/projects"
import { ParticipantsAvatarGroup } from "@/features/social/participants/simple/components/participants-avatar-group"
import type { ParticipantsAvatarGroupParticipant } from "@/features/social/participants/simple/types/participants-avatar-group"
import { getUserImageById } from "@/lib/services/user/user-image"
import { getUserInfoById } from "@/lib/services/user/user-info"
import { formatMonth } from "@/lib/utils/general/date"
import { useValidatedPrependFieldArray } from "@/hooks/use-validated-prepend-field-array"
import { fakeRequest } from "@/lib/services/mock/fake-request"
import {
  submitSection,
  validateSection,
} from "@/features/profile/edit/validation/helpers/section-submit"
import { useProfileSectionSave } from "@/features/profile/edit/validation/hooks/use-profile-section-save"
import type { SectionSubmitHandle } from "@/features/profile/edit/types/section-submit"
import { useFormCollapsibleState } from "@/hooks/use-form-collapsible-state"

const collaborationProjects = [
  {
    id: "collaboration-project-1",
    name: "Geoportal de recursos vecinales",
    description:
      "Proyecto colaborativo para organizar capas, puntos de interes y fichas de recursos comunitarios dentro de un mapa compartido.",
    start: "2024-09",
    end: "",
    isCurrent: true,
  },
  {
    id: "collaboration-project-2",
    name: "Cuadro de seguimiento ambiental",
    description:
      "Panel desarrollado junto a otros perfiles tecnicos para visualizar indicadores ambientales, series temporales y alertas operativas.",
    start: "2023-02",
    end: "2023-11",
    isCurrent: false,
  },
] as const

const collaborationProjectParticipants: Record<
  string,
  ParticipantsAvatarGroupParticipant[]
> = {
  "collaboration-project-1": [
    "participant-1",
    "participant-2",
    "participant-3",
    "participant-4",
    "participant-5",
    "participant-9",
    "participant-10",
    "participant-11",
    "participant-12",
    "participant-13",
    "participant-14",
    "participant-15",
    "participant-16",
    "participant-17",
    "participant-18",
    "participant-19",
    "participant-20",
    "participant-21",
    "participant-22",
    "participant-23",
    "participant-24",
    "participant-25",
    "participant-26",
    "participant-27",
    "participant-28",
  ],
  "collaboration-project-2": [
    "participant-6",
    "participant-7",
    "participant-8",
  ],
}

export const Projects = forwardRef<SectionSubmitHandle>(function Projects(_, ref) {
  const form = useForm<ProjectsSectionFormValues>({
    resolver: zodResolver(projectsSectionSchema),
    defaultValues: {
      collaborationProjects: collaborationProjects.map((project) => ({
        ...createDefaultCollaborationProjectFormValues(),
        ...project,
      })),
      removedCollaborationProjectIds: [],
      projects: [createDefaultProjectFormValues()],
    },
  })
  const { getValues, handleSubmit, reset, setValue } = form
  const visibleCollaborationProjects =
    useWatch({
      control: form.control,
      name: "collaborationProjects",
    }) ?? []
  const removedCollaborationProjectIds =
    useWatch({
      control: form.control,
      name: "removedCollaborationProjectIds",
    }) ?? []
  const {
    clearValidationStatePreservingValues,
    dialogOpen,
    handleDialogOpenChange,
    handleInvalidSubmit,
    openConfirmDialog,
    runConfirmAction,
  } = useProfileSectionSave({
    getValues,
    reset,
    onConfirmAction: fakeRequest,
  })
  useImperativeHandle(ref, () => ({
    clearValidationStatePreservingValues,
    validate: (options) =>
      validateSection({
        handleSubmit,
        formId: projectsSectionFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
    submit: (options) =>
      submitSection({
        handleSubmit,
        onValidSubmit: runConfirmAction,
        formId: projectsSectionFormId,
        focusOnInvalid: options?.focusOnInvalid,
      }),
  }))
  const {
    fields: projectFields,
    remove: removeProject,
    handleAddItem: handleAddProjectItem,
  } = useValidatedPrependFieldArray({
    form,
    name: "projects",
    createItem: createDefaultProjectFormValues,
    validationErrorToast: {
      title: "No se puede anadir otro proyecto",
      description:
        "Rellena correctamente el formulario ya creado para anadir otro proyecto.",
    },
  })

  function handleRemoveCollaborationProject(projectId: string) {
    if (removedCollaborationProjectIds.includes(projectId)) {
      return
    }

    setValue(
      "removedCollaborationProjectIds",
      [...removedCollaborationProjectIds, projectId],
      {
        shouldDirty: true,
      }
    )
  }

  return (
    <>
      <div className="space-y-5">
        <ProjectsSubsection
          title="Proyectos en colaboracion"
          icon={<FolderGit2 className="size-4" />}
          formId={projectsSectionFormId}
        >
          {visibleCollaborationProjects.filter(
            (project) => !removedCollaborationProjectIds.includes(project.id)
          ).length ? (
            <div className="space-y-4">
              {visibleCollaborationProjects
                .filter(
                  (project) => !removedCollaborationProjectIds.includes(project.id)
                )
                .map((project) => (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-border/70 bg-background/78 p-4 shadow-sm sm:p-5"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1 space-y-2">
                          <h3 className="font-heading text-lg font-semibold text-foreground">
                            {project.name}
                          </h3>
                          <p className="text-sm font-medium text-sky-700">
                            {formatMonth(project.start)} -{" "}
                            {project.isCurrent
                              ? "En progreso"
                              : formatMonth(project.end)}
                          </p>
                        </div>

                        <div className="flex shrink-0 justify-end">
                          <AsyncActionDialog
                            trigger={
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                aria-label={`Abandonar proyecto ${project.name}`}
                                title={`Abandonar proyecto ${project.name}`}
                              >
                                <LogOut className="size-4" />
                                Abandonar proyecto
                              </Button>
                            }
                            title="Abandonar proyecto"
                            description="Estas seguro de abandonar este proyecto colaborativo?"
                            actionLabel="Abandonar proyecto"
                            loadingLabel="Abandonando"
                            successTitle="Proyecto abandonado"
                            successDescription="El proyecto se ha marcado para abandonar correctamente."
                            errorTitle="No se pudo abandonar el proyecto"
                            errorDescription="No se ha podido marcar el proyecto para abandonar. Intentalo de nuevo."
                            actionIcon={<LogOut className="size-4" />}
                            actionVariant="destructive"
                            onAction={fakeRequest}
                            onSuccessClose={() =>
                              handleRemoveCollaborationProject(project.id)
                            }
                          />
                        </div>
                      </div>

                      <div className="border-t border-border/70 pt-4">
                        <p className="text-sm leading-6 text-muted-foreground">
                          {project.description}
                        </p>
                      </div>

                      <div className="border-t border-border/70 pt-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-foreground">
                            Colaboradores
                          </h4>
                          <ParticipantsAvatarGroup
                            participants={
                              collaborationProjectParticipants[project.id] ?? []
                            }
                            getUserInfoById={getUserInfoById}
                            getUserImageById={getUserImageById}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          ) : (
            <p className="text-center text-sm leading-6 text-muted-foreground">
              No hay proyectos en los que colabores.
            </p>
          )}
        </ProjectsSubsection>

        <ProjectsSubsection
          title="Proyectos creados por mi"
          icon={<Sparkles className="size-4" />}
          formId={projectsSectionFormId}
        >
          <form
            id={projectsSectionFormId}
            className="space-y-5"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              void submitSection({
                handleSubmit,
                formId: projectsSectionFormId,
                onInvalid: handleInvalidSubmit,
                onValidSubmit: () => {
                  openConfirmDialog()
                  return true
                },
              })
            }}
          >
            <CollapsibleDeletableItemList
              addLabel="Anadir proyecto"
              onAdd={() => void handleAddProjectItem()}
              className="space-y-5"
              listClassName="space-y-5"
            >
              {projectFields.map((field, index) => (
                <ProjectItem
                  key={field.id}
                  form={form}
                  index={index}
                  onDelete={() => removeProject(index)}
                  onSetValue={setValue}
                />
              ))}
            </CollapsibleDeletableItemList>
          </form>
        </ProjectsSubsection>
      </div>

      <AsyncActionDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        actionIcon={<Save className="size-4" />}
        onAction={runConfirmAction}
        {...profileSectionSaveDialogTexts}
      />
    </>
  )
})

function ProjectsSubsection({
  title,
  icon,
  formId,
  children,
}: {
  title: string
  icon: React.ReactNode
  formId?: string
  children: React.ReactNode
}) {
  const { open, setOpen } = useFormCollapsibleState(formId)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-muted/14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-primary">{icon}</span>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {title}
              </h3>
            </button>
          </CollapsibleTrigger>

          <CollapsibleTrigger asChild>
            <button
              type="button"
              aria-label={`Alternar ${title.toLowerCase()}`}
              className="group flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent forceMount className="data-[state=closed]:hidden">
          <div className="p-4 sm:p-5">{children}</div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  )
}

function ProjectItem({
  form,
  index,
  onDelete,
  onSetValue,
}: {
  form: UseFormReturn<ProjectsSectionFormValues>
  index: number
  onDelete: () => void
  onSetValue: UseFormReturn<ProjectsSectionFormValues>["setValue"]
}) {
  const { control } = form
  const prefix = `project-${index + 1}`
  const description =
    useWatch({
      control,
      name: `projects.${index}.description`,
    }) ?? ""
  const isCurrent =
    useWatch({
      control,
      name: `projects.${index}.isCurrent`,
    }) ?? false

  return (
    <CollapsibleDeletableItem
      title={`Proyecto ${index + 1}`}
      collapsible
      expandOnFormId={projectsSectionFormId}
      deleteAction={
        <AsyncActionDialog
          trigger={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              title={`Eliminar proyecto ${index + 1}`}
              aria-label={`Eliminar proyecto ${index + 1}`}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar proyecto"
          description="Estas seguro de eliminar este proyecto personal? Esta accion sera irreversible."
          actionLabel="Eliminar proyecto"
          loadingLabel="Eliminando"
          successTitle="Proyecto eliminado"
          successDescription="El proyecto se ha eliminado correctamente."
          errorTitle="No se pudo eliminar el proyecto"
          errorDescription="No se ha podido eliminar el proyecto. Intentalo de nuevo."
          actionIcon={<Trash2 className="size-4" />}
          actionVariant="destructive"
          onAction={fakeRequest}
          onSuccessClose={onDelete}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name={`projects.${index}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <TextInputField
              id={`${prefix}-name`}
              name={field.name}
              label="Nombre"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              placeholder="Nombre del proyecto"
              className="sm:col-span-2"
              icon={<FilePlus2 className="size-4" />}
              maxLength={projectsItemNameMaxLength}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`projects.${index}.start`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerField
              id={`${prefix}-start-date`}
              label="Fecha inicio"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Selecciona mes y ano"
              className="self-start"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`projects.${index}.end`}
          control={control}
          render={({ field, fieldState }) => (
            <MonthPickerWithCheckboxField
              id={`${prefix}-end-date`}
              label="Fecha fin"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              checked={isCurrent}
              onCheckedChange={(checked) =>
                onSetValue(`projects.${index}.isCurrent`, checked, {
                  shouldValidate: true,
                })
              }
              placeholder="Selecciona mes y ano"
              checkedLabel="Proyecto activo"
              checkboxId={`${prefix}-current`}
              className="self-start"
              disabledLabel="Proyecto activo"
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />

        <Controller
          name={`projects.${index}.description`}
          control={control}
          render={({ field, fieldState }) => (
            <TextareaField
              id={`${prefix}-description`}
              name={field.name}
              label="Descripcion"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              textareaRef={field.ref}
              placeholder="Describe el alcance, resultado o tecnologias utilizadas"
              className="sm:col-span-2"
              icon={<FileText className="size-4" />}
              maxLength={projectsItemDescriptionMaxLength}
              rows={4}
              autoResize
              maxAutoResizeHeightPx={320}
              characterCountLabel={`${description.length}/${projectsItemDescriptionMaxLength} caracteres`}
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
          )}
        />
      </div>

      <div className="my-5 space-y-2 border-t border-border/70 pt-5">
        <h4 className="font-heading text-lg font-semibold text-foreground">
          Participantes
        </h4>
        <p className="text-sm text-muted-foreground">
          Gestiona colaboradores, revisa su estado y elimina accesos desde esta
          tabla.
        </p>
      </div>

      <div className="space-y-2 pt-1 mb-6">
        <div className="space-y-1">
          <h5 className="text-sm font-semibold text-foreground">
            Anadir nuevos colaboradores
          </h5>
          <p className="text-sm text-muted-foreground">
            Busca usuarios y preparalos para anadirlos al proyecto.
          </p>
        </div>
        <UsersMultiSearchCombobox />
      </div>

      <div className="pt-1">
        <ParticipantsDataTable participants={fakeProjectParticipantRecords} />
      </div>

      <MultimediaEditorList
        form={form}
        itemsName={`projects.${index}.media`}
        itemIdPrefix={`project-${index + 1}-media`}
        createItemAction={createDefaultMultimediaFormValues}
        className="mt-5 border-t border-border/70 pt-5"
      />
    </CollapsibleDeletableItem>
  )
}
