// rota de restore
// restaura um modelo 'deletado'

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../../mapDomainErrorToStatus.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaModelRepository } from "@/src/infrastructure/database/repositories/prisma-model.repository";
import { RestoreModelByIdUseCase } from "@/src/application/model/usecase/model-restore.usecase";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// ROTA DE RESTORE
// Restaura um modelo 'deletado'
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const modelRepository = new PrismaModelRepository(prisma);
        const restoreUseCase = new RestoreModelByIdUseCase(modelRepository);

        await restoreUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Model restored" },
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