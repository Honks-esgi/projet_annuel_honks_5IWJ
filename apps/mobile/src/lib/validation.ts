import { z } from 'zod';

export const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
});

export const registerSchema = z.object({
  username:        z.string().min(3, '3 caractères minimum'),
  email:           z.string().email('Email invalide'),
  password:        z.string().min(8, '8 caractères minimum'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Les mots de passe ne correspondent pas', path: ['confirmPassword'] }
);

export type LoginFormData    = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
