"use client"

import { AlertCircle, CheckCircle2, HelpCircle, Info } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type InformationDialogType = "info" | "success" | "error" | "confirmation"

type InformationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: InformationDialogType
  title: string
  description: ReactNode
  closeLabel?: string
  autoCloseSeconds?: number
  onClose?: () => void
}

const dialogTypeContent = {
  info: {
    icon: Info,
    className: "border-primary/25 bg-primary/8 text-primary",
    progressClassName: "bg-primary",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-500/25 bg-emerald-500/8 text-emerald-600",
    progressClassName: "bg-emerald-500",
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive/25 bg-destructive/8 text-destructive",
    progressClassName: "bg-destructive",
  },
  confirmation: {
    icon: HelpCircle,
    className: "border-primary/25 bg-primary/8 text-primary",
    progressClassName: "bg-primary",
  },
} satisfies Record<
  InformationDialogType,
  {
    icon: typeof Info
    className: string
    progressClassName: string
  }
>

export function InformationDialog({
  open,
  onOpenChange,
  type = "info",
  title,
  description,
  closeLabel = "Cerrar",
  autoCloseSeconds,
  onClose,
}: InformationDialogProps) {
  const [progress, setProgress] = useState(100)
  const closeHandledRef = useRef(false)
  const typeContent = dialogTypeContent[type]
  const Icon = typeContent.icon
  const autoCloseMs = autoCloseSeconds ? autoCloseSeconds * 1000 : 0

  const handleClose = useCallback(() => {
    if (!closeHandledRef.current) {
      closeHandledRef.current = true
      onClose?.()
    }

    onOpenChange(false)
  }, [onClose, onOpenChange])

  useEffect(() => {
    if (!open) {
      return
    }

    closeHandledRef.current = false
    const resetTimer = window.setTimeout(() => setProgress(100), 0)

    if (!autoCloseMs) {
      return () => window.clearTimeout(resetTimer)
    }

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.max(0, 100 - (elapsed / autoCloseMs) * 100)

      setProgress(nextProgress)

      if (nextProgress <= 0) {
        window.clearInterval(interval)
        handleClose()
      }
    }, 100)

    return () => {
      window.clearTimeout(resetTimer)
      window.clearInterval(interval)
    }
  }, [autoCloseMs, handleClose, open])

  const remainingSeconds = autoCloseSeconds
    ? Math.max(Math.ceil((progress / 100) * autoCloseSeconds), 0)
    : 0

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-2xl border",
                typeContent.className
              )}
            >
              <Icon className="size-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {autoCloseSeconds ? (
          <div className="space-y-3">
            <Progress
              value={progress}
              className="h-2"
              indicatorClassName={typeContent.progressClassName}
            />
            <p className="text-xs text-muted-foreground">
              Cerrando en {remainingSeconds} s
            </p>
          </div>
        ) : null}

        <AlertDialogFooter>
          <Button type="button" onClick={handleClose}>
            {closeLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
