import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout, DashboardScreen } from '#/app/features/dashboard'
import { store } from '#/store/store'

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
