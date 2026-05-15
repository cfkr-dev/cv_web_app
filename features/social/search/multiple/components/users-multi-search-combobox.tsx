"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import type { UserSearchOption } from "@/features/social/search/multiple/types/user-multi-search"
import { UserImage } from "@/features/user/image/simple/components/user-image"
import { getUserImageById } from "@/lib/services/user/user-image"
import { getUserInfoById } from "@/lib/services/user/user-info"

const fakeUserIds = [
  "participant-1",
  "participant-2",
  "participant-3",
  "participant-4",
  "participant-5",
  "participant-6",
  "participant-7",
  "participant-8",
  "participant-9",
  "participant-10",
  "participant-11",
  "participant-12",
]

export function UsersMultiSearchCombobox() {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<UserSearchOption[]>([])
  const [selectedUsers, setSelectedUsers] = useState<UserSearchOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const anchor = useComboboxAnchor()

  useEffect(() => {
    let active = true

    if (query.trim().length < 1) {
      setOptions([])
      setIsLoading(false)
      setHasError(false)
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    setHasError(false)

    const timeoutId = window.setTimeout(async () => {
      try {
        const users = await Promise.all(
          fakeUserIds.map(async (userId) => {
            const userInfo = await getUserInfoById(userId)

            return {
              id: userInfo.id,
              fullName: `${userInfo.name} ${userInfo.surname}`,
            } satisfies UserSearchOption
          })
        )

        if (!active) {
          return
        }

        const normalizedQuery = query.trim().toLocaleLowerCase("es-ES")
        const selectedIds = new Set(selectedUsers.map((user) => user.id))
        setOptions(
          users.filter((user) => {
            const matchesQuery = user.fullName
              .toLocaleLowerCase("es-ES")
              .includes(normalizedQuery)

            return matchesQuery && !selectedIds.has(user.id)
          })
        )
      } catch {
        if (active) {
          setOptions([])
          setHasError(true)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [query, selectedUsers])

  const emptyMessage = hasError
    ? "No se pudieron cargar usuarios."
    : isLoading
      ? "Buscando usuarios..."
      : query.trim().length < 1
        ? "Escribe para buscar colaboradores."
        : "No se encontraron usuarios."

  return (
    <div className="space-y-3">
      <Combobox
        multiple
        autoHighlight
        items={options}
        value={selectedUsers}
        inputValue={query}
        onInputValueChange={(nextValue, eventDetails) => {
          if (
            eventDetails.reason !== "input-change" &&
            eventDetails.reason !== "input-clear" &&
            eventDetails.reason !== "clear-press"
          ) {
            return
          }

          setQuery(nextValue)
        }}
        onValueChange={(users) => {
          setSelectedUsers(users as UserSearchOption[])
          setQuery("")
          setOptions([])
        }}
        itemToStringLabel={(item) => item.fullName}
        itemToStringValue={(item) => item.fullName}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        filter={null}
      >
        <ComboboxChips ref={anchor} className="w-full">
          <span className="pointer-events-none self-start pt-1 text-muted-foreground">
            <Search className="size-4" />
          </span>
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {(values as UserSearchOption[]).map((value) => (
                  <ComboboxChip key={value.id}>
                    <UserImage
                      userId={value.id}
                      getUserInfoById={getUserInfoById}
                      getUserImageById={getUserImageById}
                      size="sm"
                    />
                    <span className="max-w-40 truncate">{value.fullName}</span>
                    <ComboboxChipRemove
                      aria-label={`Quitar ${value.fullName}`}
                      onMouseDown={(event) => event.preventDefault()}
                    />
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Buscar usuarios por nombre" />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {options.map((option, index) => (
              <ComboboxItem key={option.id} value={option} index={index}>
                <div className="flex min-w-0 items-center gap-3">
                  <UserImage
                    userId={option.id}
                    getUserInfoById={getUserInfoById}
                    getUserImageById={getUserImageById}
                    size="lg"
                  />
                  <p className="truncate font-medium">{option.fullName}</p>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
