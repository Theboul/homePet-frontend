'use client'

import type { Cliente, ClienteFormData } from '../types'
import { ClienteForm } from './ClienteForm'

interface ClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente
  onSubmit: (data: ClienteFormData) => void
  isLoading?: boolean
}

export function ClienteDialog({
  open,
  onOpenChange,
  cliente,
  onSubmit,
  isLoading,
}: ClienteDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#7C3AED] bg-[#7C3AED] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {cliente ? 'Editar cliente' : 'Registrar nuevo cliente'}
            </h2>
            <p className="mt-1 text-sm text-white/85">
              {cliente
                ? 'Modifica los datos del cliente de la veterinaria.'
                : 'Completa el formulario para registrar un nuevo cliente.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-white px-3 py-2 text-[#7C3AED] hover:opacity-90"
          >
            Cerrar
          </button>
        </div>

        <ClienteForm
          cliente={cliente}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
