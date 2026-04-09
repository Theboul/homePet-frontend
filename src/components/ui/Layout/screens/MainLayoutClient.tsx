'use client'

import * as React from 'react'
import { Outlet } from '@tanstack/react-router'
import { HeaderClient, Footer } from '../components'

interface MainLayoutProps {
  children?: React.ReactNode
}

export function MainLayoutClient({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-purple-600">
      {/* 1. Header persistente en la parte superior */}
      <HeaderClient />

      {/* 2. Área de contenido principal 
         flex-grow asegura que el Footer siempre se empuje al fondo si hay poco contenido
      */}
      <main className="flex-grow">
        {/* Si pasas children manualmente los usa, 
           de lo contrario renderiza la ruta actual con Outlet 
        */}
        {children || <Outlet />}
      </main>

      {/* 3. Footer al final de la página */}
      <Footer />
    </div>
  )
}
