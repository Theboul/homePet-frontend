import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import {
  useCancelCitaMutation,
  useCreateCitaMutation,
  useGetMisCitasQuery,
  useGetMisMascotasQuery,
  useGetPreciosServicioQuery,
  useGetServiciosQuery,
  useUpdateCitaMutation,
} from '../store/clienteApi'
import type { Cita, CitaPayload, ModalidadCita } from '../store/cliente.types'

const initialForm = {
  mascota: '',
  servicio: '',
  precio_servicio: '',
  fecha_programada: '',
  hora_inicio: '',
  modalidad: 'CLINICA' as ModalidadCita,
  direccion_cita: '',
  descripcion: '',
}

export function MisReservasScreen() {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const { data: mascotas = [] } = useGetMisMascotasQuery()
  const { data: servicios = [] } = useGetServiciosQuery()
  const { data: precios = [] } = useGetPreciosServicioQuery()
  const { data: citas = [], isLoading: loadingCitas } = useGetMisCitasQuery()
  const [createCita, { isLoading: creating }] = useCreateCitaMutation()
  const [updateCita, { isLoading: updating }] = useUpdateCitaMutation()
  const [cancelCita, { isLoading: canceling }] = useCancelCitaMutation()

  const activeServicios = servicios.filter((servicio) => servicio.estado)
  const selectedServiceId = form.servicio ? Number(form.servicio) : null
  const availablePrecios = precios.filter(
    (precio) =>
      precio.estado &&
      (!selectedServiceId || precio.servicio === selectedServiceId) &&
      precio.modalidad === form.modalidad,
  )

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.mascota &&
          form.servicio &&
          form.precio_servicio &&
          form.fecha_programada &&
          form.hora_inicio &&
          (form.modalidad === 'CLINICA' || form.direccion_cita.trim()),
      ),
    [form],
  )

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setMessage(null)
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'servicio' || field === 'modalidad' ? { precio_servicio: '' } : {}),
    }))
  }

  const buildPayload = (): CitaPayload => ({
    mascota: Number(form.mascota),
    servicio: Number(form.servicio),
    precio_servicio: Number(form.precio_servicio),
    fecha_programada: form.fecha_programada,
    hora_inicio: form.hora_inicio,
    modalidad: form.modalidad,
    direccion_cita: form.modalidad === 'DOMICILIO' ? form.direccion_cita.trim() : null,
    descripcion: form.descripcion.trim(),
  })

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    try {
      if (editingId) {
        await updateCita({ id: editingId, body: buildPayload() }).unwrap()
        setMessage('Reserva modificada correctamente.')
      } else {
        await createCita(buildPayload()).unwrap()
        setMessage('Reserva creada correctamente.')
      }
      resetForm()
    } catch {
      setMessage('No se pudo guardar la reserva. Revisa los datos.')
    }
  }

  const startEdit = (cita: Cita) => {
    setMessage(null)
    setEditingId(cita.id_cita)
    setForm({
      mascota: String(cita.mascota),
      servicio: String(cita.servicio),
      precio_servicio: String(cita.precio_servicio),
      fecha_programada: cita.fecha_programada,
      hora_inicio: cita.hora_inicio.slice(0, 5),
      modalidad: cita.modalidad,
      direccion_cita: cita.direccion_cita || '',
      descripcion: cita.descripcion || '',
    })
  }

  const handleCancel = async () => {
    if (!cancelId || !cancelReason.trim()) return

    try {
      await cancelCita({ id: cancelId, motivo_cancelacion: cancelReason.trim() }).unwrap()
      setCancelId(null)
      setCancelReason('')
      setMessage('Reserva cancelada correctamente.')
    } catch {
      setMessage('No se pudo cancelar la reserva.')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Mis reservas
        </p>
        <h1 className="text-3xl font-bold text-gray-900">
          {editingId ? 'Modificar reserva' : 'Agregar cita o reserva'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <select value={form.mascota} onChange={(e) => updateField('mascota', e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800">
          <option value="">Selecciona mascota</option>
          {mascotas.map((mascota) => (
            <option key={mascota.id_mascota} value={mascota.id_mascota}>
              {mascota.nombre}
            </option>
          ))}
        </select>

        <select value={form.servicio} onChange={(e) => updateField('servicio', e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800">
          <option value="">Selecciona servicio</option>
          {activeServicios.map((servicio) => (
            <option key={servicio.id_servicio} value={servicio.id_servicio}>
              {servicio.nombre}
            </option>
          ))}
        </select>

        <select value={form.modalidad} onChange={(e) => updateField('modalidad', e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800">
          <option value="CLINICA">Clinica</option>
          <option value="DOMICILIO">Domicilio</option>
        </select>

        <select value={form.precio_servicio} onChange={(e) => updateField('precio_servicio', e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800">
          <option value="">Selecciona precio</option>
          {availablePrecios.map((precio) => (
            <option key={precio.id_precio} value={precio.id_precio}>
              {precio.variacion} - Bs. {precio.precio}
            </option>
          ))}
        </select>

        <Input type="date" value={form.fecha_programada} onChange={(e) => updateField('fecha_programada', e.target.value)} />
        <Input type="time" value={form.hora_inicio} onChange={(e) => updateField('hora_inicio', e.target.value)} />

        {form.modalidad === 'DOMICILIO' && (
          <Input className="md:col-span-2" placeholder="Direccion para la cita" value={form.direccion_cita} onChange={(e) => updateField('direccion_cita', e.target.value)} />
        )}

        <Textarea className="md:col-span-2" placeholder="Descripcion o indicaciones" value={form.descripcion} onChange={(e) => updateField('descripcion', e.target.value)} />

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <Button disabled={!canSubmit || creating || updating} className="bg-orange-500 hover:bg-orange-600">
            {editingId ? 'Guardar cambios' : 'Crear reserva'}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar edicion
            </Button>
          )}
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </form>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Reservas registradas</h2>
        {loadingCitas ? (
          <p className="mt-3 text-sm text-gray-600">Cargando reservas...</p>
        ) : citas.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">Aun no tienes reservas.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {citas.map((cita) => (
              <div key={cita.id_cita} className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {cita.servicio_nombre || 'Servicio'} para {cita.mascota_nombre || 'mascota'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cita.fecha_programada} a las {cita.hora_inicio.slice(0, 5)} - {cita.modalidad}
                    </p>
                    <p className="text-sm text-gray-500">Estado: {cita.estado}</p>
                  </div>
                  <div className="flex gap-2">
                    {cita.estado === 'PENDIENTE' && (
                      <Button type="button" variant="outline" onClick={() => startEdit(cita)}>
                        Modificar
                      </Button>
                    )}
                    {cita.estado !== 'CANCELADA' && (
                      <Button type="button" variant="outline" onClick={() => setCancelId(cita.id_cita)}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>

                {cancelId === cita.id_cita && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <Textarea placeholder="Motivo de cancelacion" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                    <div className="flex gap-2">
                      <Button type="button" disabled={canceling || !cancelReason.trim()} onClick={handleCancel}>
                        Confirmar cancelacion
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setCancelId(null)}>
                        Cerrar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
