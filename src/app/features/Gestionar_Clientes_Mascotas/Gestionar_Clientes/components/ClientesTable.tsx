'use client'

import { useEffect, useRef, useState } from 'react'
import type { Cliente } from '../types'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  Mail,
  Phone,
  MapPin,
  PawPrint,
} from 'lucide-react'

interface ClientesTableProps {
  clientes: Cliente[]
  onEdit: (cliente: Cliente) => void
  onDelete: (clienteId: string) => void
  onToggleStatus: (clienteId: string) => void
}

export function ClientesTable({
  clientes,
  onEdit,
  onDelete,
  onToggleStatus,
}: ClientesTableProps) {
  const [menuAbiertoId, setMenuAbiertoId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbiertoId(null)
      }
    }

    document.addEventListener('mousedown', handleClickFuera)
    return () => {
      document.removeEventListener('mousedown', handleClickFuera)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const months = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ]
    const [year, month, day] = dateString.split('-')
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`
  }

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#F97316]/30 bg-white py-16">
        <div className="mb-4 rounded-full bg-[#7C3AED]/10 p-4">
          <PawPrint className="h-8 w-8 text-[#7C3AED]" />
        </div>
        <h3 className="text-lg font-medium text-black">No hay clientes</h3>
        <p className="mt-1 text-gray-600">
          No se encontraron clientes con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#F97316] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="bg-[#7C3AED] text-left">
              <th className="px-4 py-4 text-sm font-semibold text-white">
                Cliente
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-white">
                Contacto
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-white">
                Ubicación / Dirección
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-white">
                Estado
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-white">
                Registro
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-white text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente.id}
                className="border-b border-[#F97316]/20 bg-white"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F97316]/30 bg-[#7C3AED]/10 text-sm font-semibold text-[#7C3AED]">
                      {getInitials(cliente.nombre)}
                    </div>

                    <div>
                      <p className="font-medium text-black">{cliente.nombre}</p>
                      <p className="text-sm text-gray-600">
                        ID: {cliente.idUsuario}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-black">
                      <Mail className="h-3.5 w-3.5 text-gray-500" />
                      {cliente.correo}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      {cliente.telefono}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-black">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {cliente.direccion}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      cliente.estado === 'activo'
                        ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        cliente.estado === 'activo'
                          ? 'bg-[#F97316]'
                          : 'bg-gray-400'
                      }`}
                    />
                    {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {formatDate(cliente.fechaRegistro)}
                </td>

                <td className="relative px-4 py-4 text-right">
                  <div
                    className="inline-block"
                    ref={menuAbiertoId === cliente.id ? menuRef : null}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMenuAbiertoId((prev) =>
                          prev === cliente.id ? null : cliente.id
                        )
                      }
                      className="rounded-lg p-2 text-[#F97316] hover:bg-[#F97316]/10"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuAbiertoId === cliente.id && (
                      <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-[#F97316]/30 bg-white shadow-2xl">
                        <button
                          type="button"
                          onClick={() => {
                            onEdit(cliente)
                            setMenuAbiertoId(null)
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-black hover:bg-[#F97316]/10"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Editar cliente</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onToggleStatus(cliente.id)
                            setMenuAbiertoId(null)
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-black hover:bg-[#F97316]/10"
                        >
                          <Power className="h-4 w-4" />
                          <span>
                            {cliente.estado === 'activo'
                              ? 'Desactivar'
                              : 'Activar'}
                          </span>
                        </button>

                        <div className="h-px bg-gray-200" />

                        <button
                          type="button"
                          onClick={() => {
                            onDelete(cliente.id)
                            setMenuAbiertoId(null)
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar cliente</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}