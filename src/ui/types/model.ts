export type Model = {
    id: string;
    name: string;

    createdAt: string; // importante!
    updatedAt: string;
    deletedAt?: string,
};

export type CreateModelDto = {
    name: string;

    createdAt?: string; // importante!
    updatedAt?: string;
    deletedAt?: string;
};