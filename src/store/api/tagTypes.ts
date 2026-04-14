export const TAG_TYPES = [
  'Auth',
  'User',
  'Clients',
  'Pets',
  'Appointments',
  'Bitacora',
] as const;

export type TagType = (typeof TAG_TYPES)[number];
