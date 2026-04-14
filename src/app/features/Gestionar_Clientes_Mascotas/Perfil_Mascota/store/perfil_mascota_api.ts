import { api } from "@/store/api/api"
import type {
  HistorialClinicoResponse,
  VacunasResponse,
  Mascota,
} from "../types"

export const perfilMascotaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMascotaPerfil: builder.query<Mascota, number>({
      query: (idMascota) => `/gestion/clientes/mascotas/${idMascota}/perfil/`,
      providesTags: ["Pets"],
    }),

    getMascotaHistorialClinico: builder.query<
      HistorialClinicoResponse,
      number
    >({
      query: (idMascota) =>
        `/gestion/clientes/mascotas/${idMascota}/historial-clinico/`,
      providesTags: ["Pets"],
    }),

    getMascotaVacunas: builder.query<VacunasResponse, number>({
      query: (idMascota) => `/gestion/clientes/mascotas/${idMascota}/vacunas/`,
      providesTags: ["Pets"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetMascotaPerfilQuery,
  useGetMascotaHistorialClinicoQuery,
  useGetMascotaVacunasQuery,
} = perfilMascotaApi
