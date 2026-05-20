import { z } from 'zod';
import { UserRole } from '@/src/domain/enums/user-role.enum';

const passwordSchema = z
  .string()
  .min(8, "Min 8 characters")
  .max(100)
  .refine((pwd) => /[A-Z]/.test(pwd), "Needs uppercase")
  .refine((pwd) => /[a-z]/.test(pwd), "Needs lowercase")
  .refine((pwd) => /[0-9]/.test(pwd), "Needs number")
  .refine((pwd) => /[!@#$%^&*]/.test(pwd), "Needs special char");

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  nickname: z.string().min(3).max(50).trim(),
  password: passwordSchema,
  role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
});

export const UpdateUserSchema = z.object({
  id: z.uuid("Invalid ID"),
  name: z.string().optional(),
  nickname: z.string().optional(),
  password: passwordSchema,
  role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]).optional(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
