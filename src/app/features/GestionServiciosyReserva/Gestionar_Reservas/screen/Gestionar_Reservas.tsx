import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { EditReservaModal } from '../components'
import {
  useGetMascotasOptionsQuery,
  useGetPreciosOptionsQuery,
  useGetReservasQuery,
  useGetServiciosOptionsQuery,
  usePatchEstadoReservaMutation,
  useUpdateReservaMutation,
} from '../store/reservasApi'
import type {
  EstadoReserva,
  ModalidadReserva,
  Reserva,
  ReservaPatchPayload,
} from '../store/reservas.types'
import { useCanEdit, useCanDelete } from '#/store/auth/auth.hooks'

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

  const canEdit = useCanEdit('SERV_CITAS')
  const canDelete = useCanDelete('SERV_CITAS')

  const { data: reservas = [], refetch } = useGetReservasQuery()
  const { data: mascotas = [] } = useGetMascotasOptionsQuery()
  const { data: servicios = [] } = useGetServiciosOptionsQuery()
  const { data: precios = [] } = useGetPreciosOptionsQuery()
  const [updateReserva] = useUpdateReservaMutation()
  const [patchEstadoReserva] = usePatchEstadoReservaMutation()

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
      await updateReserva({ id: editing.id, body }).unwrap()
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
      <div className="overflow-x-auto rounded-lg border border-violet-200 bg-white text-gray-900">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="bg-violet-600 text-white" >
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Mascota</th>
              <th className="px-3 py-2">Servicio</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Hora</th>
              <th className="px-3 py-2">Estado</th>
              {(canEdit || canDelete) && (
                <th className="px-3 py-2 text-right">Acciones</th>
              )}
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

                {(canEdit || canDelete) && (
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <>
                          <Button 
                            className="bg-orange-500 text-white h-8 text-xs px-3"
                            onClick={() => startEdit(reserva)}
                          >
                            Editar
                          </Button>
                          {reserva.estado === 'PENDIENTE' && (
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-3"
                              onClick={() => updateStatus(reserva.id_cita, 'COMPLETADA')}
                            >
                              Completar
                            </Button>
                          )}
                        </>
                      )}
                      
                      {canDelete && reserva.estado === 'PENDIENTE' && (
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white h-8 text-xs px-3"
                          onClick={() => {
                            if (window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
                              updateStatus(reserva.id_cita, 'CANCELADA')
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))} 
          </tbody>
        </table>
      </div>

        <EditReservaModal
        editing={editing}
        setEditing={setEditing}
        onChangeEditing={onChangeEditing}
        saveEdit={saveEdit}
        mascotas={mascotas}
        servicios={servicios}
        preciosFiltrados={preciosFiltrados}
        modalidadOptions={modalidadOptions}
        />
    </section>
  )
}