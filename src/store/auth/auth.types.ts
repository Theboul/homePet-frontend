export type UserRole =
  | 'ADMIN'
  | 'VETERINARIAN'
  | 'CLIENT';

export interface BackendRole {
  id_rol?: number;
  nombre?: string;
  descripcion?: string | null;
}

export interface User {
  id: number;
  correo: string;
  role: UserRole;
  isActive: boolean;
  dateJoined: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface BackendUser {
  id_usuario?: number;
  id?: number;
  correo?: string;
  role?: BackendRole | string;
  rol?: BackendRole | string;
  is_active?: boolean;
  estado?: boolean | string;
  date_joined?: string;
  fecha_creacion?: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  tokens: {
    refresh: string;
    access: string;
  };
  user: BackendUser;
}

export interface RegisterRequest {
  correo: string;
  password: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface RegisterResponse {
  user: BackendUser;
  perfil: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
}
