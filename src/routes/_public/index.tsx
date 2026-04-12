import { Label } from '#/components/ui/label'
import { createFileRoute } from '@tanstack/react-router'
import { CardSim } from 'lucide-react'

export const Route = createFileRoute('/_public/')({ component: App })

function App() {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4">
      <h1>Home Pet Home </h1>

      <a href="/login">Ir al login</a>
      <a href="/Gestionar_Usuarios">Ir al Gestionar_Usuarios</a>
      <a href="/Gestionar_Clientes">Ir al Gestionar_Clientes</a>
      <a href="/Gestionar_Mascotas">Ir al Gestionar_Mascotas</a>
      <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
        Bienvenido a Home Pet Home, tu refugio digital para el cuidado de tus
        mascotas. Aquí encontrarás todo lo que necesitas para mantener a tus
        amigos peludos felices y saludables. Desde consejos de alimentación y
        cuidado hasta productos recomendados, estamos aquí para ayudarte a
        brindarles el mejor cuidado posible. ¡Explora nuestro sitio y descubre
        cómo hacer que la vida de tu mascota sea aún más maravillosa!
      </p>    
      <CardSim className="w-6 h-6" />
      <Label></Label>
      MAS INFORMACION SOBRE EL PROYECTO
          
     <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
        Home Pet Home es un proyecto dedicado a proporcionar recursos y
        servicios para el cuidado de mascotas. Nuestro objetivo es crear una
        comunidad donde los amantes de los animales puedan compartir consejos,
        experiencias y productos relacionados con el bienestar de sus mascotas.
        Ofrecemos información sobre alimentación, salud, entrenamiento y
        actividades para mantener a tus mascotas felices y saludables. ¡Únete a
        nosotros en esta aventura de cuidar a nuestros amigos peludos!
      </p>    
    </main>
  )
}

