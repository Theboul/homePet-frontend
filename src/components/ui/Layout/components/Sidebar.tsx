import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  PawPrint,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAppSelector } from '#/store/hooks'

type MenuChild = {
  label: string
  to:
    | '/dashboard'
    | '/Gestionar_Clientes'
    | '/Gestionar_Mascotas'
    | '/Gestionar_Usuarios'
    | '/bitacora'
    | '/cliente'
    | '/mis-mascotas'
    | '/mis-reservas'
    | '/about'
    | '/login'
}

type MenuItem = {
  label: string
  icon: LucideIcon
  to?: MenuChild['to']
  children?: MenuChild[]
}

const adminMenuSections: Array<{ section: string; items: MenuItem[] }> = [
  {
    section: 'Principal',
    items: [{ label: 'Inicio', icon: Home, to: '/dashboard' }],
  },
  {
    section: 'Módulos del Sistema',
    items: [
      {
        label: 'Autenticación y Seg.',
        icon: ShieldCheck,
        children: [
          { label: 'Gestionar Usuarios', to: '/Gestionar_Usuarios' },
          { label: 'Bitácora y Seguridad', to: '/bitacora' },
        ],
      },
      {
        label: 'Clientes y Mascotas',
        icon: Users,
        children: [
          { label: 'Gestionar Clientes', to: '/Gestionar_Clientes' },
          { label: 'Gestionar Mascotas', to: '/Gestionar_Mascotas' },
        ],
      },
    ],
  },
]

const clientMenuSections: Array<{ section: string; items: MenuItem[] }> = [
  {
    section: 'Principal',
    items: [{ label: 'Inicio', icon: Home, to: '/cliente' }],
  },
  {
    section: 'Mi cuenta',
    items: [
      {
        label: 'Mascotas',
        icon: PawPrint,
        children: [{ label: 'Agregar mascota', to: '/mis-mascotas' }],
      },
      {
        label: 'Reservas',
        icon: CalendarPlus,
        children: [
          { label: 'Agregar reserva', to: '/mis-reservas' },
          { label: 'Modificar reserva', to: '/mis-reservas' },
        ],
      },
    ],
  },
]

function childIsActive(children: MenuChild[] | undefined, pathname: string) {
  if (!children) return false
  return children.some((child) => child.to === pathname)
}

export function Sidebar({
  isCollapsed = false,
  toggleSidebar,
}: {
  isCollapsed?: boolean
  toggleSidebar?: () => void
}) {
  const pathname = useLocation({ select: (state) => state.pathname })
  const user = useAppSelector((state) => state.auth.user)
  const menuSections =
    user?.role === 'CLIENT' ? clientMenuSections : adminMenuSections
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside
      className={`sticky top-0 z-20 flex h-screen flex-shrink-0 flex-col bg-[#6A24D4] text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div
        className={`flex items-center select-none ${
          isCollapsed ? 'flex-col gap-4 px-4 py-6' : 'gap-3 p-6'
        }`}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 shadow-lg">
          <PawPrint className="h-5 w-5 text-white" fill="currentColor" />
        </div>

        {!isCollapsed && (
          <h1 className="flex-1 whitespace-nowrap text-xl font-bold tracking-wide">
            PetHome
          </h1>
        )}

        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className={`h-auto flex-shrink-0 rounded-full p-2 text-purple-300 transition-colors hover:bg-white/10 hover:text-orange-400 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto px-4 py-2">
        {menuSections.map((section) => (
          <div key={section.section} className="mb-6">
            {!isCollapsed ? (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                {section.section}
              </p>
            ) : (
              <div className="h-4" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const hasChildren = Boolean(item.children?.length)
                const isChildActive = childIsActive(item.children, pathname)
                const itemActive = item.to === pathname || isChildActive
                const itemOpen =
                  hasChildren && (openMenus[item.label] ?? isChildActive)
                const isActiveOrOpen = itemActive || itemOpen

                if (hasChildren) {
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => {
                          if (isCollapsed && toggleSidebar) {
                            toggleSidebar()
                            setOpenMenus((prev) => ({
                              ...prev,
                              [item.label]: true,
                            }))
                          } else {
                            toggleMenu(item.label)
                          }
                        }}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex w-full items-center rounded-xl py-2.5 text-left text-sm transition-all ${
                          isCollapsed
                            ? 'justify-center px-0'
                            : 'gap-3 px-3'
                        } ${
                          isActiveOrOpen
                            ? 'bg-orange-500/20 text-orange-200 ring-1 ring-orange-300/40'
                            : 'text-white/75 hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isActiveOrOpen
                              ? 'text-orange-300'
                              : 'text-white/70'
                          }`}
                        />

                        {!isCollapsed && (
                          <>
                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                              {item.label}
                            </span>
                            {itemOpen ? (
                              <ChevronDown className="h-4 w-4 text-white/70" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-white/70" />
                            )}
                          </>
                        )}
                      </button>

                      {itemOpen && !isCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-white/15 pl-3">
                          {item.children?.map((child) => {
                            const childActive = pathname === child.to

                            return (
                              <Link
                                key={child.label}
                                to={child.to}
                                className={`block rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                                  childActive
                                    ? 'bg-orange-500/25 text-orange-100 ring-1 ring-orange-300/45'
                                    : 'text-white/65 hover:bg-white/8 hover:text-white'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    to={item.to ?? '/dashboard'}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-xl py-2.5 text-sm transition-all ${
                      isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                    } ${
                      itemActive
                        ? 'bg-orange-500/20 text-orange-200 ring-1 ring-orange-300/40'
                        : 'text-white/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        itemActive ? 'text-orange-300' : 'text-white/70'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        className={`m-4 mt-auto flex items-center overflow-hidden border-t border-white/10 p-4 ${
          isCollapsed ? 'justify-center mx-1 px-0' : 'gap-3'
        }`}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
          {user?.correo?.slice(0, 2).toUpperCase() || 'AD'}
        </div>

        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-sm font-medium">
              {user?.role === 'CLIENT' ? 'Cliente' : 'Admin'}
            </span>
            <span className="text-xs text-white/60">
              {user?.correo || 'admin@vetcare.com'}
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}
