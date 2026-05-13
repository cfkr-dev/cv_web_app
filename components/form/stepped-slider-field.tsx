"use client"

import { useMemo, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"

type SteppedSliderFieldProps = {
  id: string
  label: string
  levels: readonly string[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}

export function SteppedSliderField({
  id,
  label,
  levels,
  value,
  defaultValue,
  onChange,
  className,
}: SteppedSliderFieldProps) {
  const normalizedLevels = useMemo(() => [...levels], [levels])
  const fallbackValue = normalizedLevels[0] ?? ""
  const initialValue =
    defaultValue && normalizedLevels.includes(defaultValue)
      ? defaultValue
      : fallbackValue
  const [internalValue, setInternalValue] = useState(initialValue)
  const selectedValue = value ?? internalValue
  const selectedIndex = Math.max(
    0,
    normalizedLevels.findIndex((level) => level === selectedValue)
  )
  const maxIndex = Math.max(normalizedLevels.length - 1, 0)

  function handleValueChange(nextIndexValues: number[]) {
    const nextIndex = nextIndexValues[0] ?? 0
    const nextValue = normalizedLevels[nextIndex] ?? fallbackValue

    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  return (
    <Field className={className}>
      <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {selectedValue || fallbackValue}
          </span>
        </div>

        <div className="px-1">
          <Slider
            id={id}
            value={[selectedIndex]}
            min={0}
            max={maxIndex}
            step={1}
            onValueChange={handleValueChange}
            className="py-2"
          />
        </div>

        <div className="relative mt-3 h-5 px-1 text-xs text-muted-foreground">
          {normalizedLevels.map((level, index) => {
            const isFirst = index === 0
            const isLast = index === normalizedLevels.length - 1

            return (
              <span
                key={level}
                className={[
                  "absolute top-0 min-w-max leading-4",
                  isFirst
                    ? "left-0 text-left"
                    : isLast
                      ? "right-0 text-right"
                      : "-translate-x-1/2 text-center",
                ].join(" ")}
                style={
                  isFirst || isLast
                    ? undefined
                    : {
                        left: `${(index / maxIndex) * 100}%`,
                      }
                }
              >
                {level}
              </span>
            )
          })}
        </div>
      </div>
    </Field>
  )
}
