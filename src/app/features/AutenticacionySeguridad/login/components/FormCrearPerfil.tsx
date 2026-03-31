'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRegisterMutation } from '#/store/auth/authApi'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RegisterModal = ({ open, onOpenChange }: Props) => {

  const [form, setForm] = useState({
    correo: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    telefono: '',
    direccion: '',
  })
  const [registerUser, { isLoading }] = useRegisterMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (form.password !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden')
      return
    }

    try {
      await registerUser({
        correo: form.correo,
        password: form.password,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
      }).unwrap()
      onOpenChange(false)
      setForm({
        correo: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        telefono: '',
        direccion: '',
      })
    } catch {
      setFormError('No se pudo registrar el usuario. Verifica los datos.')
    }
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
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
            value={form.confirmPassword}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            onChange={handleChange}
            value={form.nombre}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            onChange={handleChange}
            value={form.telefono}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
            value={form.direccion}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <Button disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RegisterModal