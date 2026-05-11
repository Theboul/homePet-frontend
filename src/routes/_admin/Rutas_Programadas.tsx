import { createFileRoute } from '@tanstack/react-router'
import { RutasProgramadasPage } from '@/app/features/GestionServiciosyReserva'

export const Route = createFileRoute('/_admin/Rutas_Programadas')({
  component: RutasProgramadasAdminPage,
})

function RutasProgramadasAdminPage() {
  return <RutasProgramadasPage />
}
