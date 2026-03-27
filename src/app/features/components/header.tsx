'use client'

import { Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Pet Home
          </h1>
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-foreground hover:text-purple-500 transition-colors">
            Inicio
          </a>
          <a href="/servicios" className="text-sm font-medium text-foreground hover:text-purple-500 transition-colors">
            Servicios
          </a>
          <a href="/citas" className="text-sm font-medium text-foreground hover:text-purple-500 transition-colors">
            Citas
          </a>
          <a href="/contacto" className="text-sm font-medium text-foreground hover:text-purple-500 transition-colors">
            Contacto
          </a>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden md:flex border-purple-500 text-purple-600 hover:bg-purple-100"
          >
            Iniciar sesión
          </Button>

          <Button
            className="hidden md:flex bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:opacity-90"
          >
            Registrarse
          </Button>

          {/* Mobile menu icon */}
          <button className="md:hidden text-foreground">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}