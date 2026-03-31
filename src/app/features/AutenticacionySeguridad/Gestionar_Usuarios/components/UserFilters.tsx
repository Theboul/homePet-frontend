import type { UserRole, UserStatus } from '../store'

interface UserFiltersProps {
  search: string
  setSearch: (value: string) => void
  rolFilter: UserRole | 'Todos'
  setRolFilter: (value: UserRole | 'Todos') => void
  estadoFilter: UserStatus | 'Todos'
  setEstadoFilter: (value: UserStatus | 'Todos') => void
  onNuevoUsuario: () => void
}

export const UserFilters = ({
  search,
  setSearch,
  rolFilter,
  setRolFilter,
  estadoFilter,
  setEstadoFilter,
  onNuevoUsuario,
}: UserFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-[#7C3AED] bg-white px-4 text-[#7C3AED] outline-none placeholder:text-[#7C3AED]/60"
        />

        <select
          value={estadoFilter}
          onChange={(e) =>
            setEstadoFilter(e.target.value as UserStatus | 'Todos')
          }
          className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 text-[#7C3AED] outline-none"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <select
          value={rolFilter}
          onChange={(e) => setRolFilter(e.target.value as UserRole | 'Todos')}
          className="h-11 rounded-xl border border-[#7C3AED] bg-white px-4 text-[#7C3AED] outline-none"
        >
          <option value="Todos">Todos los roles</option>
          <option value="ADMIN">Administrador</option>
          <option value="VETERINARIAN">Veterinario</option>
          <option value="CLIENT">Cliente</option>
        </select>
      </div>

      <button
        onClick={onNuevoUsuario}
        className="h-11 rounded-xl bg-[#F97316] px-5 font-medium text-white transition hover:bg-[#EA580C]"
      >
        Nuevo usuario
      </button>
    </div>
  )
}
