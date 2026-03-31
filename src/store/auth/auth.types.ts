export type UserRole = 'ADMIN' | 'VETERINARIAN' | 'CLIENT'

export interface BackendRole {
  id_rol: number
  nombre: UserRole
  descripcion: string | null
}

export interface User {
  id_usuario: number
  correo: string
  role: UserRole
  isActive: boolean
  dateJoined: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export interface BackendUser {
  id_usuario: number
  correo: string
  role: BackendRole
  is_active: boolean
  date_joined: string
}

export interface LoginRequest {
  correo: string
  password: string
}

export interface LoginResponse {
  tokens: {
    refresh: string
    access: string
  }
  user: BackendUser
}

export interface RegisterRequest {
  correo: string
  password: string
  nombre: string
  telefono: string
  direccion: string
}

export interface RegisterResponse {
  user: BackendUser
  perfil: {
    nombre: string
    telefono: string
    direccion: string
  }
}
