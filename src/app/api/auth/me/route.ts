import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/src/infrastructure/services/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
