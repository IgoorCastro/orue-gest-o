import { z } from "zod";


export const CreateProductStockSchema = z.object({
    stockId: z.uuid("stockId Invaliado"),
    productId: z.uuid("productId Invaliado"),
    quantity: z
        .number({ error: "Preço deve ser um número", })
        .positive("Preço deve ser maior que zero"),
})