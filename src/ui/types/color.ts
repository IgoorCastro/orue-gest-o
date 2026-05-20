export type Color = {
    id: string;
    name: string;

    createdAt: string; // importante!
    updatedAt: string;
    deletedAt?: string,
};

export type CreateColorDto = {
    name: string;

    createdAt?: string; // importante!
    updatedAt?: string;
    deletedAt?: string;
};