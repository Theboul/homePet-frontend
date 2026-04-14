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
  rol: 'Veterinario',
  estado: 'Activo',
};

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
        rol: usuarioInicial.rol,
        estado: usuarioInicial.estado,
      });
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

    if (
      !form.nombre.trim() ||
      !form.correo.trim() ||
      !form.telefono.trim()
    ) {
      return;
    }

    onSave(form);
    setForm(initialForm);
    onClose();
  };

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

          <div>
            <label className="mb-2 block text-sm text-white">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className="h-11 w-full rounded-xl border border-white bg-white px-4 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Rol</label>
            <select
              value={form.id_rol}
              onChange={(e) => handleChange('id_rol', Number(e.target.value))}
              className={`${inputClass} appearance-none`}
            >
              <option value="Administrador">Administrador</option>
              <option value="Veterinario">Veterinario</option>
              <option value="Recepcionista">Recepcionista</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>

          <div className="md:col-span-2 relative">
            <label className={labelClass}>Dirección</label>
            <MapPin className="absolute left-3 top-[38px] h-5 w-5 text-[#7C3AED]" />
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
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
