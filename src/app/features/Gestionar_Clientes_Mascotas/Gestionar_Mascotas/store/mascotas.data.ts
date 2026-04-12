import type {
  EspecieMascota,
  Mascota,
  MascotaFormValues,
  RazaMascota,
} from "../types"

export const especiesOptions: EspecieMascota[] = [
  { id_especie: 1, nombre: "Perro" },
  { id_especie: 2, nombre: "Gato" },
  { id_especie: 3, nombre: "Conejo" },
  { id_especie: 4, nombre: "Ave" },
]

export const razasOptions: RazaMascota[] = [
  { id_raza: 1, id_especie: 1, nombre: "Mestizo" },
  { id_raza: 2, id_especie: 1, nombre: "Husky" },
  { id_raza: 3, id_especie: 1, nombre: "Labrador" },
  { id_raza: 4, id_especie: 2, nombre: "Persa" },
  { id_raza: 5, id_especie: 2, nombre: "Siamés" },
  { id_raza: 6, id_especie: 3, nombre: "Holandés" },
  { id_raza: 7, id_especie: 4, nombre: "Canario" },
]

export const usuariosOptions = [
  { id: 11, nombre: "Carlos Roca" },
  { id: 12, nombre: "Camila Ríos" },
  { id: 13, nombre: "Thiago Méndez" },
  { id: 14, nombre: "María López" },
]

export const tamanoOptions = ["Pequeño", "Mediano", "Grande"] as const

export const mascotasMock: Mascota[] = [
  {
    id_mascota: 1,
    id_usuario: 11,
    id_especie: 1,
    id_raza: 2,
    nombre: "Firulais",
    color: "Cafe",
    sexo: "MACHO",
    fecha_nac: null,
    tamano: "Mediano",
    peso: 12.5,
    foto: null,
    alergias: null,
    notas_generales: null,
    fecha_registro: "2026-04-07T05:12:18",
    estado: true,
    especie: { id_especie: 1, nombre: "Perro" },
    raza: { id_raza: 2, id_especie: 1, nombre: "Husky" },
    usuario: { id_usuario: 11, nombre: "Carlos Roca" },
  },
  {
    id_mascota: 2,
    id_usuario: 12,
    id_especie: 2,
    id_raza: 4,
    nombre: "Mishi",
    color: "Blanco",
    sexo: "HEMBRA",
    fecha_nac: "2024-02-10",
    tamano: "Pequeño",
    peso: 4.2,
    foto: null,
    alergias: "Ninguna",
    notas_generales: "Muy tranquila",
    fecha_registro: "2026-04-08T09:20:00",
    estado: true,
    especie: { id_especie: 2, nombre: "Gato" },
    raza: { id_raza: 4, id_especie: 2, nombre: "Persa" },
    usuario: { id_usuario: 12, nombre: "Camila Ríos" },
  },
  {
    id_mascota: 3,
    id_usuario: 13,
    id_especie: 1,
    id_raza: 1,
    nombre: "Rocky",
    color: "Negro",
    sexo: "MACHO",
    fecha_nac: "2023-08-12",
    tamano: "Grande",
    peso: 28,
    foto: null,
    alergias: "Alergia al pollo",
    notas_generales: "Requiere dieta especial",
    fecha_registro: "2026-04-09T14:10:00",
    estado: true,
    especie: { id_especie: 1, nombre: "Perro" },
    raza: { id_raza: 1, id_especie: 1, nombre: "Mestizo" },
    usuario: { id_usuario: 13, nombre: "Thiago Méndez" },
  },
]

export const mascotaInitialValues: MascotaFormValues = {
  id_usuario: "",
  id_especie: "",
  id_raza: "",
  nombre: "",
  color: "",
  sexo: "MACHO",
  fecha_nac: "",
  tamano: "Mediano",
  peso: "",
  foto: "",
  alergias: "",
  notas_generales: "",
  estado: true,
}

export function crearMascota(
  data: MascotaFormValues,
  mascotas: Mascota[],
): Mascota {
  const especieSeleccionada = especiesOptions.find(
    (especie) => especie.id_especie === Number(data.id_especie),
  )

  const razaSeleccionada = razasOptions.find(
    (raza) => raza.id_raza === Number(data.id_raza),
  )

  const usuarioSeleccionado = usuariosOptions.find(
    (usuario) => usuario.id === Number(data.id_usuario),
  )

  return {
    id_mascota: mascotas.length
      ? Math.max(...mascotas.map((m) => m.id_mascota)) + 1
      : 1,
    id_usuario: Number(data.id_usuario),
    id_especie: Number(data.id_especie),
    id_raza: Number(data.id_raza),
    nombre: data.nombre,
    color: data.color,
    sexo: data.sexo,
    fecha_nac: data.fecha_nac || null,
    tamano: data.tamano,
    peso: Number(data.peso),
    foto: data.foto || null,
    alergias: data.alergias || null,
    notas_generales: data.notas_generales || null,
    fecha_registro: new Date().toISOString(),
    estado: Boolean(data.estado),
    especie: especieSeleccionada ?? null,
    raza: razaSeleccionada ?? null,
    usuario: usuarioSeleccionado
      ? {
          id_usuario: usuarioSeleccionado.id,
          nombre: usuarioSeleccionado.nombre,
        }
      : null,
  }
}

export function actualizarMascota(
  id: number,
  data: MascotaFormValues,
  mascotas: Mascota[],
): Mascota[] {
  const especieSeleccionada = especiesOptions.find(
    (especie) => especie.id_especie === Number(data.id_especie),
  )

  const razaSeleccionada = razasOptions.find(
    (raza) => raza.id_raza === Number(data.id_raza),
  )

  const usuarioSeleccionado = usuariosOptions.find(
    (usuario) => usuario.id === Number(data.id_usuario),
  )

  return mascotas.map((m) =>
    m.id_mascota === id
      ? {
          ...m,
          id_usuario: Number(data.id_usuario),
          id_especie: Number(data.id_especie),
          id_raza: Number(data.id_raza),
          nombre: data.nombre,
          color: data.color,
          sexo: data.sexo,
          fecha_nac: data.fecha_nac || null,
          tamano: data.tamano,
          peso: Number(data.peso),
          foto: data.foto || null,
          alergias: data.alergias || null,
          notas_generales: data.notas_generales || null,
          estado: Boolean(data.estado),
          especie: especieSeleccionada ?? null,
          raza: razaSeleccionada ?? null,
          usuario: usuarioSeleccionado
            ? {
                id_usuario: usuarioSeleccionado.id,
                nombre: usuarioSeleccionado.nombre,
              }
            : null,
        }
      : m,
  )
}