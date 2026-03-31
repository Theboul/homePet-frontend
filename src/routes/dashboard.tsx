import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout, DashboardScreen } from '#/app/features/dashboard'
import { store } from '#/store/store'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <DashboardLayout>
      <DashboardScreen />
    </DashboardLayout>
  )
}
