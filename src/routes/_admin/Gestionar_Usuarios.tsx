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
})

function App() {
  return <Gestionar_Usuarios />
}
