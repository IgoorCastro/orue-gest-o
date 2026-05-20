export type Material = {
    id: string;
    name: string;

    createdAt: string;
    updatedAt: string;
    deletedAt?: string,
};

export type CreateMaterialDto = {
    name: string;

    createdAt?: string; 
    updatedAt?: string;
    deletedAt?: string;
};