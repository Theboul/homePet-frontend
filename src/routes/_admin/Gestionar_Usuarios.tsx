import { createFileRoute, redirect } from '@tanstack/react-router'
import { Gestionar_Usuarios } from '../app/features/AutenticacionySeguridad'
import { store } from '#/store/store'

<<<<<<< HEAD
export const Route = createFileRoute('/Gestionar_Usuarios')({
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
=======
export const Route = createFileRoute('/_admin/Gestionar_Usuarios')({
>>>>>>> 7fc350d977279f5098a40e560ca8beb7a3be0b3c
  component: App,
})

function App() {
  return <Gestionar_Usuarios />
}