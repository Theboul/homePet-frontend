'use client'

import { useState } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [open, setOpen] = useState(false)

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

        {/* Desktop */}
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

        {/* Desktop acciones */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
          >
            Iniciar sesión
          </Button>

          <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            Registrarse
          </Button>
        </div>

        {/* Mobile button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-[#7C3AED]">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white border-t">
          <a href="/" className="block text-[#7C3AED]">Inicio</a>
          <a href="/servicios" className="block text-[#7C3AED]">Servicios</a>
          <a href="/citas" className="block text-[#7C3AED]">Citas</a>
          <a href="/contacto" className="block text-[#7C3AED]">Contacto</a>

          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" className="border-[#7C3AED] text-[#7C3AED]">
              Iniciar sesión
            </Button>
            <Button className="bg-[#F97316] text-white">
              Registrarse
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}