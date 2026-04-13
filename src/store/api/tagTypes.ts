<<<<<<< HEAD
export const TAG_TYPES = ['Auth', 'User', 'Clients', 'Pets', 'Appointments', 'Bitacora'] as const;

export type TagType = (typeof TAG_TYPES)[number];

=======
export const TAG_TYPES = ['Auth', 'User', 'Clients', 'Pets'] as const

export type TagType = (typeof TAG_TYPES)[number]
>>>>>>> 540bde1dc3d7fe50f1f40baa579f7b8e9920449b
