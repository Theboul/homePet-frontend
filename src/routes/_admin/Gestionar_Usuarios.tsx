<<<<<<< HEAD
import { createFileRoute } from '@tanstack/react-router'
import { Gestionar_Usuarios } from '@/app/features/AutenticacionySeguridad'

export const Route = createFileRoute('/_admin/Gestionar_Usuarios')({
  component: GestionarUsuariosPage,
=======
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Gestionar_Usuarios } from '@/app/features/AutenticacionySeguridad'
import { store } from '#/store/store'

export const Route = createFileRoute('/_admin/gestionar_usuarios')({
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
  component: App,
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
})

function GestionarUsuariosPage() {
  return <Gestionar_Usuarios />
}
