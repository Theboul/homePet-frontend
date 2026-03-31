import { createFileRoute, redirect } from '@tanstack/react-router'
import { Gestionar_Usuarios } from '../app/features/AutenticacionySeguridad'
import { store } from '#/store/store'

export const Route = createFileRoute('/Gestionar_Usuarios')({
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return <Gestionar_Usuarios />
}