"use client"

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type MonthPickerFieldProps = {
  id: string
  label: string
  defaultValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  disabledLabel?: string
  className?: string
  onChange?: (value: string) => void
  hideLabel?: boolean
  invalid?: boolean
  error?: HookFormFieldError
}

function parseMonthValue(value?: string) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return null
  }

  const [year, month] = value.split("-").map(Number)
  const date = new Date(year, month - 1, 1)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1) {
    return null
  }

  return date
}

function formatDisplayMonth(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    year: "numeric",
  }).format(date)
}

function formatMonthLabel(monthIndex: number) {
  const label = new Intl.DateTimeFormat("es-ES", {
    month: "short",
  }).format(new Date(2000, monthIndex, 1))

  return label.charAt(0).toUpperCase() + label.slice(1)
}

function getMonthValue(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1)
}

function formatMonthValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")

  return `${year}-${month}`
}

export function MonthPickerField({
  id,
  label,
  defaultValue,
  value,
  placeholder = "Selecciona mes y ano",
  disabled = false,
  disabledLabel,
  className,
  onChange,
  hideLabel = false,
  invalid = false,
  error,
}: MonthPickerFieldProps) {
  const isControlled = value !== undefined
  const initialDate = parseMonthValue(value ?? defaultValue)
  const [open, setOpen] = useState(false)
  const [internalSelectedMonth, setInternalSelectedMonth] = useState<Date | undefined>(
    initialDate ?? undefined
  )
  const selectedMonth = isControlled
    ? (parseMonthValue(value) ?? undefined)
    : internalSelectedMonth
  const [viewedYear, setViewedYear] = useState(
    initialDate?.getFullYear() ?? new Date().getFullYear()
  )
  const [yearSelectorOpen, setYearSelectorOpen] = useState(false)

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthDate = getMonthValue(viewedYear, index)

    return {
      value: monthDate,
      label: formatMonthLabel(index),
      isSelected:
        selectedMonth?.getFullYear() === viewedYear &&
        selectedMonth.getMonth() === index,
    }
  })
  const yearOptions = Array.from({ length: 12 }, (_, index) => viewedYear - 5 + index)

  const hasDisabledLabel = disabled && Boolean(disabledLabel)
  const showsVisualPlaceholder = !selectedMonth && (hasDisabledLabel || !disabled)
  const displayLabel = selectedMonth
      ? formatDisplayMonth(selectedMonth)
      : hasDisabledLabel
        ? disabledLabel
      : placeholder

  function updateSelectedMonth(nextDate?: Date) {
    if (!isControlled) {
      setInternalSelectedMonth(nextDate)
    }

    onChange?.(nextDate ? formatMonthValue(nextDate) : "")
  }

  const trigger = (
    <PopoverTrigger asChild>
      <button
        id={id}
        type="button"
        disabled={disabled}
        data-slot="input-group-control"
        data-empty={!selectedMonth && !disabledLabel}
        data-invalid={invalid}
        className={cn(
          "flex h-11 flex-1 items-center gap-2 px-3 text-left text-sm font-normal outline-none disabled:cursor-not-allowed",
          showsVisualPlaceholder && "text-muted-foreground",
          disabled && "bg-input/50 text-muted-foreground"
        )}
      >
        <CalendarDays className="size-4 shrink-0" />
        <span className="truncate">{displayLabel}</span>
      </button>
    </PopoverTrigger>
  )

  const picker = (
    <>
      <Popover open={disabled ? false : open} onOpenChange={setOpen}>
        {hideLabel ? trigger : <InputGroup className="overflow-hidden">{trigger}</InputGroup>}

        <PopoverContent className="w-auto p-0" align="start">
          <div className="w-[19rem] p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Ano anterior"
                onClick={() => setViewedYear((currentYear) => currentYear - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm font-medium text-foreground outline-none transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => setYearSelectorOpen((currentOpen) => !currentOpen)}
              >
                {viewedYear}
              </button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Ano siguiente"
                onClick={() => setViewedYear((currentYear) => currentYear + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {yearSelectorOpen ? (
              <div className="grid grid-cols-3 gap-2">
                {yearOptions.map((year) => (
                  <Button
                    key={year}
                    type="button"
                    variant={year === viewedYear ? "default" : "outline"}
                    className="h-10 justify-center"
                    onClick={() => {
                      setViewedYear(year)
                      setYearSelectorOpen(false)
                    }}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {monthOptions.map((month) => (
                  <Button
                    key={`${viewedYear}-${month.label}`}
                    type="button"
                    variant={month.isSelected ? "default" : "outline"}
                    className="h-10 justify-center"
                    onClick={() => {
                      updateSelectedMonth(month.value)
                      setViewedYear(month.value.getFullYear())
                      setOpen(false)
                    }}
                  >
                    {month.label}
                  </Button>
                ))}
              </div>
            )}

            {selectedMonth ? (
              <div className="mt-3 border-t border-border pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    updateSelectedMonth(undefined)
                    setViewedYear(new Date().getFullYear())
                    setOpen(false)
                  }}
                >
                  Limpiar fecha
                </Button>
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </>
  )

  if (hideLabel) {
    return picker
  }

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {picker}
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}
