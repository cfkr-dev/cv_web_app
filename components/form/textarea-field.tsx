"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type ReactNode,
} from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type TextareaFieldProps = {
  id: string
  name?: string
  label: string
  defaultValue?: string
  placeholder?: string
  className?: string
  icon?: ReactNode
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  textareaRef?: (instance: HTMLTextAreaElement | null) => void
  maxLength?: number
  rows?: number
  resizable?: boolean
  maxResizeHeightClassName?: string
  autoResize?: boolean
  maxAutoResizeHeightPx?: number
  characterCountLabel?: string
  invalid?: boolean
  error?: HookFormFieldError
}

function resizeTextareaToContent(
  textarea: HTMLTextAreaElement,
  maxHeightPx: number
) {
  textarea.style.height = "auto"

  const scrollHeight = textarea.scrollHeight
  const nextHeight = Math.min(scrollHeight, maxHeightPx)

  textarea.style.height = `${nextHeight}px`
  textarea.style.overflowY = scrollHeight > maxHeightPx ? "auto" : "hidden"
}

export function TextareaField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
  className,
  icon,
  value,
  onChange,
  onBlur,
  textareaRef: externalTextareaRef,
  maxLength,
  rows,
  resizable = false,
  maxResizeHeightClassName,
  autoResize = false,
  maxAutoResizeHeightPx = 416,
  characterCountLabel,
  invalid = false,
  error,
}: TextareaFieldProps) {
  const internalTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const setTextareaRefs = useCallback(
    (textarea: HTMLTextAreaElement | null) => {
      internalTextareaRef.current = textarea
      externalTextareaRef?.(textarea)
    },
    [externalTextareaRef]
  )

  useEffect(() => {
    if (!autoResize || !internalTextareaRef.current) {
      return
    }

    resizeTextareaToContent(internalTextareaRef.current, maxAutoResizeHeightPx)
  }, [autoResize, defaultValue, maxAutoResizeHeightPx, value])

  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (autoResize) {
      resizeTextareaToContent(event.currentTarget, maxAutoResizeHeightPx)
    }

    onChange?.(event.target.value)
  }

  const textareaProps =
    value !== undefined
      ? {
          value,
          onChange: handleTextareaChange,
        }
      : {
          defaultValue,
          onChange: handleTextareaChange,
        }
  const resizeClassName = autoResize
    ? "resize-none overflow-hidden"
    : resizable
      ? `resize-y overflow-y-auto ${maxResizeHeightClassName ?? ""}`
      : ""
  const textareaClassName = cn(icon && "pl-9", resizeClassName)

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {icon ? (
        <div className="relative">
          <span className="pointer-events-none absolute top-3 left-3 flex size-4 items-center justify-center text-muted-foreground">
            {icon}
          </span>
          <Textarea
            ref={setTextareaRefs}
            id={id}
            name={name}
            placeholder={placeholder}
            className={textareaClassName}
            maxLength={maxLength}
            rows={rows}
            aria-invalid={invalid}
            onBlur={onBlur}
            {...textareaProps}
          />
        </div>
      ) : (
        <Textarea
          ref={setTextareaRefs}
          id={id}
          name={name}
          placeholder={placeholder}
          className={textareaClassName}
          maxLength={maxLength}
          rows={rows}
          aria-invalid={invalid}
          onBlur={onBlur}
          {...textareaProps}
        />
      )}
      {characterCountLabel ? (
        <div className="flex justify-end text-xs font-medium text-muted-foreground">
          {characterCountLabel}
        </div>
      ) : null}
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}
