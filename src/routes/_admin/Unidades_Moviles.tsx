import { createFileRoute } from '@tanstack/react-router'
import { UnidadesMovilesPage } from '@/app/features/GestionServiciosyReserva'

export const Route = createFileRoute('/_admin/Unidades_Moviles')({
  component: UnidadesMovilesAdminPage,
})

function UnidadesMovilesAdminPage() {
  return <UnidadesMovilesPage />
}
