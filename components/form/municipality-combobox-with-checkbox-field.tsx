"use client"

import { MapPin, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { FieldWithCheckboxGroup } from "@/components/form/field-with-checkbox-group"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInputControl,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type SearchItems<Item> = (
  query: string,
  options: { signal?: AbortSignal }
) => Promise<Item[]>

type MunicipalityComboboxWithCheckboxFieldProps<Item> = {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  checked?: boolean
  placeholder: string
  checkedPlaceholder?: string
  checkboxLabel: string
  checkboxId?: string
  checkboxWidthClassName?: string
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  invalid?: boolean
  error?: HookFormFieldError
  searchItems: SearchItems<Item>
  getItemKey: (item: Item) => string
  getItemLabel: (item: Item) => string
  getItemValue: (item: Item) => string
  getItemDescription?: (item: Item) => string
}

export function MunicipalityComboboxWithCheckboxField<Item>({
  id,
  label,
  value,
  defaultValue,
  onValueChange,
  checked,
  placeholder,
  checkedPlaceholder,
  checkboxLabel,
  checkboxId,
  checkboxWidthClassName = "w-[8.5rem] sm:w-[9rem]",
  defaultChecked = false,
  onCheckedChange,
  className,
  invalid = false,
  error,
  searchItems,
  getItemKey,
  getItemLabel,
  getItemValue,
  getItemDescription,
}: MunicipalityComboboxWithCheckboxFieldProps<Item>) {
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
      checkboxLabel={checkboxLabel}
      checkboxId={checkboxId}
      checkboxWidthClassName={checkboxWidthClassName}
      className={className}
      invalid={invalid}
      error={error}
      renderField={({ id, value, disabled, invalid, onValueChange }) => (
        <MunicipalityComboboxControl
          id={id}
          value={value}
          placeholder={placeholder}
          checkedPlaceholder={checkedPlaceholder}
          disabled={disabled}
          invalid={invalid}
          onValueChange={onValueChange}
          searchItems={searchItems}
          getItemKey={getItemKey}
          getItemLabel={getItemLabel}
          getItemValue={getItemValue}
          getItemDescription={getItemDescription}
        />
      )}
    />
  )
}

function MunicipalityComboboxControl<Item>({
  id,
  value,
  placeholder,
  checkedPlaceholder,
  disabled,
  invalid,
  onValueChange,
  searchItems,
  getItemKey,
  getItemLabel,
  getItemValue,
  getItemDescription,
}: {
  id: string
  value: string
  placeholder: string
  checkedPlaceholder?: string
  disabled: boolean
  invalid: boolean
  onValueChange: (value: string) => void
  searchItems: SearchItems<Item>
  getItemKey: (item: Item) => string
  getItemLabel: (item: Item) => string
  getItemValue: (item: Item) => string
  getItemDescription?: (item: Item) => string
}) {
  const [suggestions, setSuggestions] = useState<Item[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const normalizedValue = value.trim().toLocaleLowerCase("es-ES")

    if (!normalizedValue) {
      setSelectedSuggestion(null)
      return
    }

    const matchingSuggestion =
      suggestions.find((suggestion) => {
        const itemValue = getItemValue(suggestion).trim().toLocaleLowerCase("es-ES")

        return itemValue === normalizedValue
      }) ?? null

    setSelectedSuggestion(matchingSuggestion)
  }, [getItemValue, suggestions, value])

  useEffect(() => {
    if (disabled || value.trim().length < 1) {
      setSuggestions([])
      setIsLoading(false)
      setHasError(false)
      return
    }

    setIsLoading(true)
    setHasError(false)

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      try {
        const items = await searchItems(value, { signal: controller.signal })
        setSuggestions(items)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        setSuggestions([])
        setHasError(true)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 500)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [disabled, searchItems, value])

  const emptyMessage = hasError
    ? "No se pudieron cargar municipios."
    : isLoading
      ? "Buscando municipios..."
      : value.trim().length < 1
        ? "Escribe al menos 1 caracter."
        : "No se encontraron municipios."

  return (
    <Combobox
      items={suggestions}
      value={selectedSuggestion}
      inputValue={value}
      onInputValueChange={(nextValue, eventDetails) => {
        if (
          eventDetails.reason !== "input-change" &&
          eventDetails.reason !== "input-clear" &&
          eventDetails.reason !== "clear-press"
        ) {
          return
        }

        setSelectedSuggestion(null)
        onValueChange(nextValue)
      }}
      onValueChange={(suggestion) => {
        setSelectedSuggestion(suggestion)
        onValueChange(suggestion ? getItemValue(suggestion) : "")
      }}
      itemToStringLabel={getItemLabel}
      itemToStringValue={getItemValue}
      isItemEqualToValue={(item, selected) =>
        getItemKey(item) === getItemKey(selected)
      }
      filter={null}
      disabled={disabled}
    >
      <div
        ref={anchorRef}
        data-slot="input-group-control"
        className={`relative flex flex-1 items-center ${disabled ? "bg-input/50" : ""}`}
      >
        <span className="pointer-events-none absolute top-1/2 left-3 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
          <MapPin className="size-4" />
        </span>
        <ComboboxInputControl
          id={id}
          disabled={disabled}
          placeholder={disabled ? "" : placeholder}
          aria-invalid={invalid}
          className="pl-9 pr-10"
        />
        {!disabled && value.trim() ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
            aria-label="Limpiar localizacion"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setSelectedSuggestion(null)
              setSuggestions([])
              setHasError(false)
              onValueChange("")
            }}
          >
            <X className="size-4" />
          </Button>
        ) : null}
        {disabled && checkedPlaceholder ? (
          <span className="pointer-events-none absolute top-1/2 left-9 -translate-y-1/2 text-sm text-muted-foreground">
            {checkedPlaceholder}
          </span>
        ) : null}
      </div>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {suggestions.map((suggestion, index) => (
            <ComboboxItem
              key={getItemKey(suggestion)}
              value={suggestion}
              index={index}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{getItemLabel(suggestion)}</p>
                {getItemDescription?.(suggestion) ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {getItemDescription(suggestion)}
                  </p>
                ) : null}
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
