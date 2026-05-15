"use client"

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react"
import { useCallback, useEffect, useState, type ReactNode } from "react"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type AppToastType = "success" | "info" | "warning" | "error"

type AppToastCardProps = {
  toastId: number | string
  type: AppToastType
  title: ReactNode
  description?: ReactNode
  durationMs: number | null
  onDismiss: (toastId: number | string) => void
}

const toastTypeContent = {
  success: {
    icon: CheckCircle2,
    rootClassName:
      "border-[color:color-mix(in_oklab,var(--border)_72%,rgb(34_197_94)_28%)] border-l-[color:color-mix(in_oklab,var(--primary)_18%,rgb(34_197_94))] bg-[color:color-mix(in_oklab,rgb(255_255_255_/_0.58)_92%,rgb(34_197_94_/_0.18)_8%)] dark:bg-[color:color-mix(in_oklab,rgb(24_29_39_/_0.58)_92%,rgb(34_197_94_/_0.2)_8%)]",
    iconClassName:
      "text-[color:color-mix(in_oklab,var(--primary)_18%,rgb(21_128_61))]",
    progressTrackClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_10%,rgb(34_197_94_/_0.14))]",
    progressIndicatorClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_18%,rgb(34_197_94))]",
  },
  info: {
    icon: Info,
    rootClassName:
      "border-[color:color-mix(in_oklab,var(--border)_72%,var(--primary)_28%)] border-l-primary bg-[color:color-mix(in_oklab,rgb(255_255_255_/_0.58)_92%,var(--primary)_8%)] dark:bg-[color:color-mix(in_oklab,rgb(24_29_39_/_0.58)_92%,var(--primary)_8%)]",
    iconClassName: "text-primary",
    progressTrackClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_14%,transparent)]",
    progressIndicatorClassName: "bg-primary",
  },
  warning: {
    icon: TriangleAlert,
    rootClassName:
      "border-[color:color-mix(in_oklab,var(--border)_72%,rgb(245_158_11)_28%)] border-l-[color:color-mix(in_oklab,var(--primary)_16%,rgb(245_158_11))] bg-[color:color-mix(in_oklab,rgb(255_255_255_/_0.58)_92%,rgb(245_158_11_/_0.18)_8%)] dark:bg-[color:color-mix(in_oklab,rgb(24_29_39_/_0.58)_92%,rgb(245_158_11_/_0.2)_8%)]",
    iconClassName:
      "text-[color:color-mix(in_oklab,var(--primary)_14%,rgb(217_119_6))]",
    progressTrackClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_8%,rgb(245_158_11_/_0.14))]",
    progressIndicatorClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_14%,rgb(245_158_11))]",
  },
  error: {
    icon: AlertCircle,
    rootClassName:
      "border-[color:color-mix(in_oklab,var(--border)_70%,var(--destructive)_30%)] border-l-[color:color-mix(in_oklab,var(--primary)_10%,var(--destructive))] bg-[color:color-mix(in_oklab,rgb(255_255_255_/_0.58)_92%,var(--destructive)_8%)] dark:bg-[color:color-mix(in_oklab,rgb(24_29_39_/_0.58)_92%,var(--destructive)_8%)]",
    iconClassName:
      "text-[color:color-mix(in_oklab,var(--primary)_10%,var(--destructive))]",
    progressTrackClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_6%,var(--destructive)_14%,transparent)]",
    progressIndicatorClassName:
      "bg-[color:color-mix(in_oklab,var(--primary)_10%,var(--destructive))]",
  },
} satisfies Record<
  AppToastType,
  {
    icon: LucideIcon
    rootClassName: string
    iconClassName: string
    progressTrackClassName: string
    progressIndicatorClassName: string
  }
>

export function AppToastCard({
  toastId,
  type,
  title,
  description,
  durationMs,
  onDismiss,
}: AppToastCardProps) {
  const [progress, setProgress] = useState(100)
  const typeContent = toastTypeContent[type]
  const Icon = typeContent.icon

  const handleDismiss = useCallback(() => {
    onDismiss(toastId)
  }, [onDismiss, toastId])

  useEffect(() => {
    if (!durationMs) {
      return
    }

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.max(0, 100 - (elapsed / durationMs) * 100)

      setProgress(nextProgress)

      if (nextProgress <= 0) {
        window.clearInterval(interval)
        handleDismiss()
      }
    }, 100)

    return () => window.clearInterval(interval)
  }, [durationMs, handleDismiss])

  return (
    <div
      className={cn(
        "relative w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-lg border border-l-4 shadow-[0_10px_30px_rgb(15_23_42_/_0.12)] backdrop-blur-[16px] backdrop-saturate-[135%]",
        typeContent.rootClassName
      )}
    >
      <button
        type="button"
        aria-label="Cerrar notificacion"
        className={cn(
          "absolute top-1.5 right-1 flex h-7 w-7 items-center justify-center rounded-md",
          "text-[color:color-mix(in_oklab,var(--foreground)_80%,transparent)] transition-colors duration-150",
          "hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
        onClick={handleDismiss}
      >
        <X className="size-4" />
      </button>

      <div className="flex items-center gap-3 px-4 pt-2.5 pb-1.5 pr-12">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center",
            typeContent.iconClassName
          )}
        >
          <Icon className="size-7" />
        </div>

        <div className="min-w-0 flex-1 py-1">
          <p className="text-sm leading-5 font-semibold">{title}</p>
          {description ? (
            <div className="mt-1.5 text-sm leading-5 opacity-80">
              {description}
            </div>
          ) : null}
        </div>
      </div>

      {durationMs ? (
        <div className="mt-0.5 mb-2 px-2">
          <Progress
            value={progress}
            className={cn("h-1.5 w-full", typeContent.progressTrackClassName)}
            indicatorClassName={typeContent.progressIndicatorClassName}
          />
        </div>
      ) : null}
    </div>
  )
}
