import { useEffect, useMemo, useState } from 'react';
import type {
  Usuario,
  UsuarioFormData,
  UserRole,
  UserStatus,
} from './gestionarUsuarios.types';
import { useGetUsuariosQuery } from './gestionarUsuariosApi';

export const useGestionarUsuarios = () => {
  const {
    data: usuariosApi = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUsuariosQuery();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [rolFilter, setRolFilter] = useState<UserRole | 'Todos'>('Todos');
  const [estadoFilter, setEstadoFilter] = useState<UserStatus | 'Todos'>('Todos');

  useEffect(() => {
    setUsuarios(usuariosApi);
  }, [usuariosApi]);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const coincideBusqueda =
        usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(search.toLowerCase()) ||
        usuario.departamento.toLowerCase().includes(search.toLowerCase());

      const coincideRol = rolFilter === 'Todos' || usuario.rol === rolFilter;
      const coincideEstado =
        estadoFilter === 'Todos' || usuario.estado === estadoFilter;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, search, rolFilter, estadoFilter]);

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estado === 'Activo').length;
  const administradores = usuarios.filter((u) => u.rol === 'Administrador').length;

  const crearUsuario = (data: UsuarioFormData) => {
    const nuevoUsuario: Usuario = {
      id: Date.now(),
      ...data,
      creadoEn: new Date().toISOString().split('T')[0],
    };

    setUsuarios((prev) => [nuevoUsuario, ...prev]);
  };

  const eliminarUsuario = (id: number) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
  };

  const cambiarEstadoUsuario = (id: number) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              estado: usuario.estado === 'Activo' ? 'Inactivo' : 'Activo',
            }
          : usuario
      )
    );
  
  };
  const editarUsuario = (
  id: number,
  dataActualizada: Partial<UsuarioFormData>
) => {
  setUsuarios((prev) =>
    prev.map((usuario) =>
      usuario.id === id
        ? {
            ...usuario,
            ...dataActualizada,
          }
        : usuario
    )
  );
};


  return {
    usuarios,
    usuariosFiltrados,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
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
    eliminarUsuario,
    cambiarEstadoUsuario,
    editarUsuario,
  };
  
};