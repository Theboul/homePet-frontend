import { api } from '#/store/api/api'
import type { Cliente, ClienteFormData } from '../types'

export const clientesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClientes: builder.query<
      Cliente[],
      {
        search?: string
        estado?: 'activo' | 'inactivo'
        direccion?: string
      } | void
    >({
      query: (params) => ({
        url: 'clientes/',
        params: params || {},
      }),
      providesTags: ['Clients'],
    }),

    createCliente: builder.mutation<Cliente, ClienteFormData>({
      query: (body) => ({
        url: 'clientes/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Clients'],
    }),

    updateCliente: builder.mutation<
      Cliente,
      { id: string; data: Partial<ClienteFormData> }
    >({
      query: ({ id, data }) => ({
        url: `clientes/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Clients'],
    }),

    deleteCliente: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `clientes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
})

export const {
  useGetClientesQuery,
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} = clientesApi
