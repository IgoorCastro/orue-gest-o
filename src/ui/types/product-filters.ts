import { ProductSize } from "../enum/product-size";
import { ProductType } from "../enum/product-type";

export type ProductFiltersDto = Readonly<{
    name?: string, //
    size?: ProductSize; //
    type?: ProductType, //
    barcode?: string,
    colors?: string[]; //
    materials?: string[]; //
    modelIds?: string[]; //
    mlProductId?: string,

    maxPrice?: number,
    minPrice?: number,

    price?: { //
        gte?: number, // MINIMO
        lte?: number, // MAXIMO
    },

    page?: number;
    limit?: number;
    orderBy?: string;
    
    withDeleted?: boolean,
    onlyDeleted?: boolean,
}>