import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { FieldError as HookFormFieldError } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const fieldVariants = cva("flex gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center justify-between",
      responsive: "flex-col sm:flex-row sm:items-center sm:justify-between",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      data-slot="field"
      className={cn(
        fieldVariants({ orientation }),
        "data-[invalid=true]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-5", className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("grid gap-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn(className)} {...props} />
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  errors,
  children,
  ...props
}: React.ComponentProps<"p"> & {
  errors?: Array<HookFormFieldError | undefined>
}) {
  const messages = errors
    ?.map((error) => error?.message)
    .filter((message): message is string => Boolean(message))

  if (!children && (!messages || messages.length === 0)) {
    return null
  }

  return (
    <p
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {children ?? messages?.join(", ")}
    </p>
  )
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("grid gap-5", className)}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  ...props
}: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
}
