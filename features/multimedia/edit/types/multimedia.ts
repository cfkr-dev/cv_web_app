import type {
  FieldArrayPath,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form"

export type MultimediaItemValue = {
  title: string
  description: string
  isLink: boolean
  isLocalFile: boolean
  url: string
  file: File | null
  fileName: string
  fileSize: number | null
}

export type MultimediaEditorListProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>
  itemsName: FieldArrayPath<TFieldValues>
  itemIdPrefix: string
  createItemAction: () => MultimediaItemValue
  className?: string
}

export type MultimediaEditorItemProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>
  itemName: Path<TFieldValues>
  itemIdPrefix: string
  itemIndex: number
  onDelete: () => void
}
