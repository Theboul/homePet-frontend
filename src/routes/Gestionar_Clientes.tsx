import { createFileRoute } from '@tanstack/react-router'
import { GestionarClientes } from '../app/features/Gestionar_Clientes_Mascotas'

export const Route = createFileRoute('/Gestionar_Clientes')({
  component: GestionarClientesPage,
})

function GestionarClientesPage() {
  return <GestionarClientes />
}