import {
  Users,
  PawPrint,
  Calendar as CalendarIcon,
  DollarSign,
} from 'lucide-react'
import { useMemo } from 'react'
import { StatCard } from '../components/StatCard'
import { AppointmentsTable } from '../components/AppointmentsTable'
import { RecentActivity } from '../components/RecentActivity'
import { useAppSelector } from '#/store/hooks'
import {
  useGetDashboardCitasQuery,
  useGetDashboardClientesQuery,
  useGetDashboardMascotasQuery,
} from '../store/dashboardApi'

function isToday(dateInput?: string | null) {
  if (!dateInput) return false
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return false
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

function isCurrentMonth(dateInput?: string | null) {
  if (!dateInput) return false
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return false
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  )
}

function dateLabelFromNow(dateInput?: string | null) {
  if (!dateInput) return 'Reciente'
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return 'Reciente'
  return date.toLocaleString()
}

export function DashboardScreen() {
  const veterinaria = useAppSelector((state) => state.tenant.veterinaria)
  const {
    data: clientesData,
    isLoading: clientesLoading,
    error: clientesError,
  } = useGetDashboardClientesQuery()
  const {
    data: mascotasData,
    isLoading: mascotasLoading,
    error: mascotasError,
  } = useGetDashboardMascotasQuery()
  const {
    data: citasData = [],
    isLoading: citasLoading,
    error: citasError,
  } = useGetDashboardCitasQuery()

  const clientesTotal = clientesData?.count
  const mascotasTotal = mascotasData?.count

  const citasHoy = useMemo(
    () =>
      citasData.filter((cita) =>
        isToday((cita as { fecha_programada?: string }).fecha_programada),
      ),
    [citasData],
  )

  const ingresosMes = useMemo(() => {
    return citasData.reduce((acc, cita) => {
      const citaWithAny = cita as {
        fecha_programada?: string
        fecha_generada?: string
        precio_servicio?: number
        precio?: string
      }

      const baseDate =
        citaWithAny.fecha_programada ?? citaWithAny.fecha_generada ?? null
      if (!isCurrentMonth(baseDate)) return acc

      if (typeof citaWithAny.precio_servicio === 'number') {
        return acc + citaWithAny.precio_servicio
      }
      if (typeof citaWithAny.precio === 'string') {
        const parsed = Number(citaWithAny.precio.replace(',', '.'))
        if (!Number.isNaN(parsed)) return acc + parsed
      }
      return acc
    }, 0)
  }, [citasData])

  const recentActivity = useMemo(
    () =>
      [...citasData]
        .sort((a, b) => {
          const aDate = new Date(
            (a as { fecha_generada?: string; fecha_programada?: string })
              .fecha_generada ??
              (a as { fecha_programada?: string }).fecha_programada ??
              0,
          ).getTime()
          const bDate = new Date(
            (b as { fecha_generada?: string; fecha_programada?: string })
              .fecha_generada ??
              (b as { fecha_programada?: string }).fecha_programada ??
              0,
          ).getTime()
          return bDate - aDate
        })
        .slice(0, 5)
        .map((cita) => ({
          id: String((cita as { id_cita?: number }).id_cita ?? Math.random()),
          title: 'Cita registrada',
          description: `${
            (cita as { mascota_nombre?: string }).mascota_nombre ?? 'Mascota'
          } - ${
            (cita as { servicio_nombre?: string }).servicio_nombre ?? 'Servicio'
          }`,
          time: dateLabelFromNow(
            (cita as { fecha_generada?: string; fecha_programada?: string })
              .fecha_generada ??
              (cita as { fecha_programada?: string }).fecha_programada,
          ),
        })),
    [citasData],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
          Bienvenido
        </h2>
        <p className="text-gray-500 mt-1">
          {veterinaria?.nombre
            ? `Resumen de ${veterinaria.nombre}`
            : 'Resumen de tu clinica veterinaria.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Clientes Totales"
          value={clientesTotal}
          trend={
            clientesError
              ? 'Error al cargar'
              : clientesLoading
                ? 'Cargando...'
                : clientesTotal === 0
                  ? 'Sin datos'
                  : 'Datos reales'
          }
          trendUp={false}
          hasError={Boolean(clientesError)}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          iconBgSpan="bg-purple-100"
        />
        <StatCard
          title="Mascotas Registradas"
          value={mascotasTotal}
          trend={
            mascotasError
              ? 'Error al cargar'
              : mascotasLoading
                ? 'Cargando...'
                : mascotasTotal === 0
                  ? 'Sin datos'
                  : 'Datos reales'
          }
          trendUp={false}
          hasError={Boolean(mascotasError)}
          icon={<PawPrint className="w-5 h-5 text-orange-500" />}
          iconBgSpan="bg-orange-100"
        />
        <StatCard
          title="Citas Hoy"
          value={citasHoy.length}
          trend={
            citasError
              ? 'Error al cargar'
              : citasLoading
                ? 'Cargando...'
                : citasHoy.length === 0
                  ? 'Sin citas hoy'
                  : 'Datos reales'
          }
          trendUp={false}
          hasError={Boolean(citasError)}
          icon={<CalendarIcon className="w-5 h-5 text-purple-600" />}
          iconBgSpan="bg-purple-100"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${ingresosMes.toFixed(2)}`}
          trend={
            citasError
              ? 'Error al cargar'
              : citasLoading
                ? 'Cargando...'
                : ingresosMes === 0
                  ? 'Sin facturacion'
                  : 'Datos reales'
          }
          trendUp={false}
          hasError={Boolean(citasError)}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          iconBgSpan="bg-green-100"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-80 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 font-sans mb-4">
          Consultas de la Semana
        </h3>
        <div className="flex-1 border-t border-dashed border-gray-200 mt-2 relative flex items-end justify-between px-4 pb-2">
          <svg
            className="absolute inset-0 w-full h-full preserve-3d"
            preserveAspectRatio="none"
            viewBox="0 0 100 40"
          >
            <path
              d="M0 40 L100 40"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          </svg>
          <div className="z-10 text-xs text-gray-400 w-full flex justify-between absolute bottom-1">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mie</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sab</span>
            <span>Dom</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentsTable
            data={citasHoy.map((cita) => ({
              id: String(cita.id_cita),
              petName: cita.mascota_nombre ?? `Mascota #${cita.mascota}`,
              petType: 'Mascota',
              ownerName: cita.correo_usuario ?? 'Cliente',
              service: cita.servicio_nombre ?? `Servicio #${cita.servicio}`,
              time: cita.hora_inicio ?? 'Sin hora',
              status:
                cita.estado === 'CONFIRMADA'
                  ? 'Confirmada'
                  : cita.estado === 'PENDIENTE'
                    ? 'Pendiente'
                    : 'En espera',
            }))}
            isLoading={citasLoading}
            hasError={Boolean(citasError)}
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity
            items={recentActivity}
            isLoading={citasLoading}
            hasError={Boolean(citasError)}
          />
        </div>
      </div>
    </div>
  )
}
