export type UserRole =
  | 'ADMIN'
  | 'VETERINARIO'
  | 'CLIENTE';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}
