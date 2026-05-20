// Rota dinamica com params
// Rota GET -> Pesquisa uma loja via ID

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { FindStockMovimentByIdUseCase } from "@/src/application/stock-moviment/use-case/stock-moviment-find-byId.usecase";
import { PrismaStockMovimentRepository } from "@/src/infrastructure/database/repositories/prisma-stock-moviment.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";

// Rota GET
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (!['ADMIN', 'MANAGER'].includes(auth.decoded.role))
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const findUseCase = new FindStockMovimentByIdUseCase(new PrismaStockMovimentRepository(prisma));

        const sm = await findUseCase.execute({ id: validatedData });

        return NextResponse.json(sm, { status: 200 })
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