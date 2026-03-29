'use client'

import { useMemo, useState } from 'react'
import type { Cliente, ClienteFormData } from '../types'
import { initialClientes } from '../store'
import {
  ClientesTable,
  ClienteDialog,
  DeleteClienteConfirmation,
} from '../components'
import { Plus, Search, Filter, Users, PawPrint, MapPin } from 'lucide-react'

export function GestionarClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')
  const [locationFilter, setLocationFilter] = useState('')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null)

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const matchesSearch =
        searchQuery === '' ||
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.telefono.includes(searchQuery)

      const matchesStatus =
        statusFilter === 'all' || cliente.estado === statusFilter

      const matchesLocation =
        locationFilter.trim() === '' ||
        cliente.direccion.toLowerCase().includes(locationFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesLocation
    })
  }, [clientes, searchQuery, statusFilter, locationFilter])

  const stats = useMemo(() => {
    const total = clientes.length
    const activos = clientes.filter((c) => c.estado === 'activo').length
    const ciudades = new Set(clientes.map((c) => c.direccion)).size
    return { total, activos, ciudades }
  }, [clientes])

  const handleCreateCliente = () => {
    setEditingCliente(undefined)
    setIsDialogOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: ClienteFormData) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (editingCliente) {
      setClientes((prev) =>
        prev.map((cliente) =>
          cliente.id === editingCliente.id ? { ...cliente, ...data } : cliente
        )
      )
    } else {
      const newCliente: Cliente = {
        id: Date.now().toString(),
        idUsuario: Math.floor(Math.random() * 1000) + 100,
        ...data,
        rol: 'cliente',
        fechaRegistro: new Date().toISOString().split('T')[0],
      }

      setClientes((prev) => [newCliente, ...prev])
    }

    setIsLoading(false)
    setIsDialogOpen(false)
    setEditingCliente(undefined)
  }

  const handleDeleteClick = (clienteId: string) => {
    setClienteToDelete(clienteId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (clienteToDelete) {
      setClientes((prev) =>
        prev.filter((cliente) => cliente.id !== clienteToDelete)
      )
      setClienteToDelete(null)
    }

    setDeleteDialogOpen(false)
  }

  const handleToggleStatus = (clienteId: string) => {
    setClientes((prev) =>
      prev.map((cliente) =>
        cliente.id === clienteId
          ? {
              ...cliente,
              estado: cliente.estado === 'activo' ? 'inactivo' : 'activo',
            }
          : cliente
      )
    )
  }

  return (
    <section className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-[#7C3AED]/10 p-2">
              <PawPrint className="h-6 w-6 text-[#7C3AED]" />
            </div>
            <h1 className="text-4xl font-bold text-[#F97316]">
              Gestionar Clientes
            </h1>
          </div>

          <p className="mt-2 text-black">
            Administra los clientes de la veterinaria
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <Users className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total clientes</p>
                <p className="text-3xl font-bold text-[#7C3AED]">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#F97316]/10 p-2">
                <PawPrint className="h-5 w-5 text-[#F97316]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes activos</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-[#F97316]">
                    {stats.activos}
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <MapPin className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ubicaciones</p>
                <p className="text-3xl font-bold text-[#7C3AED]">
                  {stats.ciudades}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 text-[#7C3AED] outline-none placeholder:text-[#7C3AED]/60"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as 'all' | 'activo' | 'inactivo'
                    )
                  }
                  className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 pr-8 text-[#7C3AED] outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
                <input
                  type="text"
                  placeholder="Ubicación o dirección..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 pr-4 text-[#7C3AED] outline-none placeholder:text-[#7C3AED]/60"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateCliente}
            className="inline-flex h-11 items-center rounded-xl bg-[#F97316] px-5 font-medium text-white transition hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo cliente
          </button>
        </div>

        <p className="text-sm text-black">
          Mostrando {filteredClientes.length} de {clientes.length} clientes
        </p>

        <ClientesTable
          clientes={filteredClientes}
          onEdit={handleEditCliente}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />

        <ClienteDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) setEditingCliente(undefined)
          }}
          cliente={editingCliente}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <DeleteClienteConfirmation
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </section>
  )
}