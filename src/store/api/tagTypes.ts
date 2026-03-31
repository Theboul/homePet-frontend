export const TAG_TYPES = ['Auth', 'User', 'Clients', 'Pets'] as const

export type TagType = (typeof TAG_TYPES)[number]
