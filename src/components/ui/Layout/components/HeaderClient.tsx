'use client'

import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '#/store/hooks'
import { logout } from '#/store/auth/authSlice'

export const HeaderClient = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const navLinkStyles =
    'text-sm font-bold !text-[#111827] hover:!text-[#7C3AED] transition-colors'
  const mobileLinkStyles =
    'block text-base font-bold !text-[#111827] hover:!text-[#7C3AED] py-2'
  const loginLinkStyles =
    'inline-flex h-10 items-center justify-center rounded-lg border border-[#7C3AED] bg-white px-4 text-sm font-bold !text-[#7C3AED] transition-colors hover:bg-[#7C3AED] hover:!text-white'
  const registerLinkStyles =
    'inline-flex h-10 items-center justify-center rounded-lg bg-[#F97316] px-4 text-sm font-bold !text-white transition-colors hover:bg-[#EA580C]'

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
    navigate({
      to: '/login',
      search: { register: false },
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316] shadow-md">
            <Heart className="h-5 w-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-extrabold text-[#7C3AED]">Pet Home</h1>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className={navLinkStyles}>
            Inicio
          </Link>
          <a href="/servicios" className={navLinkStyles}>
            Servicios
          </a>
          <a href="/citas" className={navLinkStyles}>
            Citas
          </a>
          <a href="/contacto" className={navLinkStyles}>
            Contacto
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="border-none bg-red-100 font-bold text-red-600 hover:bg-red-200"
            >
              Cerrar sesion
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                search={{ register: false }}
                className={loginLinkStyles}
              >
                Iniciar sesion
              </Link>
              <Link
                to="/login"
                search={{ register: true }}
                className={registerLinkStyles}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-slate-900 md:hidden"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {open && (
        <div className="space-y-2 border-t border-slate-100 bg-white px-4 pb-6 shadow-xl md:hidden">
          <div className="space-y-1 py-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Inicio
            </Link>
            <a
              href="/servicios"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Servicios
            </a>
            <a
              href="/citas"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Citas
            </a>
            <a
              href="/contacto"
              onClick={() => setOpen(false)}
              className={mobileLinkStyles}
            >
              Contacto
            </a>
          </div>

          <div className="flex flex-col gap-3 pb-2">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                className="w-full border-none bg-red-100 font-bold text-red-600 hover:bg-red-200"
              >
                Cerrar sesion
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  search={{ register: false }}
                  onClick={() => setOpen(false)}
                  className={`${loginLinkStyles} w-full`}
                >
                  Iniciar sesion
                </Link>
                <Link
                  to="/login"
                  search={{ register: true }}
                  onClick={() => setOpen(false)}
                  className={`${registerLinkStyles} w-full`}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
