import { api } from '#/store/api/api'
import type { PerfilUsuario, CreateUsuarioInput } from '../schemas'
import type { UsuariosQueryParams } from '../types'

export const usuariosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsuarios: builder.query<PerfilUsuario[], UsuariosQueryParams | void>({
      query: (params) => ({
        url: 'auth/perfiles/',
        params: params || {},
      }),
      providesTags: ['User'],
    }),

    // Crear nuevo usuario + perfil
    createUsuario: builder.mutation<PerfilUsuario, CreateUsuarioInput>({
      query: (body) => ({
        url: 'auth/perfiles/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Eliminar perfil/usuario
    deleteUsuario: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `auth/perfiles/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Actualizar perfil
    updateUsuario: builder.mutation<
      PerfilUsuario,
      { id: number; data: Partial<CreateUsuarioInput> }
    >({
      query: ({ id, data }) => ({
        url: `auth/perfiles/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsuariosQuery,
  useCreateUsuarioMutation,
  useDeleteUsuarioMutation,
  useUpdateUsuarioMutation,
} = usuariosApi
