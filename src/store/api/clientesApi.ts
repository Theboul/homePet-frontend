import { api } from './api'
import type {
  Cliente,
  ClienteFormData,
} from '@/app/features/Gestionar_Clientes_Mascotas/Gestionar_Clientes/types'

type ListClientesParams = {
  search?: string
  estado?: 'activo' | 'inactivo'
}

type BackendCliente = {
  id_cliente: number
  nombre: string
  apellido?: string
  correo: string
  telefono: string
  direccion: string
  activo: boolean
  fecha_registro: string
}

type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function mapBackendCliente(cliente: BackendCliente): Cliente {
  return {
    id: String(cliente.id_cliente),
    idUsuario: cliente.id_cliente,
    correo: cliente.correo,
    nombre: [cliente.nombre, cliente.apellido].filter(Boolean).join(' ').trim(),
    telefono: cliente.telefono,
    direccion: cliente.direccion,
    foto: '',
    rol: 'cliente',
    estado: cliente.activo ? 'activo' : 'inactivo',
    fechaRegistro: cliente.fecha_registro,
  }
}

function toBackendPayload(data: ClienteFormData) {
  const [firstName, ...restName] = data.nombre.trim().split(' ')

  return {
    nombre: firstName || data.nombre,
    apellido: restName.join(' '),
    telefono: data.telefono,
    direccion: data.direccion,
    activo: data.estado === 'activo',
  }
}

export const clientesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listClientes: builder.query<Cliente[], ListClientesParams | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {}

        if (params?.search) {
          queryParams.search = params.search
        }

        if (params?.estado === 'activo') {
          queryParams.activos = 'true'
        }

        return {
          url: '/gestion/clientes/',
          params: queryParams,
        }
      },
      transformResponse: (response: PaginatedResponse<BackendCliente>) =>
        response.results.map(mapBackendCliente),
      providesTags: ['Clients'],
    }),

    createCliente: builder.mutation<unknown, ClienteFormData>({
      query: (data) => ({
        url: '/gestion/clientes/register/',
        method: 'POST',
        body: {
          correo: data.correo,
          nombre: data.nombre,
          telefono: data.telefono,
          direccion: data.direccion,
          password: 'Temp12345!',
        },
      }),
      invalidatesTags: ['Clients'],
    }),

    updateCliente: builder.mutation<Cliente, { id: string; data: ClienteFormData }>({
      query: ({ id, data }) => ({
        url: `/gestion/clientes/${id}/`,
        method: 'PUT',
        body: toBackendPayload(data),
      }),
      transformResponse: (response: BackendCliente) => mapBackendCliente(response),
      invalidatesTags: ['Clients'],
    }),

    deleteCliente: builder.mutation<{ detail: string }, string>({
      query: (id) => ({
        url: `/gestion/clientes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),

    toggleClienteStatus: builder.mutation<
      { detail: string; cliente: Cliente },
      string
    >({
      query: (id) => ({
        url: `/gestion/clientes/${id}/toggle-activo/`,
        method: 'POST',
      }),
      transformResponse: (response: { detail: string; cliente: BackendCliente }) => ({
        detail: response.detail,
        cliente: mapBackendCliente(response.cliente),
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListClientesQuery,
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
  useToggleClienteStatusMutation,
} = clientesApi
