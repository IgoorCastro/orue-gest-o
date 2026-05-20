import { StockType } from '@/src/domain/enums/stock-type.enum';
import { z } from 'zod';

export const CreateStockSchema = z.object({
  name: z.string().min(2).max(100).trim(),
});

export const UpdateStockSchema = z.object({
  id: z.uuid("Invalid ID"),

  name: z.string().min(2).max(100).trim().optional(),

  type: z.enum(Object.values(StockType) as [StockType, ...StockType[]],
    { error: "Tipo inválido", }
  ),

  storeId: z.preprocess(
    (v) => v === '' ? undefined : v,
    z.uuid("storeId inválido")
      .optional()
  ),
  
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateStockInput = z.infer<typeof CreateStockSchema>;
export type UpdateStockInput = z.infer<typeof UpdateStockSchema>;
