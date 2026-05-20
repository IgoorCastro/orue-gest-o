// rota de restore
// restaura um naterial 'deletado'

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../../mapDomainErrorToStatus.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaMaterialRepository } from "@/src/infrastructure/database/repositories/prisma-material.repository";
import { MaterialRestoreByIdUseCase } from "@/src/application/meterial/usecase/material-restore.usecase";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";

// ROTA DE RESTORE
// Restaura um usuario 'deletado'
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        if (auth.decoded.role !== 'ADMIN')
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const materialRepository = new PrismaMaterialRepository(prisma);
        const restoreUseCase = new MaterialRestoreByIdUseCase(materialRepository);

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