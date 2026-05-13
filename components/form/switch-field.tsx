"use client"

import type { ReactNode } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type SwitchFieldProps = {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode
  onText?: string
  offText?: string
  textWidthClassName?: string
}

export function SwitchField({
  id,
  label,
  checked,
  onCheckedChange,
  className,
  checkedIcon,
  uncheckedIcon,
  onText = "Activado",
  offText = "Desactivado",
  textWidthClassName = "w-[4.75rem]",
}: SwitchFieldProps) {
  const currentIcon = checked ? checkedIcon : uncheckedIcon

  return (
    <Field className={cn("items-start", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <label
        htmlFor={id}
        className="inline-flex h-11 w-fit max-w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-3"
      >
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-4 shrink-0 items-center justify-center">
            {currentIcon}
          </span>
          <span className={cn("shrink-0", textWidthClassName)}>
            {checked ? onText : offText}
          </span>
        </span>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </label>
    </Field>
  )
}
