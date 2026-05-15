"use client"

import { useEffect, useState } from "react"
import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createParticipantsColumns } from "@/features/social/participants/edit/components/participants-columns"
import type {
  ProjectParticipantRecord,
  ProjectParticipantTableRow,
} from "@/features/social/participants/edit/type/participant-table"
import { getUserImageById } from "@/lib/services/user/user-image"
import { getUserInfoById } from "@/lib/services/user/user-info"

type ParticipantsDataTableProps = {
  participants: ProjectParticipantRecord[]
}

export function ParticipantsDataTable({
  participants,
}: ParticipantsDataTableProps) {
  const [rows, setRows] = useState<ProjectParticipantTableRow[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  useEffect(() => {
    let active = true

    void Promise.all(
      participants.map(async (participant) => {
        try {
          const userInfo = await getUserInfoById(participant.userId)

          return {
            id: participant.id,
            userId: participant.userId,
            fullName: `${userInfo.name} ${userInfo.surname}`,
            status: participant.status,
            role: participant.role,
          } satisfies ProjectParticipantTableRow
        } catch {
          return {
            id: participant.id,
            userId: participant.userId,
            fullName: "Usuario desconocido",
            status: participant.status,
            role: participant.role,
          } satisfies ProjectParticipantTableRow
        }
      })
    ).then((resolvedRows) => {
      if (active) {
        setRows(resolvedRows)
      }
    })

    return () => {
      active = false
    }
  }, [participants])

  const table = useReactTable({
    data: rows,
    columns: createParticipantsColumns({
      getUserInfoById,
      getUserImageById,
      onRemove: (rowId) =>
        setRows((currentRows) =>
          currentRows.filter((participant) => participant.id !== rowId)
        ),
      onMakeAdmin: (rowId) =>
        setRows((currentRows) =>
          currentRows.map((participant) =>
            participant.id === rowId
              ? { ...participant, role: "admin" }
              : participant
          )
        ),
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Input
            value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("fullName")?.setFilterValue(event.target.value)
            }
            placeholder="Filtrar por colaborador"
            className="w-full sm:max-w-xs"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent position="popper" align="center" sideOffset={6}>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("role")?.setFilterValue(
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent position="popper" align="center" sideOffset={6}>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="collaborator">Colaborador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={
                        header.id === "status" ||
                        header.id === "role" ||
                        header.id === "actions"
                          ? "text-center"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No hay participantes que coincidan con el filtro actual.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {table.getFilteredRowModel().rows.length} participantes visibles
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-muted-foreground">
            Pagina {table.getState().pagination.pageIndex + 1} de{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
