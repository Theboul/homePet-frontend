'use client'

import { useMemo, useState } from 'react'
import type { Cliente, ClienteFormData } from '../types'
import {
  useGetClientesQuery,
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} from '../store'
import {
  ClientesTable,
  ClienteDialog,
  DeleteClienteConfirmation,
} from '../components'
import { Plus, Search, Filter, Users, PawPrint, MapPin } from 'lucide-react'

export const GestionarClientes = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'activo' | 'inactivo'
  >('all')
  const [locationFilter, setLocationFilter] = useState('')

  const {
    data: clientes = [],
    isLoading: isFetching,
    isError,
  } = useGetClientesQuery({
    search: searchQuery || undefined,
    estado: statusFilter === 'all' ? undefined : statusFilter,
    direccion: locationFilter || undefined,
  })

  const [createCliente] = useCreateClienteMutation()
  const [updateCliente] = useUpdateClienteMutation()
  const [deleteCliente] = useDeleteClienteMutation()

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

    try {
      if (editingCliente) {
        await updateCliente({ id: editingCliente.id, data }).unwrap()
        alert('Cliente actualizado correctamente')
      } else {
        await createCliente(data).unwrap()
        alert('Cliente creado correctamente')
      }
      setIsDialogOpen(false)
      setEditingCliente(undefined)
    } catch (error: any) {
      console.error('Error al guardar cliente:', error)
      alert(error?.data?.detail || 'No se pudo guardar el cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (clienteId: string) => {
    setClienteToDelete(clienteId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clienteToDelete) {
      setDeleteDialogOpen(false)
      return
    }

    try {
      await deleteCliente(clienteToDelete).unwrap()
      setClienteToDelete(null)
      setDeleteDialogOpen(false)
      alert('Cliente eliminado correctamente')
    } catch (error) {
      console.error('No se pudo eliminar cliente:', error)
      alert('Error al eliminar cliente')
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleStatus = async (clienteId: string) => {
    const cliente = clientes.find((c) => c.id === clienteId)
    if (!cliente) return

    try {
      await updateCliente({
        id: clienteId,
        data: { estado: cliente.estado === 'activo' ? 'inactivo' : 'activo' },
      }).unwrap()
    } catch (error) {
      console.error('No se pudo cambiar el estado:', error)
      alert('No se pudo cambiar el estado del cliente')
    }
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-700">
            Error al cargar clientes. Verifica tu conexión con el backend.
          </div>
        </div>
      </section>
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
                      e.target.value as 'all' | 'activo' | 'inactivo',
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

        {isFetching ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-[#F97316]/30 bg-white">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
              <span className="text-[#7C3AED] font-bold">
                Cargando clientes...
              </span>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-black">
              Mostrando {filteredClientes.length} de {clientes.length} clientes
            </p>

            <ClientesTable
              clientes={filteredClientes}
              onEdit={handleEditCliente}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}

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
