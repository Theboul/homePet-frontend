import { createFileRoute } from '@tanstack/react-router'
import { GestionarClientes } from '../../app/features/Gestionar_Clientes_Mascotas'

<<<<<<< HEAD
export const Route = createFileRoute('/_admin/Gestionar_Clientes')({
=======
export const Route = createFileRoute('/_admin/gestionar_clientes')({
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
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
  component: GestionarClientesPage,
})

function GestionarClientesPage() {
  return <GestionarClientes />
}
