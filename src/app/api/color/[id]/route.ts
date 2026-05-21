import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaColorRepository } from "@/src/infrastructure/database/repositories/prisma-color.repository";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { UpdateColorUseCase } from "@/src/application/color/usecase/color-save.usecase";
import { DeleteColorByIdUseCase } from "@/src/application/color/usecase/color-delete.usecase";
import { FindColorByIdUseCase } from "@/src/application/color/usecase/color-find-byId.usecase";
import { z } from "zod";
import { UpdateColorSchema } from "@/src/lib/schemas/color.schema";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UUIDSchema } from "@/src/lib/schemas/uuid-generic.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;
        
        // Rota acessada apenas por ADMIN
        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        

        const colorRepository = new PrismaColorRepository(prisma);
        const findManyUseCase = new FindColorByIdUseCase(colorRepository);

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        // usecase findmany
        const colors = await findManyUseCase.execute({ id: validatedData });

        return NextResponse.json(colors, { status: 200 });
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
        const validatedData = UpdateColorSchema.parse({ id, ...body });

        const updateColorUseCase = new UpdateColorUseCase(new PrismaColorRepository(prisma));

        const color = await updateColorUseCase.execute({
            ...validatedData,
        })

        return NextResponse.json(color, { status: 200 });
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

        if (auth.decoded?.role !== UserRole.ADMIN){
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const validatedData = UUIDSchema.parse(id);

        const colorRepository = new PrismaColorRepository(prisma);
        const deleteColorUseCase = new DeleteColorByIdUseCase(colorRepository);

        await deleteColorUseCase.execute({ id: validatedData });

        return NextResponse.json(
            { message: "Cor deletada com sucesso" },
            { status: 200 }
        )

    } catch (error: unknown) {
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }
        if (error instanceof z.ZodError) {
            console.error("ERRO: ", error)
            return NextResponse.json(
                { message: "Dados inválidos", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}