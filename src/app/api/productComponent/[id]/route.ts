// Rota dinamica com params
// Rota GET -> Pesquisa uma composição via ID
// Rota PATCH -> Atualiza um registro via Id
// Rota DELETE -> Soft delete para composição de produtos

import { FindProductComponentByIdUseCase } from "@/src/application/product-component/use-case/product-component-find-byId.usecase";
import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaProductComponentRepository } from "@/src/infrastructure/database/repositories/prisma-product-component.repository";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { UpdateProductComponentUseCase } from "@/src/application/product-component/use-case/product-component-save.usecase";
import { PrismaProductRepository } from "@/src/infrastructure/database/repositories/prisma-product.repository";
import { DeleteProductComponentByIdUseCase } from "@/src/application/product-component/use-case/product-component-delete.usecase";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// Rota GET
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;
        
        // rota protegida - ADMIN E MANAGER!
        if (![UserRole.ADMIN, UserRole.MANAGER].includes(auth.decoded.role))
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const pcRepository = new PrismaProductComponentRepository(prisma);
        const findUniqueUseCase = new FindProductComponentByIdUseCase(pcRepository);

        const pc = await findUniqueUseCase.execute({ id: validatedData });

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

// ADICIONAR VALIDADOS DAS INPUTS!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<
// Rota PATCH
// body esperado: parentId, componentId e quantity
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

        const body = await req.json();
        const { id } = await params;

        function makeUpdatePcUseCase() {
            const psRepository = new PrismaProductComponentRepository(prisma);
            const productRepository = new PrismaProductRepository(prisma);
            return new UpdateProductComponentUseCase(psRepository, productRepository);
        }

        const updatePsUseCase = makeUpdatePcUseCase();
        const ps = await updatePsUseCase.execeute({
            id,
            parentProductId: body.parentId,
            componentProductId: body.componentId,
            quantity: body.quantity,
        });

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

// Rota DELETE
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
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

        const deleteUseCase = new DeleteProductComponentByIdUseCase(new PrismaProductComponentRepository(prisma));
        await deleteUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Product component deleted" },
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