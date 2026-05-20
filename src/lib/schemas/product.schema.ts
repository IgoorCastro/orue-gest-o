import { ProductSize } from '@/src/ui/enum/product-size';
import { ProductType } from '@/src/ui/enum/product-type';
import { z } from 'zod';

const optionalTrimmedString = z.preprocess(
  (v) => v === '' ? undefined : v,
  z.string().trim().optional()
);

const optionalTrimmedModelId = z.preprocess(
  (v) => v === '' ? undefined : v,
  z.uuid("modelId inválido")
    .optional()
);

const optionalTrimmedSize = z.preprocess(
  (v) => v === '' ? undefined : v,
  z.enum(Object.values(ProductSize) as [ProductSize, ...ProductSize[]],
    { error: "Tamanho inválido", })
    .optional()
);

export const CreateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  price: z
    .number({ error: "Preço deve ser um número", })
    .positive("Preço deve ser maior que zero"),

  type: z
    .enum(Object.values(ProductType) as [ProductType, ...ProductType[]],
      { error: "Tipo inválido", }
    ),

  materialIds: z
    .array(z.uuid("materialId inválido"))
    .optional(),

  colorIds: z
    .array(z.uuid("colorId inválido"))
    .optional(),

  size: optionalTrimmedSize,

  modelId: optionalTrimmedModelId,

  mlProductId: optionalTrimmedString,
});

export const UpdateProductSchema = z.object({
  id: z
    .uuid("Id inválido"),
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),

  price: z
    .number({ error: "Preço deve ser um número", })
    .positive("Preço deve ser maior que zero"),

  type: z
    .enum(Object.values(ProductType) as [ProductType, ...ProductType[]],
      { error: "Tipo inválido", })
    .optional(),

  size: optionalTrimmedSize,

  modelId: optionalTrimmedModelId,

  materialIds: z
    .array(z.uuid("materialId inválido"))
    .optional(),

  colorIds: z
    .array(z.uuid("colorId inválido"))
    .optional(),

  mlProductId: optionalTrimmedString,
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
