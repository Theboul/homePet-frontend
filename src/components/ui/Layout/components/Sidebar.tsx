import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Home,
<<<<<<< HEAD:src/app/features/dashboard/components/Sidebar.tsx
  ShieldCheck, 
  Users,       
=======
  ShieldCheck, // Icono para Autenticación
  Users, // Icono para Gestión de Clientes
  Stethoscope,
  Package,
  DollarSign,
  BarChart2,
  Settings,
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b:src/components/ui/Layout/components/Sidebar.tsx
  PawPrint,
  CalendarPlus,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useAppSelector } from '#/store/hooks'

type MenuChild = {
  label: string
  to:
    | '/dashboard'
<<<<<<< HEAD:src/app/features/dashboard/components/Sidebar.tsx
    | '/Gestionar_Clientes'
    | '/Gestionar_Usuarios'
    | '/bitacora'
    | '/cliente'
    | '/mis-mascotas'
    | '/mis-reservas'
=======
    | '/gestionar_clientes'
    | '/gestionar_usuarios'
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b:src/components/ui/Layout/components/Sidebar.tsx
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
    items: [
<<<<<<< HEAD:src/app/features/dashboard/components/Sidebar.tsx
      { label: 'Inicio', icon: Home, to: '/dashboard' }
=======
      {
        label: 'Autenticación y Seguridad',
        icon: ShieldCheck,
        children: [{ label: 'Gestionar Usuarios', to: '/gestionar_usuarios' }],
      },
      {
        label: 'Gestión de Clientes y Mascotas',
        icon: Users,
        children: [{ label: 'Gestionar Clientes', to: '/gestionar_clientes' }],
      },
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b:src/components/ui/Layout/components/Sidebar.tsx
    ],
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
  const menuSections = user?.role === 'CLIENT' ? clientMenuSections : adminMenuSections
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside
      className={`bg-[#6A24D4] h-screen flex flex-col text-white flex-shrink-0 sticky top-0 transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo & Header */}
      <div
        className={`flex items-center select-none ${isCollapsed ? 'flex-col gap-4 py-6 px-4' : 'gap-3 p-6'}`}
      >
        <div className="bg-orange-500 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center shadow-lg">
          <PawPrint className="w-5 h-5 text-white" fill="currentColor" />
        </div>
<<<<<<< HEAD:src/app/features/dashboard/components/Sidebar.tsx
        {!isCollapsed && <h1 className="text-xl font-bold tracking-wide flex-1 whitespace-nowrap">PetHome</h1>}
        <Button onClick={toggleSidebar} variant="ghost" className={`text-purple-300 hover:bg-white/10 hover:text-orange-400 transition-colors p-2 rounded-full h-auto flex-shrink-0 ${isCollapsed ? 'rotate-180' : ''}`}>
=======
        {!isCollapsed && (
          <h1 className="text-xl font-bold tracking-wide flex-1 whitespace-nowrap">
            VetCare
          </h1>
        )}
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className={`text-purple-300 hover:bg-white/10 hover:text-orange-400 transition-colors p-2 rounded-full h-auto flex-shrink-0 ${isCollapsed ? 'rotate-180' : ''}`}
        >
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b:src/components/ui/Layout/components/Sidebar.tsx
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 mt-2">
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
<<<<<<< HEAD:src/app/features/dashboard/components/Sidebar.tsx
                
                // Calculamos en tiempo real si el hijo está activo
                const isChildActive = childIsActive(item.children, pathname)
                const itemActive = item.to === pathname || isChildActive
                
                // SOLUCIÓN: El menú está abierto SI el usuario lo clickeó (true/false) 
                // O si no lo ha tocado (undefined) pero tiene un hijo activo.
                const itemOpen = hasChildren && (openMenus[item.label] ?? isChildActive)
                
=======
                const itemActive =
                  item.to === pathname || childIsActive(item.children, pathname)
                const itemOpen =
                  hasChildren &&
                  (openMenus[item.label] ??
                    childIsActive(item.children, pathname))
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b:src/components/ui/Layout/components/Sidebar.tsx
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
                        className={`flex w-full items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-xl py-2.5 text-left text-sm transition-all ${
                          isActiveOrOpen
                            ? 'bg-orange-500/20 text-orange-200 ring-1 ring-orange-300/40'
                            : 'text-white/75 hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${isActiveOrOpen ? 'text-orange-300' : 'text-white/70'}`}
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
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
                    className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-xl py-2.5 text-sm transition-all ${
                      itemActive
                        ? 'bg-orange-500/20 text-orange-200 ring-1 ring-orange-300/40'
                        : 'text-white/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${itemActive ? 'text-orange-300' : 'text-white/70'}`}
                    />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
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

      {/* Profile Section */}
      <div
        className={`p-4 border-t border-white/10 m-4 mt-auto flex items-center ${isCollapsed ? 'justify-center mx-1 px-0' : 'gap-3'} overflow-hidden`}
      >
        <div className="bg-orange-500 text-white text-sm font-bold w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center">
          {user?.correo?.slice(0, 2).toUpperCase() || 'AD'}
        </div>
        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap">
            <span className="text-sm font-medium">{user?.role === 'CLIENT' ? 'Cliente' : 'Admin'}</span>
            <span className="text-xs text-white/60">{user?.correo || 'admin@vetcare.com'}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
