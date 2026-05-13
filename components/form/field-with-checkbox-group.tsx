"use client"

import { useState, type ReactNode } from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"

type FieldWithCheckboxGroupRenderProps = {
  id: string
  value: string
  checked: boolean
  disabled: boolean
  invalid: boolean
  onValueChange: (value: string) => void
}

type FieldWithCheckboxGroupProps = {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  checkboxLabel: string
  checkboxId?: string
  checkboxWidthClassName?: string
  className?: string
  invalid?: boolean
  error?: HookFormFieldError
  renderField: (props: FieldWithCheckboxGroupRenderProps) => ReactNode
}

export function FieldWithCheckboxGroup({
  id,
  label,
  value,
  defaultValue = "",
  onValueChange,
  checked,
  defaultChecked = false,
  onCheckedChange,
  checkboxLabel,
  checkboxId,
  checkboxWidthClassName = "w-[8.5rem] sm:w-[9rem]",
  className,
  invalid = false,
  error,
  renderField,
}: FieldWithCheckboxGroupProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const [internalValue, setInternalValue] = useState(
    defaultChecked ? "" : defaultValue
  )
  const [preservedValue, setPreservedValue] = useState(
    defaultChecked ? defaultValue : ""
  )
  const isCheckedControlled = checked !== undefined
  const isValueControlled = value !== undefined
  const currentChecked = isCheckedControlled ? checked : internalChecked
  const currentValue = isValueControlled ? value : internalValue

  function setCheckedState(nextChecked: boolean) {
    if (!isCheckedControlled) {
      setInternalChecked(nextChecked)
    }

    onCheckedChange?.(nextChecked)
  }

  function setValueState(nextValue: string) {
    if (!isValueControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  function handleCheckedChange(nextChecked: boolean) {
    setCheckedState(nextChecked)

    if (nextChecked) {
      setPreservedValue(currentValue)
      setValueState("")
      return
    }

    setValueState(preservedValue)
  }

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="overflow-hidden">
        {renderField({
          id,
          value: currentValue,
          checked: currentChecked,
          disabled: currentChecked,
          invalid,
          onValueChange: setValueState,
        })}
        <InputGroupAddon
          align="inline-end"
          className={`min-h-11 shrink-0 self-stretch border-l border-border/70 px-3 ${checkboxWidthClassName}`}
        >
          <label
            htmlFor={checkboxId ?? `${id}-toggle`}
            className="flex w-full cursor-pointer items-center justify-start gap-2.5 text-sm font-medium text-foreground"
          >
            <Checkbox
              id={checkboxId ?? `${id}-toggle`}
              checked={currentChecked}
              onCheckedChange={(nextChecked) =>
                handleCheckedChange(nextChecked === true)
              }
            />
            <span className="min-w-0 leading-4 whitespace-normal break-words">
              {checkboxLabel}
            </span>
          </label>
        </InputGroupAddon>
      </InputGroup>
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}
