// Rota dinamica com params
// Rota GET -> Pesquisa um produto em estoque via ID
// Rota PATCH -> Atualiza um registro via Id
// Rota DELETE -> Soft delete para composição de produtos

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { FindProductStockById } from "@/src/application/product-stock/usecase/product-stock-find-byId.usecase";
import { PrismaProductStockRepository } from "@/src/infrastructure/database/repositories/prisma-product-stock.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { UpdateProductStockUseCase } from "@/src/application/product-stock/usecase/product-stock-save.usecase";
import { PrismaProductRepository } from "@/src/infrastructure/database/repositories/prisma-product.repository";
import { PrismaStockRepository } from "@/src/infrastructure/database/repositories/prisma-stock.repository";
import { DeleteProductStockByIdUseCase } from "@/src/application/product-stock/usecase/product-stock-delete.usecase";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";

// Rota GET
// params esperado: id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const findByIdUseCase = new FindProductStockById(new PrismaProductStockRepository(prisma));

        const ps = await findByIdUseCase.execute({ id: validatedData });

        return NextResponse.json(ps, { status: 200 })
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
// params esperado: id
// body permitido: productId, stockId e quantity
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // ATENÇÃO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // ROTA DESATIVADA, NÃO HÁ SUPORTE PARA EDITAR UM PRODUTO EM ESTOQUE
    // EM ESTOQUE, OPERAÇÕES PARA ADICIONAR OU REMOVER ITEMS
    // EM ESTOQUE DEVEM SEREM FEITAR ATRAVEZ DE OPERAÇÕES
    // INBOUND OU OUTBOUND!
    return NextResponse.json(
        { error: "Forbidden: Deactivated Route." },
        { status: 403 }
    );
    // try {
    //     const auth = await getAuthTokem(req);
    //     if (!auth.valid) return auth.error;

    //     // Rota protegida - ADMIN ONLY
    //     if (auth.decoded.role !== 'ADMIN')
    //         return NextResponse.json(
    //             { error: "Forbidden: Admin only" },
    //             { status: 403 }
    //         );

    //     const body = await req.json();
    //     const { id } = await params;

    //     // const { productId, stockId, quantity } = body;

    //     function makeUpdateUseCase(): UpdateProductStockUseCase {
    //         const psRepository = new PrismaProductStockRepository(prisma);
    //         const productRepository = new PrismaProductRepository(prisma);
    //         const stockRepository = new PrismaStockRepository(prisma);
    //         return new UpdateProductStockUseCase(psRepository, productRepository, stockRepository);
    //     }

    //     const updateUseCase = makeUpdateUseCase();

    //     const ps = updateUseCase.execute({
    //         id,
    //         ...body,
    //     })

    //     return NextResponse.json(ps, { status: 500 })

    // } catch (error: unknown) {
    //     if (error instanceof DomainError) {
    //         return NextResponse.json(
    //             { message: error.message },
    //             { status: mapDomainErrorToStatus(error) }
    //         );
    //     }

    //     return NextResponse.json(
    //         { message: "Erro interno" },
    //         { status: 500 }
    //     );
    // }
}

// Rota DELETE
// Soft delete atravez de um id
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

        const deleteUseCase = new DeleteProductStockByIdUseCase(new PrismaProductStockRepository(prisma));
        await deleteUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Product stock deleted" },
            { status: 200 }
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