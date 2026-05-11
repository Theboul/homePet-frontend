import { api } from '#/store/api/api'
import type {
  FiltrosPedido,
  FiltrosSeguimiento,
  PedidoDetail,
  PedidoListItem,
  SeguimientoDetail,
  SeguimientoListItem,
} from '../types/notificaciones.types'
import { buildPedidosQueryParams, buildSeguimientosQueryParams } from '../utils/queryParams'

type ListResponse<T> =
  | T[]
  | {
      results?: T[]
      data?: T[]
    }

function normalizeListResponse<T>(response: ListResponse<T>): T[] {
  if (Array.isArray(response)) return response
  if (Array.isArray(response.results)) return response.results
  if (Array.isArray(response.data)) return response.data
  return []
}

export const notificacionesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSeguimientos: builder.query<SeguimientoListItem[], FiltrosSeguimiento | void>({
      query: (filters) => ({
        url: 'gestion/notificaciones/seguimientos/',
        params: buildSeguimientosQueryParams(filters ?? {}),
      }),
      transformResponse: (response: ListResponse<SeguimientoListItem>) => normalizeListResponse(response),
    }),
    getSeguimientoDetail: builder.query<SeguimientoDetail, number>({
      query: (idSeguimiento) => ({
        url: `gestion/notificaciones/seguimientos/${idSeguimiento}/`,
      }),
    }),
    getPedidos: builder.query<PedidoListItem[], FiltrosPedido | void>({
      query: (filters) => ({
        url: 'gestion/notificaciones/pedidos/',
        params: buildPedidosQueryParams(filters ?? {}),
      }),
      transformResponse: (response: ListResponse<PedidoListItem>) => normalizeListResponse(response),
    }),
    getPedidoDetail: builder.query<PedidoDetail, number>({
      query: (idPedido) => ({
        url: `gestion/notificaciones/pedidos/${idPedido}/`,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSeguimientosQuery,
  useGetSeguimientoDetailQuery,
  useGetPedidosQuery,
  useGetPedidoDetailQuery,
} = notificacionesApi

