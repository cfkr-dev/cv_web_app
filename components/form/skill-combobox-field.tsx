"use client"

import { Layers3, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { FieldError as HookFormFieldError } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInputControl,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { getNormalizedSearchValue } from "@/lib/utils/general/search"
import { capitalizeSkillWords } from "@/lib/utils/validation/skill"

type SearchItems<Item> = (
  query: string,
  options: { signal?: AbortSignal }
) => Promise<Item[]>

type SkillComboboxFieldProps<Item> = {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder: string
  className?: string
  invalid?: boolean
  error?: HookFormFieldError
  searchItems: SearchItems<Item>
  getItemKey: (item: Item) => string
  getItemName: (item: Item) => string
  getItemDescription: (item: Item) => string
}

type CustomComboboxItem = {
  kind: "custom"
  id: string
  name: string
  description: string
}

type SkillComboboxItem<Item> = Item | CustomComboboxItem

function isCustomItem<Item>(
  item: SkillComboboxItem<Item>
): item is CustomComboboxItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "kind" in item &&
    item.kind === "custom"
  )
}

export function SkillComboboxField<Item>({
  id,
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  className,
  invalid = false,
  error,
  searchItems,
  getItemKey,
  getItemName,
  getItemDescription,
}: SkillComboboxFieldProps<Item>) {
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
      <SkillComboboxControl
        id={id}
        value={currentValue}
        placeholder={placeholder}
        invalid={invalid}
        onValueChange={handleValueChange}
        searchItems={searchItems}
        getItemKey={getItemKey}
        getItemName={getItemName}
        getItemDescription={getItemDescription}
      />
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  )
}

function SkillComboboxControl<Item>({
  id,
  value,
  placeholder,
  invalid,
  onValueChange,
  searchItems,
  getItemKey,
  getItemName,
  getItemDescription,
}: {
  id: string
  value: string
  placeholder: string
  invalid: boolean
  onValueChange: (value: string) => void
  searchItems: SearchItems<Item>
  getItemKey: (item: Item) => string
  getItemName: (item: Item) => string
  getItemDescription: (item: Item) => string
}) {
  const [suggestions, setSuggestions] = useState<Item[]>([])
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SkillComboboxItem<Item> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const normalizedValue = getNormalizedSearchValue(value)

    if (!normalizedValue) {
      setSelectedSuggestion(null)
      return
    }

    const matchingSuggestion =
      suggestions.find(
        (suggestion) =>
          getNormalizedSearchValue(getItemName(suggestion)) === normalizedValue
      ) ?? null

    setSelectedSuggestion(matchingSuggestion)
  }, [getItemName, suggestions, value])

  useEffect(() => {
    if (value.trim().length < 1) {
      setSuggestions([])
      setIsLoading(false)
      setHasError(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setHasError(false)

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

  const trimmedValue = value.trim()
  const customItem = useMemo<CustomComboboxItem | null>(() => {
    if (!trimmedValue) {
      return null
    }

    const normalizedValue = getNormalizedSearchValue(trimmedValue)
    const matchesPredefinedSuggestion = suggestions.some(
      (suggestion) =>
        getNormalizedSearchValue(getItemName(suggestion)) === normalizedValue
    )

    if (matchesPredefinedSuggestion) {
      return null
    }

    return {
      kind: "custom",
      id: `custom:${trimmedValue}`,
      name: trimmedValue,
      description: `Personalizar: "${trimmedValue}"`,
    }
  }, [getItemName, suggestions, trimmedValue])

  const items = useMemo<SkillComboboxItem<Item>[]>(() => {
    if (!customItem) {
      return suggestions
    }

    return [...suggestions, customItem]
  }, [customItem, suggestions])

  const emptyMessage = hasError
    ? "No se pudieron cargar habilidades."
    : isLoading
      ? "Buscando habilidades..."
      : trimmedValue.length < 1
        ? "Escribe al menos 1 caracter."
        : "No se encontraron habilidades."

  return (
    <Combobox<SkillComboboxItem<Item>>
      items={items}
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
      onValueChange={(item) => {
        if (!item) {
          setSelectedSuggestion(null)
          onValueChange("")
          return
        }

        if (isCustomItem(item)) {
          const capitalizedName = capitalizeSkillWords(item.name)

          setSelectedSuggestion(item)
          onValueChange(capitalizedName)
          return
        }

        setSelectedSuggestion(item)
        onValueChange(getItemName(item))
      }}
      itemToStringLabel={(item) =>
        isCustomItem(item) ? item.description : getItemName(item)
      }
      itemToStringValue={(item) =>
        isCustomItem(item) ? item.name : getItemName(item)
      }
      isItemEqualToValue={(item, selected) => {
        if (isCustomItem(item) && isCustomItem(selected)) {
          return item.id === selected.id
        }

        if (!isCustomItem(item) && !isCustomItem(selected)) {
          return getItemKey(item) === getItemKey(selected)
        }

        return false
      }}
      filter={null}
    >
      <div ref={anchorRef}>
        <InputGroup className="overflow-hidden">
          <InputGroupAddon align="inline-start" className="pl-3 pr-2">
            <Layers3 className="size-4" />
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
            {trimmedValue ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1.5 -translate-y-1/2"
                aria-label="Limpiar habilidad"
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
          </div>
        </InputGroup>
      </div>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {customItem ? (
            <>
              <ComboboxItem
                value={customItem}
                index={0}
                className="items-start"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-medium">
                    <Sparkles className="mt-0.5 size-4 shrink-0" />
                    <span className="truncate">{customItem.description}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    Usar exactamente el texto escrito.
                  </p>
                </div>
              </ComboboxItem>
              {suggestions.length > 0 ? (
                <div className="px-1 py-1">
                  <Separator />
                </div>
              ) : null}
            </>
          ) : null}

          {suggestions.map((suggestion, index) => (
            <ComboboxItem
              key={getItemKey(suggestion)}
              value={suggestion}
              index={customItem ? index + 1 : index}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{getItemName(suggestion)}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {getItemDescription(suggestion)}
                </p>
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
