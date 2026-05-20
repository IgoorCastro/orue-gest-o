import { PrismaUserRepository } from "@/src/infrastructure/database/repositories/prisma-user.repository";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { DeleteUserByIdUseCase } from "@/src/application/user/use-case/user-delete.usecase";
import { BcryptService } from "@/src/infrastructure/services/bcrypt.service";
import { UpdateUserUseCaseUseCase } from "@/src/application/user/use-case/user-save.usecase";
import { FindUserByIdUseCase } from "@/src/application/user/use-case/user-find-byId.usecase";
import { z } from "zod";
import { UpdateUserSchema } from "@/src/lib/schemas/user.schema";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";

// get por id via params
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== 'ADMIN')
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const userRepository = new PrismaUserRepository(prisma);
        const findManyUseCase = new FindUserByIdUseCase(userRepository);

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        // useCase findMany executando
        const users = await findManyUseCase.execute({ id: validatedData });

        return NextResponse.json(users, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }

        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== 'ADMIN')
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const body = await req.json();
        const { id } = await params;

        // Validar entrada com Zod
        const validatedData = UpdateUserSchema.parse({ id, ...body });

        function makeUpdateUserUseCase() {
            const userRepository = new PrismaUserRepository(prisma);
            const hash = new BcryptService();

            return new UpdateUserUseCaseUseCase(userRepository, hash);
        }

        const updateUseCase = makeUpdateUserUseCase();

        const user = await updateUseCase.execute({ ...validatedData });

        return NextResponse.json(user, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Dados inválidos", details: error.issues },
                { status: 400 }
            );
        }
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }

        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}

// DELETE POR ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== 'ADMIN')
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);
        
        function makeDeleteUserUseCase() {
            const userRepository = new PrismaUserRepository(prisma);
            return new DeleteUserByIdUseCase(userRepository);
        }

        const deleteUserUseCase = makeDeleteUserUseCase();

        await deleteUserUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Usuário deletado com sucesso" },
            { status: 200 }
        );

    } catch (error: unknown) {
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }

        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}
