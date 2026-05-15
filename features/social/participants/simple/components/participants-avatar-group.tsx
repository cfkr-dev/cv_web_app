"use client"

import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"

import {
  DropdownMenuArrow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ParticipantsAvatarGroupParticipant } from "@/features/social/participants/simple/types/participants-avatar-group"
import { UserImage } from "@/features/user/image/simple/components/user-image"
import type {
  GetUserImageById,
  GetUserInfoById,
  UserInfo,
} from "@/features/user/image/simple/types/user-image"
import { cn } from "@/lib/utils"

type ParticipantsAvatarGroupProps = {
  participants: ParticipantsAvatarGroupParticipant[]
  getUserInfoById: GetUserInfoById
  getUserImageById: GetUserImageById
  maxVisible?: number
  className?: string
}

export function ParticipantsAvatarGroup({
  participants,
  getUserInfoById,
  getUserImageById,
  maxVisible = 10,
  className,
}: ParticipantsAvatarGroupProps) {
  const visibleParticipants = participants.slice(0, maxVisible)
  const hiddenParticipants = participants.slice(maxVisible)
  const visibleGridColumns = Math.min(visibleParticipants.length, 5)
  const hiddenGridColumns = Math.min(hiddenParticipants.length, 8)

  return (
    <div
      className={cn(
        "mx-auto flex w-fit max-w-full flex-col items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 shadow-sm",
        className
      )}
    >
      <div
        className="grid justify-center gap-2"
        style={{
          gridTemplateColumns: `repeat(${Math.max(visibleGridColumns, 1)}, 2.5rem)`,
        }}
      >
        {visibleParticipants.map((userId) => (
          <ParticipantAvatar
            key={userId}
            userId={userId}
            getUserInfoById={getUserInfoById}
            getUserImageById={getUserImageById}
          />
        ))}
      </div>

      {hiddenParticipants.length ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-h-8 shrink-0 items-center justify-center rounded-full bg-transparent px-2.5 text-xs font-medium text-muted-foreground transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-muted hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label={`Mostrar ${hiddenParticipants.length} colaboradores mas`}
              title={`Mostrar ${hiddenParticipants.length} colaboradores mas`}
            >
              <PlusIcon className="mr-1 size-3" />
              {hiddenParticipants.length} colaboradores
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            sideOffset={10}
            collisionPadding={12}
            arrowPadding={12}
            className="w-[min(32rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] min-w-0 px-6 py-4"
          >
            <div
              className="grid w-full max-h-72 gap-3 overflow-y-auto py-1"
              style={{
                gridTemplateColumns: `repeat(${Math.max(hiddenGridColumns, 1)}, minmax(0, 1fr))`,
              }}
            >
              {hiddenParticipants.map((userId) => (
                <div key={userId} className="flex justify-center">
                  <ParticipantAvatar
                    userId={userId}
                    getUserInfoById={getUserInfoById}
                    getUserImageById={getUserImageById}
                  />
                </div>
              ))}
            </div>
            <DropdownMenuArrow className="size-3" />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}

function ParticipantAvatar({
  userId,
  getUserInfoById,
  getUserImageById,
}: {
  userId: string
  getUserInfoById: GetUserInfoById
  getUserImageById: GetUserImageById
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    let active = true

    void getUserInfoById(userId)
      .then((result) => {
        if (active) {
          setUserInfo(result)
        }
      })
      .catch(() => {
        if (active) {
          setUserInfo(null)
        }
      })

    return () => {
      active = false
    }
  }, [getUserInfoById, userId])

  const tooltipLabel = userInfo ? `${userInfo.name} ${userInfo.surname}` : "Usuario"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-center">
          <UserImage
            userId={userId}
            getUserInfoById={getUserInfoById}
            getUserImageById={getUserImageById}
            openProfileInNewTab
            className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="w-auto max-w-none whitespace-nowrap"
        sideOffset={6}
      >
        {tooltipLabel}
      </TooltipContent>
    </Tooltip>
  )
}
