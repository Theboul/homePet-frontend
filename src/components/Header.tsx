'use client'

import { Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="w-full border-b border-[#E5E7EB] bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-[#7C3AED]">
            Pet Home
          </h1>
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-[#7C3AED] hover:text-[#F97316] transition-colors">
            Inicio
          </a>
          <a href="/servicios" className="text-sm font-medium text-[#7C3AED] hover:text-[#F97316] transition-colors">
            Servicios
          </a>
          <a href="/citas" className="text-sm font-medium text-[#7C3AED] hover:text-[#F97316] transition-colors">
            Citas
          </a>
          <a href="/contacto" className="text-sm font-medium text-[#7C3AED] hover:text-[#F97316] transition-colors">
            Contacto
          </a>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden md:flex border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
          >
            Iniciar sesión
          </Button>

          <Button
            className="hidden md:flex bg-[#F97316] hover:bg-[#EA580C] text-white"
          >
            Registrarse
          </Button>

          {/* Mobile menu icon */}
          <button className="md:hidden text-[#7C3AED]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}