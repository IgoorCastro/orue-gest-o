type UserRole = {
    
}

export type User = {
    id: string;
    name: string;
    nickname: string,
    role: string; 

    createdAt: string; 
    updatedAt: string;
    deletedAt?: string;
};

export type CreateUserDto = {
    name: string;
    password: string,
    nickname: string,
    role: string,
};