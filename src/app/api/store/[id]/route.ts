// Rota dinamica com params
// Rota GET -> Pesquisa uma loja via ID
// Rota PATCH -> Atualiza um registro via Id
// Rota DELETE -> Soft delete para loja

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { FindStoreByIdUseCase } from "@/src/application/store/use-case/store-find-byId.usecase";
import { PrismaStoreRepository } from "@/src/infrastructure/database/repositories/prisma-store.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { UpdateStoreUseCase } from "@/src/application/store/use-case/store-save.usecase";
import { DeleteStoreByIdUseCase } from "@/src/application/store/use-case/store-delete.usecase";
import { z } from "zod";
import { UpdateStoreSchema } from "@/src/lib/schemas/store.schema";
import { getAuthTokem } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";

// Rota GET
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
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

        const findUseCase = new FindStoreByIdUseCase(new PrismaStoreRepository(prisma));

        const store = await findUseCase.execute({ id });

        return NextResponse.json(store, { status: 200 });
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
// body esperado: name
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        const auth = await getAuthTokem(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== 'ADMIN')
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const { id } = await params;
        const body = await req.json();

        // Validar entrada com Zod
        const validatedData = UpdateStoreSchema.parse({ id, ...body });

        const updateUseCase = new UpdateStoreUseCase(new PrismaStoreRepository(prisma));

        const store = await updateUseCase.execute({ ...validatedData });

        return NextResponse.json(store, { status: 200 });
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
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}

// Rota DELETE
// Soft delete em uma loka
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string}> }) {
    try{
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

        const deleteUseCase = new DeleteStoreByIdUseCase(new PrismaStoreRepository(prisma));

        await deleteUseCase.execute({ id: validatedData });

        return NextResponse.json({ message: "Store deleted", status: 200 });        
    }catch (error: unknown) {
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