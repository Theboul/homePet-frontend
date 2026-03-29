'use client'

import { useState, useEffect } from 'react'
import type { Cliente, ClienteFormData } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Mail, Phone, MapPin, Image } from 'lucide-react'

interface ClienteFormProps {
  cliente?: Cliente
  onSubmit: (data: ClienteFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClienteForm({
  cliente,
  onSubmit,
  onCancel,
  isLoading,
}: ClienteFormProps) {
  const [formData, setFormData] = useState<ClienteFormData>({
    correo: '',
    nombre: '',
    telefono: '',
    direccion: '',
    foto: '',
    estado: 'activo',
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof ClienteFormData, string>>
  >({})

  useEffect(() => {
    if (cliente) {
      setFormData({
        correo: cliente.correo,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        foto: cliente.foto,
        estado: cliente.estado,
      })
    } else {
      setFormData({
        correo: '',
        nombre: '',
        telefono: '',
        direccion: '',
        foto: '',
        estado: 'activo',
      })
    }
  }, [cliente])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ClienteFormData, string>> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingrese un correo válido'
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 8 dígitos'
    }

   if (!formData.direccion.trim()) {
  newErrors.direccion = 'La ubicación es requerida'
}

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof ClienteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-white">
          Nombre completo
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Carlos Roca"
            className="pl-9 bg-white text-black"
          />
        </div>
        {errors.nombre && (
          <p className="text-sm text-orange-200">{errors.nombre}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo" className="text-white">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
            placeholder="cliente@ejemplo.com"
            className="pl-9 bg-white text-black"
          />
        </div>
        {errors.correo && (
          <p className="text-sm text-orange-200">{errors.correo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono" className="text-white">
          Teléfono
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) =>
              handleChange(
                'telefono',
                e.target.value.replace(/\D/g, '').slice(0, 8)
              )
            }
            placeholder="70123456"
            className="pl-9 bg-white text-black"
          />
        </div>
        {errors.telefono && (
          <p className="text-sm text-orange-200">{errors.telefono}</p>
        )}
      </div>

 <div className="space-y-2">
  <Label htmlFor="direccion" className="text-white">
    Ubicación / Dirección
  </Label>
  <div className="relative">
    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    <Input
      id="direccion"
      value={formData.direccion}
      onChange={(e) => handleChange('direccion', e.target.value)}
      placeholder="Ej: Av. Cristo Redentor, 4to anillo"
      className="pl-9 bg-white text-black"
    />
  </div>
  {errors.direccion && (
    <p className="text-sm text-orange-200">{errors.direccion}</p>
  )}
</div>

      <div className="space-y-2">
        <Label htmlFor="foto" className="text-white">
          Nombre de foto (opcional)
        </Label>
        <div className="relative">
          <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="foto"
            value={formData.foto}
            onChange={(e) => handleChange('foto', e.target.value)}
            placeholder="foto.jpg"
            className="pl-9 bg-white text-black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado" className="text-white">
          Estado
        </Label>
        <Select
          value={formData.estado}
          onValueChange={(value) =>
            handleChange('estado', value as 'activo' | 'inactivo')
          }
        >
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Seleccione estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#F97316] text-white hover:opacity-90"
        >
          {isLoading
            ? 'Guardando...'
            : cliente
            ? 'Actualizar cliente'
            : 'Registrar cliente'}
        </Button>
      </div>
    </form>
  )
}