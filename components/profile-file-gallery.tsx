"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, ExternalLink, FileImage, FileText, Presentation } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type ProfileFileGalleryItem = {
  title: string
  description: string
  type: "Imagen" | "PDF" | "Presentacion" | "Pagina web"
  thumbnailSrc: string
  fileSrc?: string
  linkHref?: string
  slideSrcs?: string[]
}

type ProfileFileGalleryProps = {
  items: ProfileFileGalleryItem[]
}

const pageSize = 3

export function ProfileFileGallery({ items }: ProfileFileGalleryProps) {
  const [page, setPage] = useState(0)
  const [selectedItem, setSelectedItem] = useState<ProfileFileGalleryItem | null>(null)
  const pageCount = Math.ceil(items.length / pageSize)
  const currentItems = items.slice(page * pageSize, page * pageSize + pageSize)
  const canGoPrevious = page > 0
  const canGoNext = page < pageCount - 1

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Galeria de archivos</h4>
          <p className="text-xs text-muted-foreground">
            Imagenes, documentos, presentaciones y paginas web asociadas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canGoPrevious}
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
            aria-label="Ver archivos anteriores"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-12 text-center text-xs font-medium text-muted-foreground">
            {page + 1}/{pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canGoNext}
            onClick={() => setPage((currentPage) => Math.min(currentPage + 1, pageCount - 1))}
            aria-label="Ver archivos siguientes"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {currentItems.map((item) => (
          <GalleryItemCard key={item.thumbnailSrc} item={item} onOpen={setSelectedItem} />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              "size-2 rounded-full bg-muted-foreground/30 transition",
              index === page && "w-6 bg-primary"
            )}
            onClick={() => setPage(index)}
            aria-label={`Ir a la pagina ${index + 1}`}
          />
        ))}
      </div>

      <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-h-[90svh] w-[min(100%-2rem,72rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          {selectedItem && <FilePreview item={selectedItem} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GalleryItemCard({
  item,
  onOpen,
}: {
  item: ProfileFileGalleryItem
  onOpen: (item: ProfileFileGalleryItem) => void
}) {
  const content = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={item.thumbnailSrc}
          alt={`Miniatura de ${item.title}`}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.title}</p>
          {item.type === "Pagina web" && (
            <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-primary" />
          )}
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <FileTypeIcon type={item.type} />
          {item.type}
        </p>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
      </div>
    </>
  )

  if (item.type === "Pagina web" && item.linkHref) {
    return (
      <a
        href={item.linkHref}
        target="_blank"
        rel="noreferrer"
        className="group w-full max-w-64 overflow-hidden rounded-lg border border-border/70 bg-background text-left shadow-sm transition hover:border-primary/45 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className="group w-full max-w-64 overflow-hidden rounded-lg border border-border/70 bg-background text-left shadow-sm transition hover:border-primary/45 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      onClick={() => onOpen(item)}
    >
      {content}
    </button>
  )
}

function FileTypeIcon({ type }: { type: ProfileFileGalleryItem["type"] }) {
  if (type === "Imagen") {
    return <FileImage className="size-3.5" />
  }

  if (type === "PDF") {
    return <FileText className="size-3.5" />
  }

  if (type === "Presentacion") {
    return <Presentation className="size-3.5" />
  }

  return <ExternalLink className="size-3.5" />
}

function FilePreview({ item }: { item: ProfileFileGalleryItem }) {
  if (item.type === "Imagen" && item.fileSrc) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/70 bg-muted">
        <Image src={item.fileSrc} alt={item.title} fill sizes="90vw" className="object-contain" />
      </div>
    )
  }

  if (item.type === "PDF" && item.fileSrc) {
    return (
      <iframe
        src={item.fileSrc}
        title={item.title}
        className="h-[70svh] w-full rounded-lg border border-border/70 bg-muted"
      />
    )
  }

  if (item.type === "Presentacion") {
    return <PresentationPreview item={item} />
  }

  return null
}

function PresentationPreview({ item }: { item: ProfileFileGalleryItem }) {
  if (!item.slideSrcs || item.slideSrcs.length === 0) {
    return null
  }

  return (
    <Carousel opts={{ loop: false }} className="mx-auto w-full max-w-5xl px-12 sm:px-16">
      <CarouselContent>
        {item.slideSrcs.map((slideSrc, index) => (
          <CarouselItem key={slideSrc}>
            <div className="overflow-hidden rounded-lg border border-border/70 bg-muted">
              <div className="relative aspect-video w-full">
                <Image
                  src={slideSrc}
                  alt={`${item.title} - slide ${index + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
              Slide {index + 1}/{item.slideSrcs?.length}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1 sm:left-3" />
      <CarouselNext className="right-1 sm:right-3" />
    </Carousel>
  )
}
