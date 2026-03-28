'use client'

import { Heart, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        
        {/* Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Pet Home</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Cuidamos a tus mascotas con amor, tecnología y profesionales capacitados.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="text-muted-foreground hover:text-primary transition">Inicio</a></li>
            <li><a href="/servicios" className="text-muted-foreground hover:text-primary transition">Servicios</a></li>
            <li><a href="/citas" className="text-muted-foreground hover:text-primary transition">Citas</a></li>
            <li><a href="/contacto" className="text-muted-foreground hover:text-primary transition">Contacto</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Contacto</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Santa Cruz, Bolivia
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +591 700 00000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> contacto@pethome.com
            </li>
          </ul>
        </div>

        {/* Redes */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">Síguenos</h3>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Instagram className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom */}
      <div className="text-center py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pet Home 🐾 — Todos los derechos reservados
      </div>
    </footer>
  )
}