// rota de restore
// restaura uma cor 'deletada'

import { ColorRestoreByIdUseCase } from "@/src/application/color/usecase/color-restore.usecase";
import { DomainError } from "@/src/domain/errors/domain.error";
import { PrismaColorRepository } from "@/src/infrastructure/database/repositories/prisma-color.repository";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../../mapDomainErrorToStatus.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// ROTA DE RESTORE
// Restaura um usuario 'deletado'
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;
        
        // Rota acessada apenas por ADMIN
        if (auth.decoded.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const colorRepository = new PrismaColorRepository(prisma);
        const restoreUseCase = new ColorRestoreByIdUseCase(colorRepository);

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