import { useEffect, useRef, useState } from 'react'
import type { PerfilUsuario } from '../schemas'

interface UserTableProps {
  usuarios: PerfilUsuario[]
  onEliminar: (id: number) => void
  onCambiarEstado: (id: number, estadoActual: boolean) => void
  onEditar: (usuario: PerfilUsuario) => void
}

export const UserTable = ({
  usuarios,
  onEliminar,
  onCambiarEstado,
  onEditar,
}: UserTableProps) => {
  const [menuAbiertoId, setMenuAbiertoId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Cierra el menú de acciones al hacer clic fuera
  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbiertoId(null)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const formatearFecha = (fechaStr: string) => {
    return new Date(fechaStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#F97316]/30 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
<<<<<<< HEAD
    <tr className="bg-[#7C3AED] text-left">
              <th className="px-4 py-4 text-sm font-semibold text-white">Usuario</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Teléfono</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Dirección</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Rol</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Estado</th>
              <th className="px-4 py-4 text-sm font-semibold text-white">Creado</th>
              <th className="px-4 py-4 text-sm font-semibold text-white text-right">
=======
            <tr className="bg-[#7C3AED] text-left">
              <th className="px-6 py-4 text-sm font-semibold text-white">
                Usuario
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-white">
                Teléfono
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-white">
                Dirección
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-white">
                Rol
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-white">
                Estado
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-white">
                Creado
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-white text-right">
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500 font-medium"
                >
                  No se encontraron usuarios en el sistema.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.id_perfil}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {usuario.nombre}
                      </span>
                      <span className="text-xs text-gray-500">
                        {usuario.correo}
                      </span>
                    </div>
                  </td>

<<<<<<< HEAD
                  <td className="px-4 py-4 text-black">{usuario.telefono}</td>
                  <td className="px-4 py-4 text-black">{usuario.direccion}</td>
=======
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {usuario.telefono}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate">
                    {usuario.direccion}
                  </td>
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-[#7C3AED] border border-purple-100 uppercase">
                      {usuario.rol}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
<<<<<<< HEAD
                      className={`inline-flex items-center gap-2 text-sm ${
                        usuario.estado === 'Activo'
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          usuario.estado === 'Activo'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}
=======
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${usuario.estado ? 'text-green-600' : 'text-red-500'}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${usuario.estado ? 'bg-green-500' : 'bg-red-500'}`}
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
                      />
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatearFecha(usuario.fecha_creacion)}
                  </td>

                  <td className="relative px-6 py-4 text-right">
                    <div
                      className="inline-block"
                      ref={menuAbiertoId === usuario.id_perfil ? menuRef : null}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setMenuAbiertoId((prev) =>
                            prev === usuario.id_perfil
                              ? null
                              : usuario.id_perfil,
                          )
                        }
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#F97316] transition-all"
                      >
                        <span className="text-xl font-bold">⋮</span>
                      </button>

                      {menuAbiertoId === usuario.id_perfil && (
                        <div className="absolute right-6 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              onEditar(usuario)
                              setMenuAbiertoId(null)
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED]"
                          >
                            <span>✎</span> Editar Datos
                          </button>

                          <div className="h-px bg-gray-100" />

                          {/* ELIMINAR CONEXIÓN CON ENDPOINT */}
                          <button
                            type="button"
                            onClick={() => {
                              // El ID correcto para el endpoint DELETE de Django es id_perfil
                              onEliminar(usuario.id_perfil)
                              setMenuAbiertoId(null)
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <span>🗑</span> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
