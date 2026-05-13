"use client"

import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProfileEditActionsProps = {
  className?: string
  onSaveClick?: () => void
}

export function ProfileEditActions({
  className,
  onSaveClick,
}: ProfileEditActionsProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 transition-all duration-300 ease-out",
        className
      )}
    >
      <Button variant="outline" asChild>
        <Link href="/profile">
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      </Button>
      <Button type="button" onClick={onSaveClick}>
        <Save className="size-4" />
        Guardar
      </Button>
    </div>
  )
}
