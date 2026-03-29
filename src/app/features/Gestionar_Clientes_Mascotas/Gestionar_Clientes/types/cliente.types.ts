export interface Cliente {
  id: string
  idUsuario: number
  correo: string
  nombre: string
  telefono: string
  direccion: string
  foto: string
  rol: 'cliente'
  estado: 'activo' | 'inactivo'
  fechaRegistro: string
}

export type ClienteFormData = Omit<Cliente, 'id' | 'idUsuario' | 'fechaRegistro' | 'rol'>
