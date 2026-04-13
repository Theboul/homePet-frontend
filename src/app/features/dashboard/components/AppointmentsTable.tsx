import { useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { PawPrint, Clock } from 'lucide-react'


export type AppointmentStatus = 'Confirmada' | 'En espera' | 'Pendiente'

export interface Appointment {
  id: string
  petName: string
  petType: string
  ownerName: string
  service: string
  time: string
  status: AppointmentStatus
}

// Datos Hardcodeados de prueba
const data: Appointment[] = [
  {
    id: '1',
    petName: 'Max',
    petType: 'Perro',
    ownerName: 'Carlos García',
    service: 'Vacunación',
    time: '09:00 AM',
    status: 'Confirmada',
  },
  {
    id: '2',
    petName: 'Luna',
    petType: 'Gato',
    ownerName: 'María López',
    service: 'Consulta General',
    time: '10:30 AM',
    status: 'En espera',
  },
  {
    id: '3',
    petName: 'Rocky',
    petType: 'Perro',
    ownerName: 'Juan Martínez',
    service: 'Cirugía',
    time: '11:00 AM',
    status: 'Confirmada',
  },
  {
    id: '4',
    petName: 'Michi',
    petType: 'Gato',
    ownerName: 'Ana Rodríguez',
    service: 'Desparasitación',
    time: '12:00 PM',
    status: 'Pendiente',
  },
  {
    id: '5',
    petName: 'Toby',
    petType: 'Perro',
    ownerName: 'Pedro Sánchez',
    service: 'Control',
    time: '02:30 PM',
    status: 'Confirmada',
  },
]

//Helper de columnas
const columnHelper = createColumnHelper<Appointment>()

export function AppointmentsTable() {
  const columns = useMemo(
    () => [
      columnHelper.accessor('petName', {
        header: 'Mascota',
        cell: (info) => (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <PawPrint className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-[15px]">
                {info.getValue()} <span className="text-gray-400 font-normal">({info.row.original.petType})</span>
              </span>
              <span className="text-sm text-gray-500 mt-0.5">
                {info.row.original.ownerName} • {info.row.original.service}
              </span>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('time', {
        header: 'Hora',
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm justify-end whitespace-nowrap">
            <Clock className="w-4 h-4" />
            {info.getValue()}
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue()
          let bg = 'bg-green-100 text-green-700'

          if (status === 'En espera') {
            bg = 'bg-yellow-100 text-yellow-700'
          } else if (status === 'Pendiente') {
            bg = 'bg-gray-100 text-gray-600'
          }

          return (
            <div className="flex justify-end">
              <span className={`px-3 py-1 rounded-md text-xs font-semibold ${bg}`}>
                {status}
              </span>
            </div>
          )
        }
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    // @ts-expect-error - Known TS issue with tanstack table v8.21+ requiring filterFns unnecessarily
    filterFns: undefined,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-sans">Citas de Hoy</h3>
        <div className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-md">
          5 citas
        </div>
      </div>

      <div className="space-y-3">
        {/* 
          Instead of rendering a traditional <table>, we can iterate over table.getRowModel().rows
          to render customized "cards" or "list items" to match the design while keeping
          TanStack Table logic intact behind the scenes.
        */}
        {table.getRowModel().rows.map(row => (
          <div
            key={row.id}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors"
          >
            {/* Pet Info (Cell 1) */}
            <div className="flex-1">
              {flexRender(row.getVisibleCells()[0].column.columnDef.cell, row.getVisibleCells()[0].getContext())}
            </div>

            <div className="flex items-center gap-6 justify-end">
              {/* Time (Cell 2) */}
              <div className="w-24">
                {flexRender(row.getVisibleCells()[1].column.columnDef.cell, row.getVisibleCells()[1].getContext())}
              </div>

              {/* Status (Cell 3) */}
              <div className="w-24">
                {flexRender(row.getVisibleCells()[2].column.columnDef.cell, row.getVisibleCells()[2].getContext())}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}