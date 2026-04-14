export const TAG_TYPES = [
  'Auth',
  'User',
  'Clients',
  'Pets',
  'Bitacora',
  'Servicios',
  'PreciosServicio',
  'CategoriasServicio',
] as const

export type TagType = (typeof TAG_TYPES)[number]
