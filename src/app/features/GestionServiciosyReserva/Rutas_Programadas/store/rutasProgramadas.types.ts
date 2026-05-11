export type EstadoRutaProgramada =
  | 'PROGRAMADA'
  | 'EN_PROCESO'
  | 'FINALIZADA'
  | 'CANCELADA'

export type EstadoDetalleRuta =
  | 'PENDIENTE'
  | 'EN_CAMINO'
  | 'ATENDIENDO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'INCIDENCIA'

export interface UnidadMovilRuta {
  id_unidad: number
  nombre: string
  placa?: string | null
}

export interface VeterinarioRuta {
  id_usuario: number
  correo: string
}

export interface ServicioRuta {
  id_servicio: number
  nombre?: string | null
}

export interface MascotaRuta {
  id_mascota: number
  nombre?: string | null
}

export interface ClienteRuta {
  id_usuario: number
  nombre?: string | null
  telefono?: string | null
}

export interface SeguimientoRutaItem {
  estado_actual: string
  descripcion?: string | null
  fecha_hora: string
}

export interface CitaRutaItem {
  id_cita: number
  fecha_programada: string
  hora_inicio: string
  hora_fin?: string | null
  modalidad: 'CLINICA' | 'DOMICILIO'
  direccion_cita?: string | null
  estado: string
  servicio: ServicioRuta
  mascota: MascotaRuta
  cliente: ClienteRuta
}

export interface DetalleRutaItem {
  id_detalle_ruta: number
  orden: number
  hora_estimada?: string | null
  estado: EstadoDetalleRuta
  cita: CitaRutaItem
  seguimiento: SeguimientoRutaItem[]
}

export interface RutaProgramada {
  id_ruta: number
  nombre: string
  fecha: string
  estado: EstadoRutaProgramada
  unidad: UnidadMovilRuta
  veterinario: VeterinarioRuta
  cantidad_citas?: number
  detalle: DetalleRutaItem[]
}
