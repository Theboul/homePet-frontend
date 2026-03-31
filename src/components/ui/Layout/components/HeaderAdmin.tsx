import { Bell, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function HeaderAdmin() {
  return (
    <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-[#6A24D4]/50 focus-within:border-[#6A24D4] transition-all">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar pacientes, clientes..."
          className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          className="relative text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
            3
          </span>
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-[#6A24D4] text-white text-sm font-bold w-9 h-9 flex items-center justify-center rounded-full">
            AD
          </div>
          <span className="text-sm font-semibold text-gray-800 hidden sm:block">
            Admin
          </span>
        </Button>
      </div>
    </div>
  )
}
