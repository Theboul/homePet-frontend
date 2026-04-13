import { useEffect, useState, type FormEvent } from 'react'
import { X, User, Mail, Phone, MapPin, Shield, Lock } from 'lucide-react'
import type { PerfilUsuario, CreateUsuarioInput } from '../schemas'
import type { UsuarioUpdateInput } from '../types'

interface UserFormModalProps {
  open: boolean
  modo: 'crear' | 'editar'
  usuarioInicial?: PerfilUsuario | null
  onClose: () => void
  // Usamos el tipo de creación para el save, ya que cubre los campos base
  onSave: (data: CreateUsuarioInput | UsuarioUpdateInput) => void
}

// Inicializador basado en CreateUsuarioInput
const initialForm: CreateUsuarioInput = {
  nombre: '',
  correo: '',
  password: '',
  telefono: '',
  direccion: '',
<<<<<<< HEAD
  rol: 'Veterinario',
  estado: 'Activo',
};
=======
  id_rol: 2, // Por defecto Veterinario
}
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b

export const UserFormModal = ({
  open,
  modo,
  usuarioInicial,
  onClose,
  onSave,
}: UserFormModalProps) => {
  const [form, setForm] = useState<CreateUsuarioInput>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return

    if (modo === 'editar' && usuarioInicial) {
      // Mapeamos de PerfilUsuario (lectura) a el estado del formulario
      setForm({
        nombre: usuarioInicial.nombre,
        correo: usuarioInicial.correo,
        telefono: usuarioInicial.telefono,
        direccion: usuarioInicial.direccion,
<<<<<<< HEAD
        rol: usuarioInicial.rol,
        estado: usuarioInicial.estado,
      });
=======
        // Nota: El backend envía 'rol' como string, pero para editar
        // necesitamos el id_rol. Mapeo temporal:
        id_rol: usuarioInicial.rol === 'Administrador' ? 1 : 2,
        password: '', // No se edita el password por defecto
      })
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
    } else {
      setForm(initialForm)
    }
    setErrors({})
  }, [open, modo, usuarioInicial])

  if (!open) return null

  const handleChange = (field: keyof CreateUsuarioInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

<<<<<<< HEAD
    if (
      !form.nombre.trim() ||
      !form.correo.trim() ||
      !form.telefono.trim()
    ) {
      return;
=======
    // Validación manual rápida basada en tus mensajes de Zod
    if (modo === 'crear' && (!form.password || form.password.length < 8)) {
      setErrors({ password: 'Mínimo 8 caracteres' })
      return
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
    }

    // Si es editar, eliminamos el password del objeto si está vacío
    if (modo === 'editar') {
      const { password, ...updateData } = form
      onSave(updateData)
    } else {
      onSave(form)
    }
  }

  const inputClass =
    'h-11 w-full rounded-xl border border-white/20 bg-white px-10 text-black outline-none focus:ring-2 focus:ring-[#F97316] transition-all'
  const labelClass =
    'mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/80 ml-1'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-[#7C3AED] bg-[#7C3AED] p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic">
              {modo === 'editar' ? 'Actualizar Usuario' : 'Registrar Personal'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="md:col-span-2 relative">
            <label className={labelClass}>Nombre Completo</label>
            <User className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div
            className={
              modo === 'crear'
                ? 'md:col-span-1 relative'
                : 'md:col-span-2 relative'
            }
          >
            <label className={labelClass}>Correo Electrónico</label>
            <Mail className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
            <input
              type="email"
              value={form.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {modo === 'crear' && (
            <div className="relative">
              <label className={labelClass}>Contraseña</label>
              <Lock className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={inputClass}
                required
              />
              {errors.password && (
                <span className="text-xs text-orange-400">
                  {errors.password}
                </span>
              )}
            </div>
          )}

          <div className="relative">
            <label className={labelClass}>Teléfono</label>
            <Phone className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className={inputClass}
            />
          </div>

<<<<<<< HEAD
          <div>
            <label className="mb-2 block text-sm text-white">Dirección</label>
=======
          <div className="relative">
            <label className={labelClass}>Rol</label>
            <Shield className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
            <select
              value={form.id_rol}
              onChange={(e) => handleChange('id_rol', Number(e.target.value))}
              className={`${inputClass} appearance-none`}
            >
              <option value={1}>Cliente</option>
              <option value={2}>Veterinario</option>
              <option value={3}>Administrador</option>
            </select>
          </div>

          <div className="md:col-span-2 relative">
            <label className={labelClass}>Dirección</label>
            <MapPin className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
<<<<<<< HEAD
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => handleChange('rol', e.target.value as UserRole)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            >
              <option value="Administrador">Administrador</option>
              <option value="Veterinario">Veterinario</option>
              <option value="Recepcionista">Recepcionista</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => handleChange('estado', e.target.value as UserStatus)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
=======
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-white/70 hover:text-white"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#F97316] px-10 py-3 font-black text-white hover:bg-[#ea580c] transition-all"
            >
              {modo === 'editar' ? 'GUARDAR' : 'REGISTRAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
