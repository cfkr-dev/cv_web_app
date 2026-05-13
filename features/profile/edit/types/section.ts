import React from "react"

export type SectionKey = "work-experience" | "education" | "skills" | "projects"

export type SectionState = {
  key: SectionKey
  href: string
  label: string
  present: boolean
}

export type SectionProps = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  actionLabel?: string
  showSectionSave?: boolean
  saveFormId?: string
  children: React.ReactNode
}
