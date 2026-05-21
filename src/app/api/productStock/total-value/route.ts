// Rota GET
// Get com params via URL
// usar para pesquisa com filtros
// filtros: productId e stockId

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { GetProductStockValueUseCase } from "@/src/application/product-stock/usecase/product-stock-get-stock-value";
import { PrismaProductStockRepository } from "@/src/infrastructure/database/repositories/prisma-product-stock.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UserRole } from "@/src/domain/enums/user-role.enum";

//
export async function GET(req: NextRequest) {
    try{
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;
        const { searchParams } = new URL(req.url);

        // Rota protegida - ADMIN ONLY
        if (![UserRole.ADMIN, UserRole.MANAGER].includes(auth.decoded.role))
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const stockId = searchParams.get("stockId") ?? undefined;
        const productId = searchParams.get("productId") ?? undefined;

        const multUseCase = new GetProductStockValueUseCase(new PrismaProductStockRepository(prisma));

        const value = await multUseCase.execute({ productId, stockId });
                
        return NextResponse.json(value, { status: 200 });
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
