import { Product } from "./product";
import { Stock } from "./stock";
import { Store } from "./store";

export type FindProductStockInputDto = Readonly<{
    stockId: string;
    productId?: string,
    productName?: string,
}>

export type ProductStock = {
    id: string;
    stockId: string,
    productId: string,
    quantity: number,

    product: Product & { colorsName?: string[] };
    stock?: Stock,
    store?: Store,

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string,
};

export type PaginatedProductStock = {
    data: ProductStock[],    

    page: number,
    limit: number,
    total: number,
}

export type CreateProductStockDto = {
    stockId: string,
    productId: string,
    quantity: number,

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string,
};