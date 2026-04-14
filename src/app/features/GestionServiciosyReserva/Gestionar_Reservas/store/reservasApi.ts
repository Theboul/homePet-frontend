import { api } from '#/store/api/api'
import type {
  MascotaOption,
  PrecioServicioOption,
  Reserva,
  ReservaEstadoPayload,
  ReservaPatchPayload,
  ServicioOption,
} from './reservas.types'

export const reservasApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReservas: builder.query<Reserva[], void>({
      query: () => 'gestion/servicios/citas/',
    }),
    getMascotasOptions: builder.query<MascotaOption[], void>({
      query: () => 'gestion/clientes/mascotas/',
    }),
    getServiciosOptions: builder.query<ServicioOption[], void>({
      query: () => 'gestion/servicios/',
    }),
    getPreciosOptions: builder.query<PrecioServicioOption[], void>({
      query: () => 'gestion/servicios/precios-servicio/',
    }),
    patchReserva: builder.mutation<Reserva, { id: number; body: ReservaPatchPayload }>({
      query: ({ id, body }) => ({
        url: `gestion/servicios/citas/${id}/`,
        method: 'PATCH',
        body,
      }),
    }),
    patchEstadoReserva: builder.mutation<Reserva, { id: number; body: ReservaEstadoPayload }>({
      query: ({ id, body }) => ({
        url: `gestion/servicios/citas/${id}/estado/`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetMascotasOptionsQuery,
  useGetPreciosOptionsQuery,
  useGetReservasQuery,
  useGetServiciosOptionsQuery,
  usePatchEstadoReservaMutation,
  usePatchReservaMutation,
} = reservasApi
