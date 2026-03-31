import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard/screen/DashboardScreen'
import { MainLayoutAdmin } from '@/components/ui/Layout/screens/MainLayoutAdmin'
import { store } from '#/store/store'

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return <DashboardScreen />
}
