import { Product } from "./product";

export type ProductComponent = {
    id: string;
    parentProductId: string,
    componentProductId: string,
    quantity: number,

    parentProduct: Product,
    componentProduct: Product,

    createdAt: string;
    updatedAt: string;
    deletedAt?: string,
};

export type CreateProductComponentDto = {
    parentProductId: string,
    componentProductId: string,
    
    quantity: number,
};