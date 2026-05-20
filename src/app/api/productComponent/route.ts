// API para tratar a composição de produto
// Rota POST -> Cria uma nova relação entre um produto pai e outros produtros filhos
// Rota GET -> Retorna uma lista de composição de produtos de acordo com o filtro enviado via body

import { CreateProductComponentUseCase } from "@/src/application/product-component/use-case/product-component-create.usecase";
import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaProductComponentRepository } from "@/src/infrastructure/database/repositories/prisma-product-component.repository";
import { PrismaProductRepository } from "@/src/infrastructure/database/repositories/prisma-product.repository";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../mapDomainErrorToStatus.error";
import { FindProductComponentsUseCase } from "@/src/application/product-component/use-case/product-component-find.usecase";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";

// Rota POST
export async function POST(req: NextRequest) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== 'ADMIN')
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const body = await req.json();

        // lista de dados necessarios para criar uma nova relação
        const { parentProductId, componentProductId, quantity } = body;

        function makeCreatePcUseCase(): CreateProductComponentUseCase {
            const productComponentRepository = new PrismaProductComponentRepository(prisma);
            const productRepository = new PrismaProductRepository(prisma);
            const uuid = new UUIDGenerator();

            return new CreateProductComponentUseCase(productComponentRepository, productRepository, uuid);
        }

        // 'pc' = Product Component
        const createPcUseCase = makeCreatePcUseCase();
        const pc = await createPcUseCase.execute({
            parentProductId,
            componentProductId,
            quantity,
        });

        return NextResponse.json(pc, { status: 200 })
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

// Rota GET
// Rota pode ser utilizada com filtros
// filtros disponiveis: parentId e componentId
export async function GET(req: NextRequest) {
    try {
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // rota protegida - ADMIN E MANAGER!
        if (!['ADMIN', 'MANAGER'].includes(auth.decoded.role))
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const { searchParams } = new URL(req.url); 
        
        const parentId = searchParams.get("parentId");
        const componentId = searchParams.get("componentId");

        const findMany = new FindProductComponentsUseCase(new PrismaProductComponentRepository(prisma));

        const pcs = await findMany.execute({
            parentId: parentId ?? undefined,
            componentId: componentId ?? undefined,
        })

        return NextResponse.json(pcs, { status: 200 })

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