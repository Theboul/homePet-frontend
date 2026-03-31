import { useState } from 'react'
import { UserFilters, UserFormModal, UserStats, UserTable } from '../components'
import { useGestionarUsuarios } from '../store'
import type { Usuario, UsuarioFormData } from '../store'

export const Gestionar_Usuarios = () => {
  const [openModal, setOpenModal] = useState(false)
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear')
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null)

  const {
    usuariosFiltrados,
    search,
    setSearch,
    rolFilter,
    setRolFilter,
    estadoFilter,
    setEstadoFilter,
    totalUsuarios,
    usuariosActivos,
    administradores,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
  } = useGestionarUsuarios()

  const abrirModalCrear = () => {
    setModoModal('crear')
    setUsuarioSeleccionado(null)
    setOpenModal(true)
  }

  const abrirModalEditar = (usuario: Usuario) => {
    setModoModal('editar')
    setUsuarioSeleccionado(usuario)
    setOpenModal(true)
  }

  const handleGuardar = (data: UsuarioFormData) => {
    if (modoModal === 'editar' && usuarioSeleccionado) {
      editarUsuario(usuarioSeleccionado.id, data)
    } else {
      crearUsuario(data)
    }

    setOpenModal(false)
    setUsuarioSeleccionado(null)
    setModoModal('crear')
  }

  return (
    <section className="min-h-screen bg-white px-6 py-8 text-[#7C3AED]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[#F97316]">
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-black">
            Administra los usuarios internos del sistema de la veterinaria
          </p>
        </div>

        <UserStats
          totalUsuarios={totalUsuarios}
          usuariosActivos={usuariosActivos}
          administradores={administradores}
        />

        <UserFilters
          search={search}
          setSearch={setSearch}
          rolFilter={rolFilter}
          setRolFilter={setRolFilter}
          estadoFilter={estadoFilter}
          setEstadoFilter={setEstadoFilter}
          onNuevoUsuario={abrirModalCrear}
        />

        <p className="text-sm text-zinc-400">
          Mostrando {usuariosFiltrados.length} de {totalUsuarios} usuarios
        </p>

        <UserTable
          usuarios={usuariosFiltrados}
          onEliminar={eliminarUsuario}
          onCambiarEstado={cambiarEstadoUsuario}
          onEditar={abrirModalEditar}
        />

        <UserFormModal
          open={openModal}
          modo={modoModal}
          usuarioInicial={usuarioSeleccionado}
          onClose={() => {
            setOpenModal(false)
            setUsuarioSeleccionado(null)
            setModoModal('crear')
          }}
          onSave={handleGuardar}
        />
      </div>
    </section>
  )
}
