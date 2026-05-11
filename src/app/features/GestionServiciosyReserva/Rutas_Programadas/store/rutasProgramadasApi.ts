import { api } from '#/store/api/api'
import type { RutaProgramada } from './rutasProgramadas.types'

type ListResponse<T> = T[] | { results?: T[]; data?: T[] }

function normalizeListResponse<T>(response: ListResponse<T>) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response.results)) return response.results
  if (Array.isArray(response.data)) return response.data
  return []
}

export const rutasProgramadasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRutasProgramadas: builder.query<
      RutaProgramada[],
      { fecha?: string; id_veterinario?: number; id_unidad?: number; estado?: string } | void
    >({
      query: (params) => ({
        url: 'rutas-programadas/',
        params: {
          fecha: params?.fecha || undefined,
          id_veterinario: params?.id_veterinario || undefined,
          id_unidad: params?.id_unidad || undefined,
          estado: params?.estado || undefined,
        },
      }),
      transformResponse: (response: ListResponse<RutaProgramada>) =>
        normalizeListResponse(response),
      providesTags: ['Appointments'],
    }),
    getMisRutas: builder.query<RutaProgramada[], { fecha?: string } | void>({
      query: (params) => {
        const fecha = params?.fecha?.trim()

        if (!fecha) {
          return {
            url: 'mis-rutas/hoy/',
          }
        }

        return {
          url: 'mis-rutas/',
          params: { fecha },
        }
      },
      transformResponse: (response: ListResponse<RutaProgramada>) =>
        normalizeListResponse(response),
      providesTags: ['Appointments'],
    }),
    getUnidadesMoviles: builder.query<
      Array<{
        id_unidad: number
        nombre: string
        placa?: string | null
        descripcion?: string | null
        estado: boolean
        id_veterinaria: number
      }>,
      void
    >({
      query: () => ({
        url: 'unidades-moviles/',
      }),
      transformResponse: normalizeListResponse,
      providesTags: ['Appointments'],
    }),
    createUnidadMovil: builder.mutation<
      unknown,
      { nombre: string; placa?: string; descripcion?: string }
    >({
      query: (body) => ({
        url: 'unidades-moviles/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    createRutaProgramada: builder.mutation<
      unknown,
      {
        nombre: string
        fecha: string
        estado?: string
        id_unidad: number
        id_veterinario: number
      }
    >({
      query: (body) => ({
        url: 'rutas-programadas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    addDetalleRuta: builder.mutation<
      unknown,
      { idRuta: number; body: { id_cita: number; orden: number; hora_estimada?: string | null } }
    >({
      query: ({ idRuta, body }) => ({
        url: `rutas-programadas/${idRuta}/detalle/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateDetalleRuta: builder.mutation<
      unknown,
      {
        idDetalleRuta: number
        body: { orden?: number; hora_estimada?: string | null; estado?: string }
      }
    >({
      query: ({ idDetalleRuta, body }) => ({
        url: `detalle-ruta/${idDetalleRuta}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    removeDetalleRuta: builder.mutation<unknown, { idDetalleRuta: number }>({
      query: ({ idDetalleRuta }) => ({
        url: `detalle-ruta/${idDetalleRuta}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetRutasProgramadasQuery,
  useGetMisRutasQuery,
  useGetUnidadesMovilesQuery,
  useCreateUnidadMovilMutation,
  useCreateRutaProgramadaMutation,
  useAddDetalleRutaMutation,
  useUpdateDetalleRutaMutation,
  useRemoveDetalleRutaMutation,
} = rutasProgramadasApi
