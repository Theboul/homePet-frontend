import { api } from '#/store/api/api'
import type {
  Cita,
  CitaPayload,
  Especie,
  Mascota,
  MascotaPayload,
  PrecioServicio,
  Raza,
  Servicio,
} from './cliente.types'

export const clienteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMisMascotas: builder.query<Mascota[], void>({
      query: () => '/gestion/clientes/mascotas/',
      providesTags: ['Pets'],
    }),
    createMascota: builder.mutation<Mascota, MascotaPayload>({
      query: (body) => ({
        url: '/gestion/clientes/mascotas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pets'],
    }),
    getEspecies: builder.query<Especie[], void>({
      query: () => '/gestion/clientes/especies/',
    }),
    getRazas: builder.query<Raza[], number | undefined>({
      query: (especie) => ({
        url: '/gestion/clientes/razas/',
        params: especie ? { especie } : undefined,
      }),
    }),
    getServicios: builder.query<Servicio[], void>({
      query: () => '/gestion/servicios/',
    }),
    getPreciosServicio: builder.query<PrecioServicio[], void>({
      query: () => '/gestion/servicios/precios-servicio/',
    }),
    getMisCitas: builder.query<Cita[], void>({
      query: () => '/gestion/servicios/citas/',
      providesTags: ['Appointments'],
    }),
    createCita: builder.mutation<Cita, CitaPayload>({
      query: (body) => ({
        url: '/gestion/servicios/citas/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateCita: builder.mutation<Cita, { id: number; body: Partial<CitaPayload> }>({
      query: ({ id, body }) => ({
        url: `/gestion/servicios/citas/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    cancelCita: builder.mutation<Cita, { id: number; motivo_cancelacion: string }>({
      query: ({ id, motivo_cancelacion }) => ({
        url: `/gestion/servicios/citas/${id}/estado/`,
        method: 'PATCH',
        body: {
          estado: 'CANCELADA',
          motivo_cancelacion,
        },
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCancelCitaMutation,
  useCreateCitaMutation,
  useCreateMascotaMutation,
  useGetEspeciesQuery,
  useGetMisCitasQuery,
  useGetMisMascotasQuery,
  useGetPreciosServicioQuery,
  useGetRazasQuery,
  useGetServiciosQuery,
  useUpdateCitaMutation,
} = clienteApi
