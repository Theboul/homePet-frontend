import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Home,
  ShieldCheck,
  Users,
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
    | '/Gestionar_Clientes'
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
        children: [{ label: 'Gestionar Clientes', to: '/Gestionar_Clientes' }],
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
    <aside className={`bg-[#6A24D4] h-screen flex flex-col text-white ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center gap-3 p-6">
        <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center">
          <PawPrint className="w-5 h-5 text-white" />
        </div>

        {!isCollapsed && <h1 className="text-xl font-bold">PetHome</h1>}

        <Button onClick={toggleSidebar} variant="ghost">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 px-4">
        {menuSections.map((section) => (
          <div key={section.section}>
            <p className="text-xs text-white/50">{section.section}</p>

            {section.items.map((item) => {
              const Icon = item.icon
              const hasChildren = Boolean(item.children?.length)

              const itemActive =
                item.to === pathname || childIsActive(item.children, pathname)

              const itemOpen =
                hasChildren &&
                (openMenus[item.label] ?? childIsActive(item.children, pathname))

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button onClick={() => toggleMenu(item.label)}>
                      <Icon /> {item.label}
                    </button>

                    {itemOpen &&
                      item.children?.map((child) => (
                        <Link key={child.label} to={child.to}>
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )
              }

              return (
                <Link key={item.label} to={item.to ?? '/dashboard'}>
                  <Icon /> {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}