import { api } from '#/store/api/api'
import type {
  CategoriaServicio,
  CategoriaServicioPayload,
  PrecioServicio,
  PrecioServicioPayload,
  Servicio,
  ServicioPayload,
  ToggleEstadoResponse,
} from './GestionarServiciosPreciosCatalogo'

export const gestionarCatalogoServiciosPreciosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriasServicio: builder.query<CategoriaServicio[], void>({
      query: () => ({
        url: 'servicios/categorias-servicio/',
      }),
      providesTags: ['CategoriasServicio'],
    }),

    getCategoriaServicioById: builder.query<CategoriaServicio, number>({
      query: (id) => `servicios/categorias/${id}/`,
      providesTags: (_result, _error, id) => [
        { type: 'CategoriasServicio', id },
      ],
    }),

    createCategoriaServicio: builder.mutation<
      CategoriaServicio,
      CategoriaServicioPayload
    >({
      query: (body) => ({
        url: 'servicios/categorias-servicio/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CategoriasServicio'],
    }),

    updateCategoriaServicio: builder.mutation<
      CategoriaServicio,
      { id: number; data: CategoriaServicioPayload }
    >({
      query: ({ id, data }) => ({
        url: `servicios/categorias/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'CategoriasServicio',
        { type: 'CategoriasServicio', id },
      ],
    }),

    deleteCategoriaServicio: builder.mutation<ToggleEstadoResponse, number>({
      query: (id) => ({
        url: `servicios/categorias/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CategoriasServicio', 'Servicios'],
    }),

    // =========================
    // Servicios
    // =========================
    getServicios: builder.query<Servicio[], void>({
      query: () => ({
        url: 'servicios/',
      }),
      providesTags: ['Servicios'],
    }),

    getServicioById: builder.query<Servicio, number>({
      query: (id) => `servicios/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Servicios', id }],
    }),

    createServicio: builder.mutation<Servicio, ServicioPayload>({
      query: (body) => ({
        url: 'servicios/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Servicios', 'PreciosServicio'],
    }),

    updateServicio: builder.mutation<
      Servicio,
      { id: number; data: ServicioPayload }
    >({
      query: ({ id, data }) => ({
        url: `servicios/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Servicios',
        { type: 'Servicios', id },
      ],
    }),

    deleteServicio: builder.mutation<ToggleEstadoResponse, number>({
      query: (id) => ({
        url: `servicios/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Servicios', 'PreciosServicio'],
    }),

    // =========================
    // Precios de servicio
    // =========================
    getPreciosServicio: builder.query<PrecioServicio[], void>({
      query: () => ({
        url: 'servicios/precios-servicio/',
      }),
      providesTags: ['PreciosServicio'],
    }),

    getPrecioServicioById: builder.query<PrecioServicio, number>({
      query: (id) => `servicios/precios-servicio/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'PreciosServicio', id }],
    }),

    createPrecioServicio: builder.mutation<
      PrecioServicio,
      PrecioServicioPayload
    >({
      query: (body) => ({
        url: 'servicios/precios-servicio/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PreciosServicio'],
    }),

    updatePrecioServicio: builder.mutation<
      PrecioServicio,
      { id: number; data: PrecioServicioPayload }
    >({
      query: ({ id, data }) => ({
        url: `servicios/precios-servicio/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'PreciosServicio',
        { type: 'PreciosServicio', id },
      ],
    }),

    deletePrecioServicio: builder.mutation<ToggleEstadoResponse, number>({
      query: (id) => ({
        url: `servicios/precios-servicio/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PreciosServicio'],
    }),
  }),
})

export const {
  useGetCategoriasServicioQuery,
  useLazyGetCategoriasServicioQuery,
  useGetCategoriaServicioByIdQuery,
  useCreateCategoriaServicioMutation,
  useUpdateCategoriaServicioMutation,
  useDeleteCategoriaServicioMutation,

  useGetServiciosQuery,
  useLazyGetServiciosQuery,
  useGetServicioByIdQuery,
  useCreateServicioMutation,
  useUpdateServicioMutation,
  useDeleteServicioMutation,

  useGetPreciosServicioQuery,
  useLazyGetPreciosServicioQuery,
  useGetPrecioServicioByIdQuery,
  useCreatePrecioServicioMutation,
  useUpdatePrecioServicioMutation,
  useDeletePrecioServicioMutation,
} = gestionarCatalogoServiciosPreciosApi
