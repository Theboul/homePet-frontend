export type SexoMascota = "MACHO" | "HEMBRA"
export type TamanoMascota = "Pequeño" | "Mediano" | "Grande"

export interface EspecieMascota {
  id_especie: number
  nombre: string
}

export interface RazaMascota {
  id_raza: number
  id_especie: number
  nombre: string
}

export interface UsuarioMascota {
  id_usuario: number
  nombre: string
}

export interface Mascota {
  id_mascota: number
  id_usuario: number
  id_especie: number
  id_raza: number
  nombre: string
  color: string
  sexo: SexoMascota
  fecha_nac: string | null
  tamano: TamanoMascota
  peso: number
  foto: string | null
  alergias: string | null
  notas_generales: string | null
  fecha_registro: string
  estado: boolean

  especie?: EspecieMascota | null
  raza?: RazaMascota | null
  usuario?: UsuarioMascota | null
}

export interface MascotaFormValues {
  id_usuario: number | ""
  id_especie: number | ""
  id_raza: number | ""
  nombre: string
  color: string
  sexo: SexoMascota
  fecha_nac: string
  tamano: TamanoMascota
  peso: number | ""
  foto: string
  alergias: string
  notas_generales: string
  estado: boolean
}