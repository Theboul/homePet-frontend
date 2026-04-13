import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  useGetMascotasOptionsQuery,
  useGetPreciosOptionsQuery,
  useGetReservasQuery,
  useGetServiciosOptionsQuery,
  usePatchEstadoReservaMutation,
  usePatchReservaMutation,
} from '../store/reservasApi'
import type {
  EstadoReserva,
  ModalidadReserva,
  Reserva,
  ReservaPatchPayload,
} from '../store/reservas.types'

const estadoOptions: EstadoReserva[] = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA']
const modalidadOptions: ModalidadReserva[] = ['CLINICA', 'DOMICILIO']

type EditableReserva = {
  id: number
  mascota: string
  servicio: string
  precio_servicio: string
  fecha_programada: string
  hora_inicio: string
  modalidad: ModalidadReserva
  direccion_cita: string
  descripcion: string
  estado: EstadoReserva 
}

export const Gestionar_Reservas = () => {
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<'ALL' | EstadoReserva>('ALL')
  const [editing, setEditing] = useState<EditableReserva | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const { data: reservas = [], isLoading, refetch } = useGetReservasQuery()
  const { data: mascotas = [] } = useGetMascotasOptionsQuery()
  const { data: servicios = [] } = useGetServiciosOptionsQuery()
  const { data: precios = [] } = useGetPreciosOptionsQuery()
  const [patchReserva, { isLoading: isSaving }] = usePatchReservaMutation()
  const [patchEstadoReserva, { isLoading: isSavingStatus }] = usePatchEstadoReservaMutation()

  const visibleReservas = useMemo(() => {
    return reservas.filter((reserva) => {
      const matchesEstado = estadoFilter === 'ALL' || reserva.estado === estadoFilter
      const source = `${reserva.correo_usuario} ${reserva.mascota_nombre || ''} ${reserva.servicio_nombre || ''}`.toLowerCase()
      const matchesSearch = source.includes(search.trim().toLowerCase())
      return matchesEstado && matchesSearch
    })
  }, [reservas, search, estadoFilter])

  const preciosFiltrados = useMemo(() => {
    if (!editing?.servicio) return []
    return precios.filter((precio) => {
      return (
        precio.estado &&
        precio.servicio === Number(editing.servicio) &&
        precio.modalidad === editing.modalidad
      )
    })
  }, [precios, editing])

  const startEdit = (reserva: Reserva) => {
    setMessage(null)
    setCancelReason('')
    setEditing({
      id: reserva.id_cita,
      mascota: String(reserva.mascota),
      servicio: String(reserva.servicio),
      precio_servicio: String(reserva.precio_servicio),
      fecha_programada: reserva.fecha_programada,
      hora_inicio: (reserva.hora_inicio || '').slice(0, 5),
      modalidad: reserva.modalidad,
      direccion_cita: reserva.direccion_cita || '',
      descripcion: reserva.descripcion || '',
      estado: reserva.estado,
    })
  }

  const onChangeEditing = (field: keyof EditableReserva, value: string) => {
    if (!editing) return
    const next: EditableReserva = {
      ...editing,
      [field]: value,
    }
    if (field === 'servicio' || field === 'modalidad') {
      next.precio_servicio = ''
    }
    setEditing(next)
  }

  const saveEdit = async () => {
    if (!editing) return
    setMessage(null)

    const body: ReservaPatchPayload = {
      mascota: Number(editing.mascota),
      servicio: Number(editing.servicio),
      precio_servicio: Number(editing.precio_servicio),
      fecha_programada: editing.fecha_programada,
      hora_inicio: editing.hora_inicio,
      modalidad: editing.modalidad,
      direccion_cita: editing.modalidad === 'DOMICILIO' ? editing.direccion_cita : null,
      descripcion: editing.descripcion,
    }

    try {
      await patchReserva({ id: editing.id, body }).unwrap()
      await refetch()
      setMessage('Reserva actualizada correctamente.')
      setEditing(null)
    } catch {
      setMessage('No se pudo actualizar la reserva.')
    }
  }

  const updateStatus = async (id: number, estado: EstadoReserva) => {
    setMessage(null)
    const payload =
      estado === 'CANCELADA'
        ? { estado, motivo_cancelacion: cancelReason || 'Cancelada desde administración.' }
        : { estado }

    try {
      await patchEstadoReserva({ id, body: payload }).unwrap()
      await refetch()
      setMessage('Estado de la reserva actualizado.')
      setCancelReason('')
    } catch {
      setMessage('No se pudo cambiar el estado de la reserva.')
    }
  }

  return (
    <section className="space-y-5 text-gray-900">
      
      <div>
        <h1 className="text-3xl font-bold text-[#F97316]">Gestionar Reservas</h1>
        <p className="text-sm text-gray-700">Módulo de Gestión de Servicios y Reserva</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          className="text-gray-900"
          placeholder="Buscar por correo, mascota o servicio"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value as 'ALL' | EstadoReserva)}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900"
        >
          <option value="ALL">Todos los estados</option>
          {estadoOptions.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-end text-sm text-gray-700">
          {visibleReservas.length} reservas
        </div>
      </div>

      {message && <p className="text-sm text-[#7C3AED]">{message}</p>}

      {/* TABLA */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white text-gray-900">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Mascota</th>
              <th className="px-3 py-2">Servicio</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Hora</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {visibleReservas.map((reserva) => (
              <tr key={reserva.id_cita} className="border-t">
                <td className="px-3 py-2">#{reserva.id_cita}</td>
                <td className="px-3 py-2">{reserva.correo_usuario}</td>
                <td className="px-3 py-2">{reserva.mascota_nombre}</td>
                <td className="px-3 py-2">{reserva.servicio_nombre}</td>
                <td className="px-3 py-2">{reserva.fecha_programada}</td>
                <td className="px-3 py-2">{(reserva.hora_inicio || '').slice(0, 5)}</td>
                <td className="px-3 py-2">{reserva.estado}</td>

                <td className="px-3 py-2">
                  <Button onClick={() => startEdit(reserva)}>Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 text-gray-900">
    
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Editar Reserva #{editing.id}</h2>
      <Button onClick={() => setEditing(null)}>Cerrar</Button>
    </div>

    <div className="grid gap-3 md:grid-cols-3">

      {/* Mascota */}
      <select
        value={editing.mascota}
        onChange={(e) => onChangeEditing('mascota', e.target.value)}
        className="h-10 border rounded px-3 text-sm text-gray-900"
      >
        <option value="">Mascota</option>
        {mascotas.map((m) => (
          <option key={m.id_mascota} value={m.id_mascota}>
            {m.nombre}
          </option>
        ))}
      </select>

      {/* Servicio */}
      <select
        value={editing.servicio}
        onChange={(e) => onChangeEditing('servicio', e.target.value)}
        className="h-10 border rounded px-3 text-sm text-gray-900"
      >
        <option value="">Servicio</option>
        {servicios.filter(s => s.estado).map((s) => (
          <option key={s.id_servicio} value={s.id_servicio}>
            {s.nombre}
          </option>
        ))}
      </select>

      {/* Modalidad */}
      <select
        value={editing.modalidad}
        onChange={(e) => onChangeEditing('modalidad', e.target.value)}
        className="h-10 border rounded px-3 text-sm text-gray-900"
      >
        {modalidadOptions.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Precio */}
      <select
        value={editing.precio_servicio}
        onChange={(e) => onChangeEditing('precio_servicio', e.target.value)}
        className="h-10 border rounded px-3 text-sm text-gray-900"
      >
        <option value="">Precio</option>
        {preciosFiltrados.map((p) => (
          <option key={p.id_precio} value={p.id_precio}>
            {p.variacion} - Bs. {p.precio}
          </option>
        ))}
      </select>

      {/* Fecha */}
      <Input
        type="date"
        value={editing.fecha_programada}
        onChange={(e) => onChangeEditing('fecha_programada', e.target.value)}
      />

      {/* Hora */}
      <Input
        type="time"
        value={editing.hora_inicio}
        onChange={(e) => onChangeEditing('hora_inicio', e.target.value)}
      />

      {/* Dirección */}
      {editing.modalidad === 'DOMICILIO' && (
        <Input
          className="md:col-span-3"
          placeholder="Dirección"
          value={editing.direccion_cita}
          onChange={(e) => onChangeEditing('direccion_cita', e.target.value)}
        />
      )}

      {/* Descripción */}
      <Input
        className="md:col-span-3"
        placeholder="Descripción"
        value={editing.descripcion}
        onChange={(e) => onChangeEditing('descripcion', e.target.value)}
      />
    </div>

    <div className="flex gap-3">
      <Button onClick={saveEdit}>
        Guardar cambios
      </Button>

      <Button variant="outline" onClick={() => setEditing(null)}>
        Cancelar
      </Button>
    </div>
  </div>
)}
    </section>
  )
}