export type Store = {
    id: string;
    name: string;

    createdAt: string;
    updatedAt: string;
    deletedAt?: string,
};

export type CreateStoreDto = {
    name: string;

    createdAt?: string; // importante!
    updatedAt?: string;
    deletedAt?: string;
};