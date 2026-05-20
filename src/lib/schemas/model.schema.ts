import { z } from 'zod';

export const CreateModelSchema = z.object({
  name: z.string().min(3).max(100).trim(),
});

export const UpdateModelSchema = z.object({
  id: z.uuid("Invalid ID"),
  name: z.string().min(3).max(100).trim(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateModelInput = z.infer<typeof CreateModelSchema>;
export type UpdateModelInput = z.infer<typeof UpdateModelSchema>;
