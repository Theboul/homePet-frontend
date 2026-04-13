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

const normalizeRole = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

const mapRole = (user: BackendUser): UserRole => {
  const backendRole = user.role ?? user.rol;
  const raw =
    typeof backendRole === 'string'
      ? backendRole
      : backendRole?.nombre ?? '';
  const normalized = normalizeRole(raw);

  if (normalized.includes('CLIENT')) return 'CLIENT';
  if (normalized.includes('ADMIN')) return 'ADMIN';
  if (normalized.includes('VETERIN')) return 'VETERINARIAN';

  // Roles administrativos adicionales (por ejemplo recepcionista) deben
  // poder entrar al dashboard administrativo en el frontend.
  if (normalized.includes('RECEPCION') || normalized.includes('RECEPTION')) {
    return 'ADMIN';
  }

  // Evita degradar usuarios autenticados a CLIENT por diferencias de contrato.
  return 'ADMIN';
};

const mapIsActive = (user: BackendUser): boolean => {
  if (typeof user.is_active === 'boolean') return user.is_active;
  if (typeof user.estado === 'boolean') return user.estado;

  const estado = String(user.estado ?? '')
    .toLowerCase()
    .trim();

  return estado === 'activo' || estado === 'active';
};

function mapBackendUser(user: BackendUser): User {
  return {
<<<<<<< HEAD
    id: user.id_usuario ?? user.id ?? 0,
    correo: user.correo ?? '',
    role: mapRole(user),
    isActive: mapIsActive(user),
    dateJoined: user.date_joined ?? user.fecha_creacion ?? '',
  };
=======
    id_usuario: user.id_usuario,
    correo: user.correo,
    role: (user.role?.nombre ?? 'CLIENT') as UserRole,
    isActive: user.is_active,
    dateJoined: user.date_joined,
  }
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
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
