"use client"

import type { ReactNode } from "react"

import { FieldWithCheckboxGroup } from "@/components/form/field-with-checkbox-group"
import { Input } from "@/components/ui/input"

type TextInputWithCheckboxFieldProps = {
  id: string
  label: string
  defaultValue?: string
  placeholder: string
  checkedPlaceholder?: string
  checkboxLabel: string
  checkboxId?: string
  checkboxWidthClassName?: string
  defaultChecked?: boolean
  icon?: ReactNode
  className?: string
}

export function TextInputWithCheckboxField({
  id,
  label,
  defaultValue,
  placeholder,
  checkedPlaceholder,
  checkboxLabel,
  checkboxId,
  checkboxWidthClassName = "w-[8.5rem] sm:w-[9rem]",
  defaultChecked = false,
  icon,
  className,
}: TextInputWithCheckboxFieldProps) {
  return (
    <FieldWithCheckboxGroup
      id={id}
      label={label}
      defaultValue={defaultValue}
      defaultChecked={defaultChecked}
      checkboxLabel={checkboxLabel}
      checkboxId={checkboxId}
      checkboxWidthClassName={checkboxWidthClassName}
      className={className}
      renderField={({ id, value, disabled, onValueChange }) => (
        <div
          data-slot="input-group-control"
          className={`relative flex flex-1 items-center ${disabled ? "bg-input/50" : ""}`}
        >
          {icon ? (
            <span className="pointer-events-none absolute top-1/2 left-3 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
              {icon}
            </span>
          ) : null}
          <Input
            id={id}
            value={value}
            placeholder={disabled ? "" : placeholder}
            disabled={disabled}
            onChange={(event) => onValueChange(event.target.value)}
            className={`h-11 flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-input/50 ${
              icon ? "pl-9" : ""
            }`}
          />
          {disabled && checkedPlaceholder ? (
            <span
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-muted-foreground ${
                icon ? "left-9" : "left-3"
              }`}
            >
              {checkedPlaceholder}
            </span>
          ) : null}
        </div>
      )}
    />
  )
}
