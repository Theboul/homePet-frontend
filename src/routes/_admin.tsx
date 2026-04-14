import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/features/dashboard/components/DashboardLayout'
import { store } from '#/store/store'
import { authApi } from '#/store/auth/authApi'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    // In SSR we cannot read localStorage-backed auth state; enforce auth on client.
    if (typeof window === 'undefined') {
      return
    }

    const { isAuthenticated, accessToken, user } = store.getState().auth

    if (!isAuthenticated && !accessToken) {
      throw redirect({
        to: '/login',
        search: {
          register: false,
        },
      })
    }

    if (user?.role === 'CLIENT' && accessToken) {
      // Revalida el perfil para evitar bloqueos por datos persistidos desactualizados.
      const profileRequest = store.dispatch(
        authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })
      )

      try {
        const profile = await profileRequest.unwrap()

        if (profile.role === 'CLIENT') {
          throw redirect({
            to: '/',
          })
        }
      } catch {
        throw redirect({
          to: '/login',
          search: {
            register: false,
          },
        })
      } finally {
        profileRequest.unsubscribe()
      }
    }
  },
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
