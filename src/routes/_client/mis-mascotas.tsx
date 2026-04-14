import { MisMascotasScreen } from '#/app/features/cliente/screen/MisMascotasScreen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/mis-mascotas')({
  component: MisMascotasScreen,
})
