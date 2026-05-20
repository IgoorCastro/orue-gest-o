import { UserRestoreByIdUseCase } from "@/src/application/user/use-case/user-restore.usecase";
import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaUserRepository } from "@/src/infrastructure/database/repositories/prisma-user.repository";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../../mapDomainErrorToStatus.error";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";


// ROTA DE RESTORE
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
        
        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        function makeRestoreUserUseCase() {
            const userRepository = new PrismaUserRepository(prisma);
            return new UserRestoreByIdUseCase(userRepository);
        }

        const restoreUseCase = makeRestoreUserUseCase();

        await restoreUseCase.execute({ id: validatedData });

        return NextResponse.json({ status: 200 });

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