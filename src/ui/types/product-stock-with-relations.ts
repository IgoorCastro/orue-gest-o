import { Product } from "./product";

export type ProductStock = {
    id: string;
    stockId: string,
    productId: string,
    quantity: number,

    product: Product;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string,
};

export type CreateProductStockDto = {
    stockId: string,
    productId: string,
    quantity: number,

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string,
};