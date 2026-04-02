import { createFileRoute, redirect } from '@tanstack/react-router'
import { GestionarClientes } from '../../app/features/Gestionar_Clientes_Mascotas'
import { store } from '#/store/store'

export const Route = createFileRoute('/_admin/Gestionar_Clientes')({
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          register: false,
        },
      })
    }
  },
  component: GestionarClientesPage,
})

function GestionarClientesPage() {
  return <GestionarClientes />
}
