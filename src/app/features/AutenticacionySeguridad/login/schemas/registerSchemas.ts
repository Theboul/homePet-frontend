// src/app/features/AutenticacionySeguridad/login/schemas/register.schema.ts
import { z } from 'zod'
import { UserSchema } from './'

export const RegisterFormSchema = z.object({
  correo: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
  nombre: z.string().min(2, { message: 'Nombre demasiado corto' }),
  telefono: z.string().min(7, { message: 'Teléfono inválido' }),
  direccion: z.string().min(5, { message: 'Dirección muy corta' }),
})

export const RegisterResponseSchema = z.object({
  user: UserSchema,
  perfil: z.object({
    nombre: z.string(),
    telefono: z.string(),
    direccion: z.string(),
  }),
})

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
