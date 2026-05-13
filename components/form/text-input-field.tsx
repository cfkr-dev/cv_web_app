"use client"

import type { ChangeEvent, HTMLInputTypeAttribute, ReactNode } from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type TextInputFieldProps = {
  id: string
  name?: string
  label: string
  type?: HTMLInputTypeAttribute
  defaultValue?: string
  placeholder?: string
  maxLength?: number
  description?: string
  className?: string
  icon?: ReactNode
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  inputRef?: (instance: HTMLInputElement | null) => void
  trailingAction?: ReactNode
  invalid?: boolean
  error?: HookFormFieldError
}

export function TextInputField({
  id,
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  maxLength,
  description,
  className,
  icon,
  disabled = false,
  value,
  onChange,
  onBlur,
  inputRef,
  trailingAction,
  invalid = false,
  error,
}: TextInputFieldProps) {
  const inputClassName = cn(icon && "pl-9", trailingAction && "pr-10")
  const inputProps =
    value !== undefined
      ? {
          value,
          onChange: (event: ChangeEvent<HTMLInputElement>) =>
            onChange?.(event.target.value),
        }
      : {
          defaultValue,
        }

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {icon || trailingAction ? (
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute top-1/2 left-3 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
              {icon}
            </span>
          ) : null}
          <Input
            ref={inputRef}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            className={inputClassName}
            aria-invalid={invalid}
            disabled={disabled}
            onBlur={onBlur}
            {...inputProps}
          />
          {trailingAction}
        </div>
      ) : (
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={invalid}
          disabled={disabled}
          onBlur={onBlur}
          {...inputProps}
        />
      )}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}
