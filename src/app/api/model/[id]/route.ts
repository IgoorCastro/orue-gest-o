import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { PrismaModelRepository } from "@/src/infrastructure/database/repositories/prisma-model.repository";
import { FindModelsUseCase } from "@/src/application/model/usecase/model-find.usecase";
import { UpdateModelUseCase } from "@/src/application/model/usecase/model-save.usecase";
import { DeleteModelByIdUseCase } from "@/src/application/model/usecase/model-delete.usecase";
import { z } from "zod";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UpdateModelSchema } from "@/src/lib/schemas/model.schema";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// GET por ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const modelRepository = new PrismaModelRepository(prisma);
        const findManyUseCase = new FindModelsUseCase(modelRepository);

        const { id } = await params;
        // usecase findmany
        const models = await findManyUseCase.execute({
            id,
        });

        return NextResponse.json(models, { status: 200 });
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

// UPDATE BY ID
// passar o id via PARAMS
// 
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

        // Validar entrada com Zod
        const validatedData = UpdateModelSchema.parse({ id, ...body });

        const updateModelUseCase = new UpdateModelUseCase(new PrismaModelRepository(prisma));

        const model = await updateModelUseCase.execute({
            ...validatedData,
        })

        return NextResponse.json(model, { status: 200 });
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


// delete por id
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

        const modelRepository = new PrismaModelRepository(prisma);
        const deleteModelUseCase = new DeleteModelByIdUseCase(modelRepository);

        await deleteModelUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Material deleted" },
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