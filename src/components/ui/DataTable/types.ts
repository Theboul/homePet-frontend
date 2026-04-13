<<<<<<< HEAD
import type { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table"

// 1. Interfaz para los filtros y buscador (Header)
export interface DataTableHeaderProps {
=======
import { ReactNode } from "react"
import { ColumnDef, OnChangeFn, SortingState, Table } from "@tanstack/react-table"

// 1. Interfaz para los filtros y buscador (Header)
export interface DataTableHeaderProps<TData> {
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Búsqueda
  enableSearch?: boolean
  searchPlaceholder?: string
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearchTrigger: () => void
<<<<<<< HEAD

=======
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Filtros Extra
  enableStatusFilter?: boolean
  statusValue?: string
  onStatusChange?: (value: string) => void
<<<<<<< HEAD

  enableDateFilter?: boolean
  dateRange?: any // Tipar según tu librería de fechas si es necesario
  onDateRangeChange?: (range: any) => void

=======
  
  enableDateFilter?: boolean
  dateRange?: any // Tipar según tu librería de fechas si es necesario
  onDateRangeChange?: (range: any) => void
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Acciones Globales
  onRefresh?: () => void
  onAdd?: () => void
  isLoading?: boolean
<<<<<<< HEAD

=======
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Botón Reset
  onReset?: () => void
  isFiltered: boolean
}

// 2. Interfaz para la paginación (Footer)
export interface DataTablePaginationProps {
  pageIndex: number
  pageCount: number
  totalRecords: number
  onPageChange: (index: number) => void
  pageSize: number
}

// 3. Propiedades principales de la DataTable (El Ensamble)
export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData>
  isLoading?: boolean
<<<<<<< HEAD

=======
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Configuración de UI
  searchPlaceholder?: string
  enableSearch?: boolean
  enableStatusFilter?: boolean
  enableDateFilter?: boolean
<<<<<<< HEAD

=======
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Estado Controlado (Search)
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearchTrigger: () => void
<<<<<<< HEAD

=======
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Estado Controlado (Pagination)
  manualPagination?: boolean
  pageCount: number
  pageIndex: number
  onPageChange: (index: number) => void
  totalRecords: number
<<<<<<< HEAD

  // Estado Controlado (Sorting)
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>

=======
  
  // Estado Controlado (Sorting)
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  // Callbacks de fila
  onRefresh?: () => void
  onAdd?: () => void
  onDetail?: (row: TData) => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onReset?: () => void
}