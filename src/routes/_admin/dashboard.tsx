<<<<<<< HEAD
import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard/screen/DashboardScreen'
=======
import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardScreen } from '@/app/features/dashboard/screen/DashboardScreen'
import { MainLayoutAdmin } from '@/components/ui/Layout/screens/MainLayoutAdmin'
import { store } from '#/store/store'
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return <DashboardScreen />
}
