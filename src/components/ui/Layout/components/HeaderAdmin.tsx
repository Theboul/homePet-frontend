import { Bell, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function HeaderAdmin() {
  return (
<<<<<<< HEAD
    <header className="w-full border-b border-[#E5E7EB] bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-extrabold text-[#7C3AED]">Pet Home</h1>
        </Link>

        {/* Desktop Navegación */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkStyles}>
            Inicio
          </Link>
          <a href="/servicios" className={navLinkStyles}>
            Servicios
          </a>
          <a href="/citas" className={navLinkStyles}>
            Citas
          </a>
          <a href="/contacto" className={navLinkStyles}>
            Contacto
          </a>
        </nav>

        {/* Desktop acciones */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" search={{ register: false }}>
            <Button
              variant="outline"
              className="border-[#7C3AED] text-[#7C3AED] font-bold hover:bg-[#7C3AED] hover:text-white"
            >
              Iniciar sesión
            </Button>
          </Link>

          <Link to="/login" search={{ register: true }}>
            <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold border-none">
              Registrarse
            </Button>
          </Link>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-900 p-2"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-6 space-y-2 bg-white border-t border-slate-100 shadow-xl">
          <div className="py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Inicio
            </Link>
            <a
              href="/servicios"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Servicios
            </a>
            <a
              href="/citas"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Citas
            </a>
            <a
              href="/contacto"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Contacto
            </a>
          </div>
=======
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
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b

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
