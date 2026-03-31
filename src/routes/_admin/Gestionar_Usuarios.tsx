import { createFileRoute, redirect } from '@tanstack/react-router'
import { Gestionar_Usuarios } from '../app/features/AutenticacionySeguridad'
import { store } from '#/store/store'

export const Route = createFileRoute('/_admin/Gestionar_Usuarios')({
  component: App,
})

function App() {
  return <Gestionar_Usuarios />
}