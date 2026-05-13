"use client"

import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"

export function UrlNavigationButton({
  value,
  label,
  getNavigableUrl,
}: {
  value: string
  label: string
  getNavigableUrl: (value: string) => string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      className="absolute top-1/2 right-1.5 -translate-y-1/2"
      onClick={() => {
        const url = getNavigableUrl(value)

        if (!url) {
          return
        }

        window.open(url, "_blank", "noopener,noreferrer")
      }}
    >
      <ExternalLink className="size-4" />
    </Button>
  )
}
