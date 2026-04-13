export const TAG_TYPES = ['Auth', 'User', 'Clients', 'Pets', 'Bitacora'] as const;

export type TagType = (typeof TAG_TYPES)[number];