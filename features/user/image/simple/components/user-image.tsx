"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type {
  UserImageProps,
  UserInfo,
} from "@/features/user/image/simple/types/user-image"
import { cn } from "@/lib/utils"

export function UserImage({
  userId,
  getUserInfoById,
  getUserImageById,
  openProfileInNewTab = false,
  size = "lg",
  className,
}: UserImageProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void Promise.allSettled([
      getUserInfoById(userId),
      getUserImageById(userId),
    ]).then(([userInfoResult, userImageResult]) => {
      if (!active) {
        return
      }

      setUserInfo(
        userInfoResult.status === "fulfilled" ? userInfoResult.value : null
      )
      setImageUrl(
        userImageResult.status === "fulfilled" ? userImageResult.value : null
      )
    })

    return () => {
      active = false
    }
  }, [getUserImageById, getUserInfoById, userId])

  const fullName = userInfo ? `${userInfo.name} ${userInfo.surname}` : "Usuario"
  const initials = getUserInitials(userInfo)

  return (
    <Link
      href="/profile"
      target={openProfileInNewTab ? "_blank" : undefined}
      rel={openProfileInNewTab ? "noreferrer" : undefined}
      aria-label={`Ir al perfil de ${fullName}`}
      className="flex justify-center rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Avatar size={size} className={cn("ring-background ring-2", className)}>
        {imageUrl ? (
          <AvatarImage
            src={imageUrl}
            alt={`Imagen de perfil de ${fullName}`}
          />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </Link>
  )
}

function getUserInitials(userInfo: UserInfo | null) {
  const nameInitial = userInfo?.name.trim().charAt(0).toUpperCase() ?? ""
  const surnameInitial = userInfo?.surname.trim().charAt(0).toUpperCase() ?? ""
  const initials = `${nameInitial}${surnameInitial}`

  return initials || "??"
}
