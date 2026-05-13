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

import { Progress } from "components/ui/progress"
import { cn } from "lib/utils"
import styles from "./app-toast-card.module.css"

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
    rootClassName: styles.success,
    iconClassName: styles.successIcon,
    progressTrackClassName: styles.successProgressTrack,
    progressClassName: styles.successProgressIndicator,
  },
  info: {
    icon: Info,
    rootClassName: styles.info,
    iconClassName: styles.infoIcon,
    progressTrackClassName: styles.infoProgressTrack,
    progressClassName: styles.infoProgressIndicator,
  },
  warning: {
    icon: TriangleAlert,
    rootClassName: styles.warning,
    iconClassName: styles.warningIcon,
    progressTrackClassName: styles.warningProgressTrack,
    progressClassName: styles.warningProgressIndicator,
  },
  error: {
    icon: AlertCircle,
    rootClassName: styles.error,
    iconClassName: styles.errorIcon,
    progressTrackClassName: styles.errorProgressTrack,
    progressClassName: styles.errorProgressIndicator,
  },
} satisfies Record<
  AppToastType,
  {
    icon: LucideIcon
    rootClassName: string
    iconClassName: string
    progressTrackClassName: string
    progressClassName: string
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
    <div className={cn(styles.card, typeContent.rootClassName)}>
      <button
        type="button"
        aria-label="Cerrar notificacion"
        className={cn(
          styles.closeButton,
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
        onClick={handleDismiss}
      >
        <X className="size-4" />
      </button>

      <div className={styles.content}>
        <div className={cn(styles.iconWrap, typeContent.iconClassName)}>
          <Icon className="size-7" />
        </div>

        <div className={styles.textWrap}>
          <p className="text-sm leading-5 font-semibold">{title}</p>
          {description ? (
            <div className={styles.description}>{description}</div>
          ) : null}
        </div>
      </div>

      {durationMs ? (
        <div className={styles.progressWrap}>
          <Progress
            value={progress}
            className={cn(
              styles.progressRoot,
              typeContent.progressTrackClassName
            )}
            indicatorClassName={typeContent.progressClassName}
          />
        </div>
      ) : null}
    </div>
  )
}
