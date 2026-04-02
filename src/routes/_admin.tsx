import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { MainLayoutAdmin } from '@/components/ui/Layout'
import { store } from '#/store/store'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    const { isAuthenticated, user } = store.getState().auth

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          register: false,
        },
      })
    }

    if (user?.role === 'CLIENT') {
      // Si el usuario es un cliente, no tiene acceso a las rutas administrativas.
      // Lo mandamos a otra ruta (por ejemplo, la ruta pública o una página de acceso denegado).
      // Asumiremos que '/' o '/dashboard' para clientes existe. Por ahora, a '/'
      throw redirect({
        to: '/',
      })
    }
  },
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  return (
    <MainLayoutAdmin>
      <Outlet />
    </MainLayoutAdmin>
  )
}
