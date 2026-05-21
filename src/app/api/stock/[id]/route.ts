// Rota dinamica com params
// Rota GET -> Pesquisa um estoque via ID
// Rota PATCH -> Atualiza um registro via Id
// Rota DELETE -> Soft delete para estoque

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { FindStockByIdUseCase } from "@/src/application/stock/use-case/stock-find-byId.usecase";
import { PrismaStockRepository } from "@/src/infrastructure/database/repositories/prisma-stock.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { UpdateStockUseCase } from "@/src/application/stock/use-case/stock-save.usecase";
import { PrismaStoreRepository } from "@/src/infrastructure/database/repositories/prisma-store.repository";
import { DeleteStockByIdUseCase } from "@/src/application/stock/use-case/stock-delete.usecase";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UpdateStockSchema } from "@/src/lib/schemas/stock.schema";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// Rota GET
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const findUseCase = new FindStockByIdUseCase(new PrismaStockRepository(prisma));

        const stock = await findUseCase.execute({ id: validatedData });

        return NextResponse.json(stock, { status: 200 });
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

// Rota PATCH
// body permitido: name, stockId e type 
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const body = await req.json();

        const validatedData = UpdateStockSchema.parse({ id, ...body });

        function makeUpdateUseCase(): UpdateStockUseCase {
            const stockRepository = new PrismaStockRepository(prisma);
            const storeRepository = new PrismaStoreRepository(prisma);

            return new UpdateStockUseCase(stockRepository, storeRepository)
        }

        const updateUseCase = makeUpdateUseCase();

        const stock = await updateUseCase.execute({
            ...validatedData,
        });

        return NextResponse.json(stock, { status: 200 });
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const deleteUseCase = new DeleteStockByIdUseCase(new PrismaStockRepository(prisma));
        await deleteUseCase.execute({ id: validatedData });

        return NextResponse.json({ message: "Stock deleted", status: 200 })
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