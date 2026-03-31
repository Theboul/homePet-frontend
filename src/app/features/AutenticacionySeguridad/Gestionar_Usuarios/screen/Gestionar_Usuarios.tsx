import { useState } from 'react'
import { UserFilters, UserFormModal, UserStats, UserTable } from '../components'
import {
  useGetUsuariosQuery,
  useDeleteUsuarioMutation,
  useCreateUsuarioMutation,
  useUpdateUsuarioMutation,
} from '../store'
import type { PerfilUsuario, CreateUsuarioInput } from '../schemas'
import type { UsuarioUpdateInput } from '../types'

export const Gestionar_Usuarios = () => {
  const [openModal, setOpenModal] = useState(false)
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear')
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<PerfilUsuario | null>(null)

  const [search, setSearch] = useState('')
  const [rolFilter, setRolFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos')

  const { data: usuarios = [], isLoading } = useGetUsuariosQuery({
    search: search || undefined,
    usuario__role__nombre:
      rolFilter !== 'Todos' && rolFilter !== '' ? rolFilter : undefined,
    usuario__is_active:
      estadoFilter === 'Activo'
        ? true
        : estadoFilter === 'Inactivo'
          ? false
          : undefined,
  })

  const [createUsuario] = useCreateUsuarioMutation()
  const [updateUsuario] = useUpdateUsuarioMutation()
  const [deleteUsuario] = useDeleteUsuarioMutation()

  const totalUsuarios = usuarios.length
  const usuariosActivos = usuarios.filter((u) => u.estado).length
  const administradores = usuarios.filter(
    (u) => u.rol === 'Administrador',
  ).length

  const abrirModalCrear = () => {
    setModoModal('crear')
    setUsuarioSeleccionado(null)
    setOpenModal(true)
  }

  const abrirModalEditar = (usuario: PerfilUsuario) => {
    setModoModal('editar')
    setUsuarioSeleccionado(usuario)
    setOpenModal(true)
  }

  const handleGuardar = async (
    data: CreateUsuarioInput | UsuarioUpdateInput,
  ) => {
    try {
      if (modoModal === 'editar' && usuarioSeleccionado) {
        // Al editar, si el password viene vacío, lo eliminamos para no enviarlo a Django
        const payload = { ...data }
        if (!payload.password) delete payload.password

        await updateUsuario({
          id: usuarioSeleccionado.id_perfil,
          data: payload,
        }).unwrap()

        alert('Usuario actualizado correctamente 🐾')
      } else {
        await createUsuario(data as CreateUsuarioInput).unwrap()
        alert('Usuario creado correctamente ✨')
      }
      cerrarModal()
    } catch (error: any) {
      console.error('Error al guardar:', error)
      const errorMsg = error.data?.detail || 'Error al procesar la solicitud'
      alert(errorMsg)
    }
  }

  const handleCambiarEstado = async (id: number, estadoActual: boolean) => {
    try {
      // Usamos el id_perfil y enviamos el nuevo estado booleano
      await updateUsuario({
        id,
        data: { estado: !estadoActual },
      }).unwrap()
    } catch (error) {
      alert('No se pudo cambiar el estado del usuario')
    }
  }

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUsuario(id).unwrap()
      } catch (error) {
        alert('Error al intentar eliminar el usuario')
      }
    }
  }

  const cerrarModal = () => {
    setOpenModal(false)
    setUsuarioSeleccionado(null)
    setModoModal('crear')
  }

  return (
    <section className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#F97316] tracking-tighter">
              GESTIÓN DE USUARIOS
            </h1>
            <p className="mt-1 text-gray-500 font-medium">
              Panel de control para administradores y veterinarios
            </p>
          </div>
        </header>

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

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
              <span className="text-[#7C3AED] font-bold animate-pulse">
                Sincronizando con Pet Home...
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-400">
                LISTADO DE PERSONAL ({usuarios.length})
              </p>
            </div>

            <UserTable
              usuarios={usuarios}
              onEliminar={handleEliminar}
              onCambiarEstado={handleCambiarEstado}
              onEditar={abrirModalEditar}
            />
          </div>
        )}

        <UserFormModal
          open={openModal}
          modo={modoModal}
          usuarioInicial={usuarioSeleccionado}
          onClose={cerrarModal}
          onSave={handleGuardar}
        />
      </div>
    </section>
  )
}
