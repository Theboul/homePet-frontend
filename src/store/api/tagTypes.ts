export const TAG_TYPES = [
  'Auth',
  'User',
  'Pets',
] as const;

export type TagType = typeof TAG_TYPES[number];
