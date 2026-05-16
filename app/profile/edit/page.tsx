"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import { Save } from "lucide-react"

import { AsyncActionDialog } from "@/components/dialog/async-action-dialog"
import { globalProfileSaveDialogTexts } from "@/features/profile/edit/config"
import { ProfileEditHeader } from "@/features/profile/edit/common/header"
import {
  ProfileEditLayout,
  ProfileEditSectionsRenderer,
} from "@/features/profile/edit/common/layout"
import { useSections } from "@/features/profile/edit/common/section"
import { Sidebar } from "@/features/profile/edit/common/sidebar"
import { ProfileEditActions } from "@/features/profile/edit/common/actions"
import {
  useGlobalProfileSave,
  useSectionRegistry,
} from "@/features/profile/edit/form/control"
import { useElementBottomVisibility } from "@/hooks/use-element-bottom-visibility"

export default function ProfileEditPage() {
  const router = useRouter()
  const headerRef = useRef<HTMLElement | null>(null)
  const isHeaderVisible = useElementBottomVisibility(headerRef)
  const { sections, addSection, deleteSection, navigateToSection } = useSections()
  const sectionSubmitRefs = useSectionRegistry()
  const {
    dialogOpen: globalSaveDialogOpen,
    handleDialogOpenChange: handleGlobalSaveDialogOpenChange,
    handleGlobalSaveClick,
    handleSuccessClose: handleGlobalSaveSuccessClose,
    runGlobalConfirmAction,
  } = useGlobalProfileSave({
    sections,
    refs: sectionSubmitRefs,
    router,
  })

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(14,165,164,0.14),_transparent_24%),linear-gradient(180deg,_color-mix(in_oklab,var(--color-primary)_6%,white),_var(--color-background)_24%,_color-mix(in_oklab,var(--color-muted)_64%,white))]">
      <ProfileEditHeader
        headerRef={headerRef}
        isActionsVisible={isHeaderVisible}
        onSaveClick={() => void handleGlobalSaveClick()}
      />

      <ProfileEditLayout
        sidebar={
          <Sidebar
            sections={sections}
            onNavigate={navigateToSection}
            onDelete={deleteSection}
            onAdd={addSection}
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
        }
      >
        <ProfileEditSectionsRenderer
          sections={sections}
          refs={sectionSubmitRefs}
        />
      </ProfileEditLayout>

      <AsyncActionDialog
        open={globalSaveDialogOpen}
        onOpenChange={handleGlobalSaveDialogOpenChange}
        actionIcon={<Save className="size-4" />}
        onAction={runGlobalConfirmAction}
        onSuccessClose={handleGlobalSaveSuccessClose}
        {...globalProfileSaveDialogTexts}
      />
    </main>
  )
}
