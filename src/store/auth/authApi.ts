import { api } from '../api/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  BackendUser,
  User,
  UserRole,
} from './auth.types'

function mapBackendUser(user: BackendUser): User {
  return {
    id_usuario: user.id_usuario,
    correo: user.correo,
    role: (user.role?.nombre ?? 'CLIENT') as UserRole,
    isActive: user.is_active,
    dateJoined: user.date_joined,
  }
}

export type LoginMutationResult = {
  user: User
  accessToken: string
  refreshToken: string
}

export type RegisterMutationResult = {
  user: User
  perfil: {
    nombre: string
    telefono: string
    direccion: string
  }
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginMutationResult, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => ({
        user: mapBackendUser(response.user),
        accessToken: response.tokens.access,
        refreshToken: response.tokens.refresh,
      }),
    }),
    register: builder.mutation<RegisterMutationResult, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: RegisterResponse) => ({
        perfil: response.perfil,
        user: mapBackendUser(response.user),
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/me/',
      transformResponse: (response: BackendUser) => mapBackendUser(response),
      providesTags: ['Auth'],
    }),
    logoutSession: builder.mutation<{ detail: string }, { refresh: string }>({
      query: (payload) => ({
        url: '/auth/logout/',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutSessionMutation,
} = authApi
