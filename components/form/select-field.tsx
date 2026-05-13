"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SelectFieldOption =
  | string
  | {
      value: string
      label: string
    }

type SelectFieldProps = {
  id: string
  label: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  options: readonly SelectFieldOption[]
  className?: string
  icon?: ReactNode
  placeholder?: string
  clearable?: boolean
  invalid?: boolean
  error?: HookFormFieldError
}

function normalizeOption(option: SelectFieldOption) {
  return typeof option === "string"
    ? {
        value: option,
        label: option,
      }
    : option
}

export function SelectField({
  id,
  label,
  defaultValue,
  value,
  onChange,
  options,
  className,
  icon,
  placeholder,
  clearable = false,
  invalid = false,
  error,
}: SelectFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "")
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : uncontrolledValue
  const normalizedOptions = options.map(normalizeOption)

  function handleValueChange(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    onChange?.(nextValue)
  }

  function handleClear() {
    if (!isControlled) {
      setUncontrolledValue("")
    }

    onChange?.("")
  }

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <Select
          value={selectedValue || undefined}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            hideIcon
            aria-invalid={invalid}
            className={cn(icon && "pl-9", "pr-14")}
          >
            <SelectValue placeholder={placeholder ?? label} />
          </SelectTrigger>
          <SelectContent position="popper" align="start">
            {normalizedOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
          {clearable && selectedValue ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="pointer-events-auto"
              aria-label={`Limpiar ${label.toLowerCase()}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
            >
              <X className="size-4" />
            </Button>
          ) : null}
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}
