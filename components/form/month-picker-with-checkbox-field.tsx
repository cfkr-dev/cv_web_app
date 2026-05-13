"use client"

import type { FieldError as HookFormFieldError } from "react-hook-form"

import { FieldWithCheckboxGroup } from "@/components/form/field-with-checkbox-group"
import { MonthPickerField } from "@/components/form/month-picker-field"

type MonthPickerWithCheckboxFieldProps = {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  checked?: boolean
  placeholder?: string
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  checkedLabel: string
  checkboxId?: string
  checkboxWidthClassName?: string
  className?: string
  disabledLabel?: string
  invalid?: boolean
  error?: HookFormFieldError
}

export function MonthPickerWithCheckboxField({
  id,
  label,
  value,
  defaultValue,
  onValueChange,
  checked,
  placeholder = "Selecciona mes y ano",
  defaultChecked = false,
  onCheckedChange,
  checkedLabel,
  checkboxId,
  checkboxWidthClassName = "w-[9.75rem] sm:w-[10.5rem]",
  className,
  disabledLabel,
  invalid = false,
  error,
}: MonthPickerWithCheckboxFieldProps) {
  return (
    <FieldWithCheckboxGroup
      id={id}
      label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      checkboxLabel={checkedLabel}
      checkboxId={checkboxId}
      checkboxWidthClassName={checkboxWidthClassName}
      className={className}
      invalid={invalid}
      error={error}
      renderField={({ id, value, disabled, onValueChange, checked, invalid }) => (
        <MonthPickerField
          id={id}
          label={label}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          disabledLabel={checked ? (disabledLabel ?? checkedLabel) : undefined}
          onChange={onValueChange}
          hideLabel
          invalid={invalid}
        />
      )}
    />
  )
}
