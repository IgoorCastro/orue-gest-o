// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "./infrastructure/services/jwt-service";

export function proxy(request: NextRequest) {
    // 1. LÓGICA DE CORS (Antigo Backend)
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    const isAllowed = allowedOrigins.includes(origin);

    // Trata Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
        const headers = new Headers();
        if (isAllowed) headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.set("Access-Control-Allow-Credentials", "true");
        return new NextResponse(null, { status: 204, headers });
    }

    // 2. LÓGICA DE AUTH (Antigo Frontend)
    const authResponse = authGuard(request);

    // 3. ADICIONA HEADERS DE CORS NA RESPOSTA DA AUTH
    if (isAllowed) {
        authResponse.headers.set("Access-Control-Allow-Origin", origin);
        authResponse.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return authResponse;
}

export const config = {
    // Aplicar em tudo exceto arquivos estáticos (favicon, images, etc)
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};