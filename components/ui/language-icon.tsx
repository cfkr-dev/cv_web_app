"use client"

import { Languages } from "lucide-react"
import { useEffect, useState } from "react"

type LanguageIconProps = {
  code?: string
  alt: string
  className?: string
}

export function LanguageIcon({
  code,
  alt,
  className = "size-5",
}: LanguageIconProps) {
  const normalizedCode = code?.trim().toLowerCase() ?? ""
  const [hasError, setHasError] = useState(!normalizedCode)

  useEffect(() => {
    setHasError(!normalizedCode)
  }, [normalizedCode])

  if (hasError) {
    return (
      <span
        className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`}
      >
        <Languages className="size-[70%]" />
      </span>
    )
  }

  return (
    <img
      src={`https://unpkg.com/language-icons/icons/${normalizedCode}.svg`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}
