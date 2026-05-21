// update para restaurar produto

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../../mapDomainErrorToStatus.error";
import { PrismaProductRepository } from "@/src/infrastructure/database/repositories/prisma-product.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { ProductRestoreByIdUseCase } from "@/src/application/product/use-case/product-restore.usecase";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

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

        const productRepository = new PrismaProductRepository(prisma);
        const restoreUseCase = new ProductRestoreByIdUseCase(productRepository);

        await restoreUseCase.execute({ id });

        return NextResponse.json(
            { message: "Restored product" },
            { status: 200 },
        )
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