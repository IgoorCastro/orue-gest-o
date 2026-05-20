// api/id/restore
// Rota responsavel por restaurar
// lojas deletadas
// Rota PATCH -> altera o estado de deletedAt para vazio

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../../mapDomainErrorToStatus.error";
import { RestoreStoreByIdUseCase } from "@/src/application/store/use-case/store-restore.usecase";
import { PrismaStoreRepository } from "@/src/infrastructure/database/repositories/prisma-store.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";

// Rota PATCH
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

        const restoreUseCase = new RestoreStoreByIdUseCase(new PrismaStoreRepository(prisma));

        await restoreUseCase.execute({ id });

        return NextResponse.json({ message: "Store restored", status: 200 })
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