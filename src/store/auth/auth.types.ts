export type UserRole = 'ADMIN' | 'VETERINARIAN' | 'CLIENT'

export interface BackendRole {
<<<<<<< HEAD
  id_rol?: number;
  nombre?: string;
  descripcion?: string | null;
=======
  id_rol: number
  nombre: UserRole
  descripcion: string | null
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
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
<<<<<<< HEAD
  id_usuario?: number;
  id?: number;
  correo?: string;
  role?: BackendRole | string;
  rol?: BackendRole | string;
  is_active?: boolean;
  estado?: boolean | string;
  date_joined?: string;
  fecha_creacion?: string;
=======
  id_usuario: number
  correo: string
  role: BackendRole
  is_active: boolean
  date_joined: string
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
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
