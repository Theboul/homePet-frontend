import { ClienteHome } from '#/app/features/cliente/screen/ClienteHome'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/cliente')({
  component: ClienteHome,
})
