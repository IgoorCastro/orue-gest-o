import { UserRole } from "@/src/domain/enums/user-role.enum";

export type CreateUserInputDTO = Readonly<{
    name: string;
    nickname: string,
    password: string,
    role: UserRole;
}>;

export type CreateUserOutputDTO = Readonly<{
    id: string;
    name: string;
    role: UserRole;
    
    createdAt: Date;
    updatedAt: Date,
    deletedAt?: Date,
}>;