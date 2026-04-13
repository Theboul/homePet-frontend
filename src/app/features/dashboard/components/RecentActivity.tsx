import { Calendar, UserPlus, ClipboardList, Package, DollarSign } from 'lucide-react'

// Datos Hardcodeados de prueba
const activities = [
  {
    id: 1,
    title: 'Nuevo cliente registrado',
    description: 'María López fue agregada al sistema',
    time: 'Hace 5 min',
    icon: UserPlus,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    title: 'Cita programada',
    description: 'Max - Vacunación para mañana',
    time: 'Hace 15 min',
    icon: Calendar,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 3,
    title: 'Historia clínica actualizada',
    description: 'Luna - Resultados de laboratorio',
    time: 'Hace 30 min',
    icon: ClipboardList,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 4,
    title: 'Stock bajo',
    description: 'Vacuna antirrábica - 5 unidades',
    time: 'Hace 1 hora',
    icon: Package,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    id: 5,
    title: 'Pago recibido',
    description: 'Factura #1234 - $150.00',
    time: 'Hace 2 horas',
    icon: DollarSign,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
]

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6 font-sans">Actividad Reciente</h3>

      <div className="relative">
        {/* Línea conectora */}
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gray-100 z-0"></div>

        <div className="space-y-6 relative z-10">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${activity.iconBg} ring-4 ring-white`}>
                  <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="pt-1">
                  <h4 className="text-sm font-bold text-gray-800">{activity.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}