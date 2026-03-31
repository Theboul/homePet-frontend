import { createFileRoute, Outlet } from '@tanstack/react-router'
import { MainLayoutAdmin } from '@/components/ui/Layout'

export const Route = createFileRoute('/_admin')({
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  return (
    <MainLayoutAdmin>
      <Outlet />
    </MainLayoutAdmin>
  )
}
