import type {
  SectionKey,
  SectionState,
} from "../types/section"

export type SidebarProps = {
  sections: SectionState[]
  onNavigate: (href: string) => void
  onDelete: (key: SectionKey) => void
  onAdd: (key: SectionKey, href: string) => void
  actionsSlot?: React.ReactNode
}
