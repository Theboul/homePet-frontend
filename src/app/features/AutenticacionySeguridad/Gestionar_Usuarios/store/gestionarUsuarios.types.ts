export type UserRole =
  | 'Administrador'
  | 'Veterinario'
  | 'Recepcionista'
  | 'Cliente';
export type UserStatus = 'Activo' | 'Inactivo';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: UserRole;
  estado: UserStatus;
  creadoEn: string;
}

export interface UsuarioFormData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: UserRole;
  estado: UserStatus;
}