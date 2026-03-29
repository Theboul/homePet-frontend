'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RegisterModal = ({ open, onOpenChange }: Props) => {

  const [form, setForm] = useState({
    correo: '',
    contrasena: '',
    confirmPassword: '',
    nombre: '',
    telefono: '',
    direccion: '',
    foto: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (form.contrasena !== form.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    const data = {
      usuario: {
        correo: form.correo,
        contrasena: form.contrasena,
        id_rol: 2
      },
      perfil: {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
        foto: form.foto
      }
    }

    console.log('Registro:', data)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      {/* CARD */}
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6 relative">

        {/* ❌ cerrar */}
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-6 text-center">
          Crear mi cuenta 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* INPUT STYLE BASE */}
          {/** puedes reutilizar esto mentalmente */}
          
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
            Registrarse
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RegisterModal