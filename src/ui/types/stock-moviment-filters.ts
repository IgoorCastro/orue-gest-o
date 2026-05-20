import { StockMovimentType } from "../enum/stock-moviment-type";
import { Stock } from "./stock";
import { User } from "./user";

export type StockMovimentFilteredDto = Readonly<{
    type?: StockMovimentType, //
    quantity?: number,
    fromStockId?: string, //
    toStockId?: string, //
    productStockId?: string,
    userId?: string, //
    user?: string,
    stock?: string,
    page?: number;
    limit?: number;
    fromDate?: Date, //
    toDate?: Date, //
    price?: {
        gte?: number,
        lte?: number,
    },
    createdAt?: {
        gte?: Date;
        lte?: Date;
    };
    // orderBy?: {
    //     field: "createdAt" | "quantity" | "totalPrice";
    //     direction: "asc" | "desc";
    // };
    
    orderBy?: string;
}>;