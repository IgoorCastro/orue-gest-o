import { z } from 'zod';

export const CreateColorSchema = z.object({
  name: z.string().min(3).max(100).trim(),
});

export const UpdateColorSchema = z.object({
  id: z.uuid("Invalid ID"),
  name: z.string().min(3).max(100).trim(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateColorInput = z.infer<typeof CreateColorSchema>;
export type UpdateColorInput = z.infer<typeof UpdateColorSchema>;
