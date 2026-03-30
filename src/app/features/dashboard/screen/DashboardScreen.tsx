import { Users, PawPrint, Calendar as CalendarIcon, DollarSign } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { AppointmentsTable } from '../components/AppointmentsTable'
import { RecentActivity } from '../components/RecentActivity'

export function DashboardScreen() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome header section */}
      <div className="mb-2">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
          ¡Bienvenido de vuelta!
        </h2>
        <p className="text-gray-500 mt-1">
          Aquí tienes un resumen de tu clínica veterinaria hoy.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Clientes Totales"
          value="1,234"
          trend="+12% este mes"
          trendUp={true}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          iconBgSpan="bg-purple-100"
        />
        <StatCard
          title="Mascotas Registradas"
          value="2,456"
          trend="+8% este mes"
          trendUp={true}
          icon={<PawPrint className="w-5 h-5 text-orange-500" />}
          iconBgSpan="bg-orange-100"
        />
        <StatCard
          title="Citas Hoy"
          value="18"
          trend="5 pendientes"
          trendUp={false} // Para q salga gris o neutro si quieres, pero en la img es gris
          icon={<CalendarIcon className="w-5 h-5 text-purple-600" />}
          iconBgSpan="bg-purple-100"
        />
        <StatCard
          title="Ingresos del Mes"
          value="$45,231"
          trend="+23% vs mes anterior"
          trendUp={true}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          iconBgSpan="bg-green-100"
        />
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-80 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 font-sans mb-4">Consultas de la Semana</h3>
        <div className="flex-1 border-t border-dashed border-gray-200 mt-2 relative flex items-end justify-between px-4 pb-2">
          {/* Simple SVG mock for the chart */}
          <svg className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path 
              d="M0 35 Q 15 20, 30 25 T 50 15 T 70 20 T 90 5 L 100 5 L 100 40 L 0 40 Z" 
              fill="#F3E8FF" 
              opacity="0.6"
            />
            <path 
              d="M0 35 Q 15 20, 30 25 T 50 15 T 70 20 T 90 5 L 100 5" 
              fill="none" 
              stroke="#9333EA" 
              strokeWidth="1.5"
            />
          </svg>
          <div className="z-10 text-xs text-gray-400 w-full flex justify-between absolute bottom-1">
             <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>
        </div>
      </div>

      {/* Grid for Table and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentsTable />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
