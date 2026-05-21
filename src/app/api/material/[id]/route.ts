import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { PrismaMaterialRepository } from "@/src/infrastructure/database/repositories/prisma-material.repository";
import { FindMaterialsUseCase } from "@/src/application/meterial/usecase/material-find.usecase";
import { UpdateMaterialUseCase } from "@/src/application/meterial/usecase/material-save.usecase";
import { DeleteMaterialByIdUseCase } from "@/src/application/meterial/usecase/material-delete.usecase";
import { z } from "zod";
import { UpdateMaterialSchema } from "@/src/lib/schemas/material.schema";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const materialRepository = new PrismaMaterialRepository(prisma);
        const findManyUseCase = new FindMaterialsUseCase(materialRepository);

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        // usecase findmany
        const materials = await findManyUseCase.execute({ id: validatedData });

        return NextResponse.json(materials, { status: 200 });
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

        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const body = await req.json();
        const { id } = await params;

        // Validar entrada com Zod
        const validatedData = UpdateMaterialSchema.parse({ id, ...body });

        const updateMaterialUseCase = new UpdateMaterialUseCase(new PrismaMaterialRepository(prisma));

        const material = await updateMaterialUseCase.execute({
            ...validatedData,
        })

        return NextResponse.json(material, { status: 200 });
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

        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        if (!id) {
            return NextResponse.json(
                { message: "Id cannot be empty" },
                { status: 400 }
            );
        }

        const colorRepository = new PrismaMaterialRepository(prisma);
        const deleteMaterialUseCase = new DeleteMaterialByIdUseCase(colorRepository);

        await deleteMaterialUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Material deletado com sucesso" },
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