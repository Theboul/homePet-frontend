import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Provider } from 'react-redux'
import { useAppDispatch, useAppSelector } from '#/store/hooks'
import { store } from '#/store/store'
import { useGetProfileQuery } from '#/store/auth/authApi'
import { logout, updateUser } from '#/store/auth/authSlice'
import Footer from '../components/Footer'
import Header from '../components/Header'


import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Pet Home' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  // Cambiamos shellComponent por component para el renderizado estándar
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
<<<<<<< HEAD
  <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
    <Provider store={store}>
      <AuthBootstrap />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </Provider>
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
=======
      <body className="font-sans antialiased">
      <React.Suspense>
        <Outlet />
      </React.Suspense>

>>>>>>> 7fc350d977279f5098a40e560ca8beb7a3be0b3c
      <Scripts />
    </body>
  </html>
  )
}

function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const { data, isError } = useGetProfileQuery(undefined, {
    skip: !accessToken,
  })

  useEffect(() => {
    if (data) {
      dispatch(updateUser(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    if (isError && accessToken) {
      dispatch(logout())
    }
  }, [isError, accessToken, dispatch])

  return null
}
