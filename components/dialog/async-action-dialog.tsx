"use client"

import { LoaderCircle } from "lucide-react"
import { useState } from "react"

import { useAppToast } from "@/hooks/use-app-toast"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type AsyncActionDialogProps = {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  actionLabel: string
  loadingLabel: string
  successTitle: string
  successDescription: string
  errorTitle?: string
  errorDescription?: string
  cancelLabel?: string
  closeLabel?: string
  retryLabel?: string
  autoCloseMs?: number
  actionIcon?: React.ReactNode
  actionVariant?: React.ComponentProps<typeof Button>["variant"]
  onAction: () => Promise<void>
  onSuccessClose?: () => void
}

export function AsyncActionDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  loadingLabel,
  successTitle,
  successDescription,
  errorTitle = "No se pudo completar la accion",
  errorDescription = "Ha ocurrido un error al procesar la accion. Intentalo de nuevo.",
  cancelLabel = "Cancelar",
  autoCloseMs = 3500,
  actionIcon,
  actionVariant = "default",
  onAction,
  onSuccessClose,
}: AsyncActionDialogProps) {
  const appToast = useAppToast()
  const [internalConfirmOpen, setInternalConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const confirmOpen = open ?? internalConfirmOpen

  function setConfirmOpenState(nextOpen: boolean) {
    if (open === undefined) {
      setInternalConfirmOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  function handleConfirmOpenChange(nextOpen: boolean) {
    if (isLoading) {
      return
    }

    setConfirmOpenState(nextOpen)
  }

  async function handleAction() {
    setIsLoading(true)

    try {
      await onAction()
      setConfirmOpenState(false)
      onSuccessClose?.()
      appToast.success({
        title: successTitle,
        description: successDescription,
        durationSeconds: autoCloseMs / 1000,
      })
    } catch (error) {
      setConfirmOpenState(false)
      appToast.error({
        title: errorTitle,
        description:
          error instanceof Error && error.message
            ? error.message
            : errorDescription,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            type="button"
            variant={actionVariant}
            disabled={isLoading}
            onClick={handleAction}
          >
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              actionIcon
            )}
            {isLoading ? `${loadingLabel}...` : actionLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
