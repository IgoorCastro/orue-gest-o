import { FindProductByIdUseCase } from "@/src/application/product/use-case/product-find-byId.usecase";
import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaProductRepository } from "@/src/infrastructure/database/repositories/prisma-product.repository";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { UpdateProductUseCase } from "@/src/application/product/use-case/product-save.usecase";
import { PrismaColorRepository } from "@/src/infrastructure/database/repositories/prisma-color.repository";
import { PrismaMaterialRepository } from "@/src/infrastructure/database/repositories/prisma-material.repository";
import { PrismaModelRepository } from "@/src/infrastructure/database/repositories/prisma-model.repository";
import { DefaultSkuGenerator } from "@/src/domain/services/default-sku-generator";
import { DeleteProductByIdUseCase } from "@/src/application/product/use-case/product-delete.usecase";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UpdateProductSchema } from "@/src/lib/schemas/product.schema";
import { z } from "zod";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// GET via ID com params
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );  

        const productRepository = new PrismaProductRepository(prisma);
        const findByIdUseCase = new FindProductByIdUseCase(productRepository);

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const product = await findByIdUseCase.execute({ id: validatedData });

        return NextResponse.json(product, { status: 200 });
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

// Update via ID
// campos possiveis:
// name, price, mlProductId, modelId, type, size, colors e materials
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

        const body = await req.json();

        const { id } = await params;

        const validatedData = UpdateProductSchema.parse({ id, ...body });

        if (Object.keys(body).length === 0)
            return NextResponse.json(
                { message: "Nenhum dado para atualizar" },
                { status: 400 }
            );

        function makeUpdateProductUseCase() {
            const productRepository = new PrismaProductRepository(prisma);
            const colorRepository = new PrismaColorRepository(prisma);
            const materialRepository = new PrismaMaterialRepository(prisma);
            const modelRepository = new PrismaModelRepository(prisma);
            const skuService = new DefaultSkuGenerator();

            return new UpdateProductUseCase(productRepository, colorRepository, materialRepository, skuService, modelRepository);
        }

        const updateUseCase = makeUpdateProductUseCase();

        const product = await updateUseCase.execute({
            ...validatedData
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Dados inválidos", details: error.issues },
                { status: 400 }
            );
        }
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }

        return NextResponse.json(
            { message: "Erro interno", error },
            { status: 500 }
        );
    }
}

// DELETE POR ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        const deleteUseCase = new DeleteProductByIdUseCase(productRepository);

        await deleteUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Product deleted" }, 
            {  status: 200 }
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