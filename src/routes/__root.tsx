import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useAppDispatch, useAppSelector } from '#/store/hooks'
import { store } from '#/store/store'
import { useGetProfileQuery } from '#/store/auth/authApi'
import { updateUser } from '#/store/auth/authSlice'

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
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <Provider store={store}>
          <AuthBootstrap />
          <Suspense>
            <Outlet />
          </Suspense>
        </Provider>
        <Scripts />
      </body>
    </html>
  )
}

function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const { data } = useGetProfileQuery(undefined, {
    skip: !accessToken,
  })

  useEffect(() => {
    if (data) {
      dispatch(updateUser(data))
    }
  }, [data, dispatch])

  return null
}
