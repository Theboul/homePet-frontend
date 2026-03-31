import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout, DashboardScreen } from '#/app/features/dashboard'

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <DashboardLayout>
      <DashboardScreen />
    </DashboardLayout>
  )
}
