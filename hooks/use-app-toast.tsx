"use client"

import { toast } from "sonner"
import type { ReactNode } from "react"

import { AppToastCard, type AppToastType } from "@/components/app-toast-card"

export type AppToastOptions = {
  title: ReactNode
  description?: ReactNode
  durationSeconds?: number
  persistent?: boolean
  onClose?: () => void
}

const defaultDurationSeconds = 5

function showAppToast(
  type: AppToastType,
  {
    title,
    description,
    durationSeconds = defaultDurationSeconds,
    persistent = false,
    onClose,
  }: AppToastOptions
) {
  const normalizedDurationSeconds =
    Number.isFinite(durationSeconds) && durationSeconds > 0
      ? durationSeconds
      : defaultDurationSeconds
  const durationMs = persistent ? null : normalizedDurationSeconds * 1000
  let closeHandled = false

  function handleClose(toastId: number | string) {
    if (!closeHandled) {
      closeHandled = true
      onClose?.()
    }

    toast.dismiss(toastId)
  }

  return toast.custom(
    (toastId) => (
      <AppToastCard
        toastId={toastId}
        type={type}
        title={title}
        description={description}
        durationMs={durationMs}
        onDismiss={handleClose}
      />
    ),
    {
      duration: durationMs ?? Infinity,
      unstyled: true,
    }
  )
}

export function useAppToast() {
  return {
    success: (options: AppToastOptions) => showAppToast("success", options),
    info: (options: AppToastOptions) => showAppToast("info", options),
    warning: (options: AppToastOptions) => showAppToast("warning", options),
    error: (options: AppToastOptions) => showAppToast("error", options),
  }
}
