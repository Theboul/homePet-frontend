'use client'

import { useMemo, useState } from 'react'
import {
  DollarSign,
  Filter,
  PawPrint,
  Plus,
  Scissors,
  Search,
  Tags,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  CategoriaServicioDialog,
  CategoriasServicioTable,
  DeleteCategoriaServicioConfirmation,
  DeletePrecioServicioConfirmation,
  DeleteServicioConfirmation,
  PrecioServicioDialog,
  PreciosServicioTable,
  ServicioDialog,
  ServiciosTable,
} from '../components'

import {
  useCreateCategoriaServicioMutation,
  useCreatePrecioServicioMutation,
  useCreateServicioMutation,
  useDeleteCategoriaServicioMutation,
  useDeletePrecioServicioMutation,
  useDeleteServicioMutation,
  useGetCategoriasServicioQuery,
  useGetPreciosServicioQuery,
  useGetServiciosQuery,
  useUpdateCategoriaServicioMutation,
  useUpdatePrecioServicioMutation,
  useUpdateServicioMutation,
} from '../store'

import type {
  CategoriaServicio,
  CategoriaServicioPayload,
  PrecioServicio,
  PrecioServicioPayload,
  Servicio,
  ServicioPayload,
} from '../store'

type TabKey = 'categorias' | 'servicios' | 'precios'
type EstadoFiltro = 'all' | 'activo' | 'inactivo'

const getErrorMessage = (error: unknown): string => {
  const fallback = 'Ocurrió un error inesperado.'

  if (!error || typeof error !== 'object') return fallback

  const maybeError = error as {
    data?: Record<string, unknown>
    error?: string
  }

  if (typeof maybeError.error === 'string') return maybeError.error
  if (!maybeError.data || typeof maybeError.data !== 'object') return fallback

  const values = Object.values(maybeError.data)
  const first = values[0]

  if (Array.isArray(first)) return String(first[0])
  if (typeof first === 'string') return first

  return fallback
}

export const Gestionar_Catalogo_Servicios_Precios = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('categorias')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<EstadoFiltro>('all')

  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false)
  const [servicioDialogOpen, setServicioDialogOpen] = useState(false)
  const [precioDialogOpen, setPrecioDialogOpen] = useState(false)

  const [categoriaToEdit, setCategoriaToEdit] =
    useState<CategoriaServicio | null>(null)
  const [servicioToEdit, setServicioToEdit] = useState<Servicio | null>(null)
  const [precioToEdit, setPrecioToEdit] = useState<PrecioServicio | null>(null)

  const [categoriaToToggle, setCategoriaToToggle] =
    useState<CategoriaServicio | null>(null)
  const [servicioToToggle, setServicioToToggle] = useState<Servicio | null>(
    null,
  )
  const [precioToToggle, setPrecioToToggle] = useState<PrecioServicio | null>(
    null,
  )

  const { data: categoriasData = [], isLoading: isLoadingCategorias } =
    useGetCategoriasServicioQuery(undefined)

  const { data: serviciosData = [], isLoading: isLoadingServicios } =
    useGetServiciosQuery(undefined)

  const { data: preciosData = [], isLoading: isLoadingPrecios } =
    useGetPreciosServicioQuery(undefined)

  const [createCategoria, { isLoading: isCreatingCategoria }] =
    useCreateCategoriaServicioMutation()
  const [updateCategoria, { isLoading: isUpdatingCategoria }] =
    useUpdateCategoriaServicioMutation()
  const [deleteCategoria, { isLoading: isDeletingCategoria }] =
    useDeleteCategoriaServicioMutation()

  const [createServicio, { isLoading: isCreatingServicio }] =
    useCreateServicioMutation()
  const [updateServicio, { isLoading: isUpdatingServicio }] =
    useUpdateServicioMutation()
  const [deleteServicio, { isLoading: isDeletingServicio }] =
    useDeleteServicioMutation()

  const [createPrecio, { isLoading: isCreatingPrecio }] =
    useCreatePrecioServicioMutation()
  const [updatePrecio, { isLoading: isUpdatingPrecio }] =
    useUpdatePrecioServicioMutation()
  const [deletePrecio, { isLoading: isDeletingPrecio }] =
    useDeletePrecioServicioMutation()

  const categorias = categoriasData
  const servicios = serviciosData
  const precios = preciosData

  const categoriasActivas = useMemo(
    () => categorias.filter((categoria) => categoria.estado),
    [categorias],
  )

  const serviciosActivos = useMemo(
    () => servicios.filter((servicio) => servicio.estado),
    [servicios],
  )

  const stats = useMemo(() => {
    const totalCategorias = categorias.length
    const serviciosActivosCount = servicios.filter((s) => s.estado).length
    const totalPrecios = precios.length

    return {
      totalCategorias,
      serviciosActivosCount,
      totalPrecios,
    }
  }, [categorias, servicios, precios])

  const filteredCategorias = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()

    return categorias.filter((categoria) => {
      const matchesSearch =
        !term ||
        categoria.nombre.toLowerCase().includes(term) ||
        (categoria.descripcion ?? '').toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'activo' && categoria.estado) ||
        (statusFilter === 'inactivo' && !categoria.estado)

      return matchesSearch && matchesStatus
    })
  }, [categorias, searchQuery, statusFilter])

  const filteredServicios = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()

    return servicios.filter((servicio) => {
      const matchesSearch =
        !term ||
        servicio.nombre.toLowerCase().includes(term) ||
        (servicio.descripcion ?? '').toLowerCase().includes(term) ||
        (servicio.categoria_nombre ?? '').toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'activo' && servicio.estado) ||
        (statusFilter === 'inactivo' && !servicio.estado)

      return matchesSearch && matchesStatus
    })
  }, [servicios, searchQuery, statusFilter])

  const filteredPrecios = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()

    return precios.filter((precio) => {
      const matchesSearch =
        !term ||
        (precio.servicio_nombre ?? '').toLowerCase().includes(term) ||
        precio.variacion.toLowerCase().includes(term) ||
        (precio.modalidad ?? '').toLowerCase().includes(term) ||
        String(precio.precio).toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'activo' && precio.estado) ||
        (statusFilter === 'inactivo' && !precio.estado)

      return matchesSearch && matchesStatus
    })
  }, [precios, searchQuery, statusFilter])

  const currentCount =
    activeTab === 'categorias'
      ? filteredCategorias.length
      : activeTab === 'servicios'
        ? filteredServicios.length
        : filteredPrecios.length

  const currentTotal =
    activeTab === 'categorias'
      ? categorias.length
      : activeTab === 'servicios'
        ? servicios.length
        : precios.length

  const handleSubmitCategoria = async (values: CategoriaServicioPayload) => {
    try {
      if (categoriaToEdit) {
        await updateCategoria({
          id: categoriaToEdit.id_categoria,
          data: values,
        }).unwrap()
        toast.success('Categoría actualizada correctamente.')
      } else {
        await createCategoria(values).unwrap()
        toast.success('Categoría registrada correctamente.')
      }

      setCategoriaDialogOpen(false)
      setCategoriaToEdit(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSubmitServicio = async (values: ServicioPayload) => {
    try {
      if (servicioToEdit) {
        await updateServicio({
          id: servicioToEdit.id_servicio,
          data: values,
        }).unwrap()
        toast.success('Servicio actualizado correctamente.')
      } else {
        await createServicio(values).unwrap()
        toast.success('Servicio registrado correctamente.')
      }

      setServicioDialogOpen(false)
      setServicioToEdit(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSubmitPrecio = async (values: PrecioServicioPayload) => {
    try {
      if (precioToEdit) {
        await updatePrecio({
          id: precioToEdit.id_precio,
          data: values,
        }).unwrap()
        toast.success('Precio actualizado correctamente.')
      } else {
        await createPrecio(values).unwrap()
        toast.success('Precio registrado correctamente.')
      }

      setPrecioDialogOpen(false)
      setPrecioToEdit(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleToggleCategoria = async () => {
    if (!categoriaToToggle) return

    try {
      await deleteCategoria(categoriaToToggle.id_categoria).unwrap()
      toast.success('Estado de la categoría actualizado.')
      setCategoriaToToggle(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleToggleServicio = async () => {
    if (!servicioToToggle) return

    try {
      await deleteServicio(servicioToToggle.id_servicio).unwrap()
      toast.success('Estado del servicio actualizado.')
      setServicioToToggle(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleTogglePrecio = async () => {
    if (!precioToToggle) return

    try {
      await deletePrecio(precioToToggle.id_precio).unwrap()
      toast.success('Estado del precio actualizado.')
      setPrecioToToggle(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCreate = () => {
    if (activeTab === 'categorias') {
      setCategoriaToEdit(null)
      setCategoriaDialogOpen(true)
      return
    }

    if (activeTab === 'servicios') {
      setServicioToEdit(null)
      setServicioDialogOpen(true)
      return
    }

    setPrecioToEdit(null)
    setPrecioDialogOpen(true)
  }

  const createLabel =
    activeTab === 'categorias'
      ? 'Nueva categoría'
      : activeTab === 'servicios'
        ? 'Nuevo servicio'
        : 'Nuevo precio'

  const currentLoading =
    activeTab === 'categorias'
      ? isLoadingCategorias
      : activeTab === 'servicios'
        ? isLoadingServicios
        : isLoadingPrecios

  return (
    <section className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-[#7C3AED]/10 p-2">
              <PawPrint className="h-6 w-6 text-[#7C3AED]" />
            </div>
            <h1 className="text-3xl font-bold text-[#F97316] sm:text-4xl">
              Gestionar catálogo de servicios y precios
            </h1>
          </div>

          <p className="mt-2 text-black">
            Administra categorías, servicios y precios de la veterinaria
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <Tags className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total categorías</p>
                <p className="text-3xl font-bold text-[#7C3AED]">
                  {stats.totalCategorias}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#F97316]/10 p-2">
                <Scissors className="h-5 w-5 text-[#F97316]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Servicios activos</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-[#F97316]">
                    {stats.serviciosActivosCount}
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F97316]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#7C3AED]/10 p-2">
                <DollarSign className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Precios registrados</p>
                <p className="text-3xl font-bold text-[#7C3AED]">
                  {stats.totalPrecios}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('categorias')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === 'categorias'
                ? 'bg-[#7C3AED] text-white'
                : 'border border-[#7C3AED] bg-white text-[#7C3AED]'
            }`}
          >
            Categorías
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('servicios')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === 'servicios'
                ? 'bg-[#7C3AED] text-white'
                : 'border border-[#7C3AED] bg-white text-[#7C3AED]'
            }`}
          >
            Servicios
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('precios')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === 'precios'
                ? 'bg-[#7C3AED] text-white'
                : 'border border-[#7C3AED] bg-white text-[#7C3AED]'
            }`}
          >
            Precios
          </button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C3AED]/70" />
              <input
                type="text"
                placeholder={
                  activeTab === 'categorias'
                    ? 'Buscar categorías...'
                    : activeTab === 'servicios'
                      ? 'Buscar servicios...'
                      : 'Buscar precios...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 text-black outline-none placeholder:text-gray-500"
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
                  className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 pl-9 pr-8 text-black outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F97316] px-5 font-medium text-white transition hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </button>
        </div>

        <p className="text-sm text-black">
          Mostrando {currentCount} de {currentTotal}{' '}
          {activeTab === 'categorias'
            ? 'categorías'
            : activeTab === 'servicios'
              ? 'servicios'
              : 'precios'}
        </p>

        {activeTab === 'categorias' && (
          <CategoriasServicioTable
            data={filteredCategorias}
            onEdit={(categoria) => {
              setCategoriaToEdit(categoria)
              setCategoriaDialogOpen(true)
            }}
            onToggleStatus={(categoria) => setCategoriaToToggle(categoria)}
          />
        )}

        {activeTab === 'servicios' && (
          <ServiciosTable
            data={filteredServicios}
            onEdit={(servicio) => {
              setServicioToEdit(servicio)
              setServicioDialogOpen(true)
            }}
            onToggleStatus={(servicio) => setServicioToToggle(servicio)}
          />
        )}

        {activeTab === 'precios' && (
          <PreciosServicioTable
            data={filteredPrecios}
            onEdit={(precio) => {
              setPrecioToEdit(precio)
              setPrecioDialogOpen(true)
            }}
            onToggleStatus={(precio) => setPrecioToToggle(precio)}
          />
        )}

        {currentLoading && (
          <p className="text-sm text-gray-600">
            Cargando{' '}
            {activeTab === 'categorias'
              ? 'categorías'
              : activeTab === 'servicios'
                ? 'servicios'
                : 'precios'}
            ...
          </p>
        )}

        <CategoriaServicioDialog
          open={categoriaDialogOpen}
          onOpenChange={(open) => {
            setCategoriaDialogOpen(open)
            if (!open) setCategoriaToEdit(null)
          }}
          categoria={categoriaToEdit}
          onSubmit={handleSubmitCategoria}
          isLoading={isCreatingCategoria || isUpdatingCategoria}
        />

        <ServicioDialog
          open={servicioDialogOpen}
          onOpenChange={(open) => {
            setServicioDialogOpen(open)
            if (!open) setServicioToEdit(null)
          }}
          categorias={categoriasActivas}
          servicio={servicioToEdit}
          onSubmit={handleSubmitServicio}
          isLoading={isCreatingServicio || isUpdatingServicio}
        />

        <PrecioServicioDialog
          open={precioDialogOpen}
          onOpenChange={(open) => {
            setPrecioDialogOpen(open)
            if (!open) setPrecioToEdit(null)
          }}
          servicios={serviciosActivos}
          precio={precioToEdit}
          onSubmit={handleSubmitPrecio}
          isLoading={isCreatingPrecio || isUpdatingPrecio}
        />

        <DeleteCategoriaServicioConfirmation
          open={!!categoriaToToggle}
          onOpenChange={(open) => {
            if (!open) setCategoriaToToggle(null)
          }}
          categoria={categoriaToToggle}
          onConfirm={handleToggleCategoria}
          isLoading={isDeletingCategoria}
        />

        <DeleteServicioConfirmation
          open={!!servicioToToggle}
          onOpenChange={(open) => {
            if (!open) setServicioToToggle(null)
          }}
          servicio={servicioToToggle}
          onConfirm={handleToggleServicio}
          isLoading={isDeletingServicio}
        />

        <DeletePrecioServicioConfirmation
          open={!!precioToToggle}
          onOpenChange={(open) => {
            if (!open) setPrecioToToggle(null)
          }}
          precio={precioToToggle}
          onConfirm={handleTogglePrecio}
          isLoading={isDeletingPrecio}
        />
      </div>
    </section>
  )
}
