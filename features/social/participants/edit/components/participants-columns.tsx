"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  CircleCheckBig,
  Clock3,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProjectParticipantTableRow } from "@/features/social/participants/edit/type/participant-table"
import { UserImage } from "@/features/user/image/simple/components/user-image"
import type {
  GetUserImageById,
  GetUserInfoById,
} from "@/features/user/image/simple/types/user-image"

export function createParticipantsColumns({
  getUserInfoById,
  getUserImageById,
  onRemove,
  onMakeAdmin,
}: {
  getUserInfoById: GetUserInfoById
  getUserImageById: GetUserImageById
  onRemove: (rowId: string) => void
  onMakeAdmin: (rowId: string) => void
}): ColumnDef<ProjectParticipantTableRow>[] {
  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Colaborador
          <ArrowUpDown className="size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const participant = row.original

        return (
          <div className="flex min-w-0 items-center gap-3">
            <UserImage
              userId={participant.userId}
              getUserInfoById={getUserInfoById}
              getUserImageById={getUserImageById}
              openProfileInNewTab
              size="lg"
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {participant.fullName}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mx-auto h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="size-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue: string) => {
        if (!filterValue || filterValue === "all") {
          return true
        }

        return row.getValue(columnId) === filterValue
      },
      cell: ({ row }) => {
        const isActive = row.original.status === "active"

        return (
          <div className="flex justify-center">
            <Badge variant={isActive ? "success" : "warning"} className="min-w-24">
              {isActive ? <CircleCheckBig /> : <Clock3 />}
              {isActive ? "Activo" : "Pendiente"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mx-auto h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rol
          <ArrowUpDown className="size-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue: string) => {
        if (!filterValue || filterValue === "all") {
          return true
        }

        return row.getValue(columnId) === filterValue
      },
      cell: ({ row }) => {
        const isAdmin = row.original.role === "admin"

        return (
          <div className="flex justify-center">
            <Badge variant={isAdmin ? "info" : "secondary"} className="min-w-28">
              {isAdmin ? <ShieldCheck /> : <UserRound />}
              {isAdmin ? "Administrador" : "Colaborador"}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <span className="sr-only">Abrir acciones</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onMakeAdmin(row.original.id)}>
                <ShieldCheck className="size-4" />
                Hacer administrador
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onRemove(row.original.id)}
              >
                <Trash2 className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
