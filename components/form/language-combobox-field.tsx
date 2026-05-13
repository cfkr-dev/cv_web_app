"use client"

import { Languages, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { LanguageIcon } from "@/components/ui/language-icon"
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

type LanguageComboboxFieldProps<Item> = {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onItemSelect?: (item: Item | null) => void
  placeholder: string
  className?: string
  invalid?: boolean
  error?: HookFormFieldError
  searchItems: SearchItems<Item>
  getItemKey: (item: Item) => string
  getItemNativeName: (item: Item) => string
  getItemEnglishName: (item: Item) => string
  getItemIconCode: (item: Item) => string
}

export function LanguageComboboxField<Item>({
  id,
  label,
  value,
  defaultValue,
  onValueChange,
  onItemSelect,
  placeholder,
  className,
  invalid = false,
  error,
  searchItems,
  getItemKey,
  getItemNativeName,
  getItemEnglishName,
  getItemIconCode,
}: LanguageComboboxFieldProps<Item>) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const currentValue = value ?? internalValue

  function handleValueChange(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  return (
    <Field className={className} data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <LanguageComboboxControl
        id={id}
        value={currentValue}
        placeholder={placeholder}
        invalid={invalid}
        onValueChange={handleValueChange}
        onItemSelect={onItemSelect}
        searchItems={searchItems}
        getItemKey={getItemKey}
        getItemNativeName={getItemNativeName}
        getItemEnglishName={getItemEnglishName}
        getItemIconCode={getItemIconCode}
      />
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}

function LanguageComboboxControl<Item>({
  id,
  value,
  placeholder,
  invalid,
  onValueChange,
  onItemSelect,
  searchItems,
  getItemKey,
  getItemNativeName,
  getItemEnglishName,
  getItemIconCode,
}: {
  id: string
  value: string
  placeholder: string
  invalid: boolean
  onValueChange: (value: string) => void
  onItemSelect?: (item: Item | null) => void
  searchItems: SearchItems<Item>
  getItemKey: (item: Item) => string
  getItemNativeName: (item: Item) => string
  getItemEnglishName: (item: Item) => string
  getItemIconCode: (item: Item) => string
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
        const nativeName = getItemNativeName(suggestion)
          .trim()
          .toLocaleLowerCase("es-ES")
        const englishName = getItemEnglishName(suggestion)
          .trim()
          .toLocaleLowerCase("es-ES")

        return (
          nativeName === normalizedValue || englishName === normalizedValue
        )
      }) ?? null

    setSelectedSuggestion(matchingSuggestion)
  }, [getItemEnglishName, getItemNativeName, suggestions, value])

  useEffect(() => {
    if (value.trim().length < 1) {
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
  }, [searchItems, value])

  const emptyMessage = hasError
    ? "No se pudieron cargar idiomas."
    : isLoading
      ? "Buscando idiomas..."
      : value.trim().length < 1
        ? "Escribe al menos 1 caracter."
        : "No se encontraron idiomas."

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
        onItemSelect?.(null)
        onValueChange(nextValue)
      }}
      onValueChange={(suggestion) => {
        setSelectedSuggestion(suggestion)
        onItemSelect?.(suggestion)
        onValueChange(suggestion ? getItemNativeName(suggestion) : "")
      }}
      itemToStringLabel={getItemNativeName}
      itemToStringValue={getItemNativeName}
      isItemEqualToValue={(item, selected) =>
        getItemKey(item) === getItemKey(selected)
      }
      filter={null}
    >
      <div ref={anchorRef}>
        <InputGroup className="overflow-hidden">
          <InputGroupAddon align="inline-start" className="pl-3 pr-2">
            {selectedSuggestion ? (
              <LanguageIcon
                code={getItemIconCode(selectedSuggestion)}
                alt={getItemNativeName(selectedSuggestion)}
                className="size-5 shrink-0 rounded-full"
              />
            ) : (
              <Languages className="size-4" />
            )}
          </InputGroupAddon>
          <div
            data-slot="input-group-control"
            className="relative flex flex-1 items-center"
          >
            <ComboboxInputControl
              id={id}
              placeholder={placeholder}
              aria-invalid={invalid}
              className="pr-10"
            />
            {value.trim() ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1.5 -translate-y-1/2"
                aria-label="Limpiar idioma"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSelectedSuggestion(null)
                  setSuggestions([])
                  setHasError(false)
                  onItemSelect?.(null)
                  onValueChange("")
                }}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
        </InputGroup>
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
              <div className="flex min-w-0 items-center gap-4 pl-1">
                <LanguageIcon
                  code={getItemIconCode(suggestion)}
                  alt={getItemNativeName(suggestion)}
                  className="size-5 shrink-0 rounded-full"
                />
                <p className="truncate font-medium">
                  {getItemNativeName(suggestion)}
                </p>
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
