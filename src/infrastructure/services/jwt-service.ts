import { hasRoutePermission, ROUTE_PERMISSIONS } from "@/src/domain/auth/permissions";
import { UserRole } from "@/src/domain/enums/user-role.enum";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/src/infrastructure/services/auth";

type AuthResult =
  | {
    valid: true;
    decoded: DecodedToken;
  }
  | {
    valid: false;
    error: NextResponse;
  };

interface DecodedToken {
  sub: string;
  role: UserRole;
  exp?: number;
}

export function authGuard(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const { pathname } = request.nextUrl;

  // 1. EXCEÇÕES: Não aplicar segurança para APIs, arquivos internos ou assets
  // Isso garante que o fetch('/api/auth/login') chegue no arquivo route.ts
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // arquivos como favicon.ico, logo.png
    pathname === '/login'
  ) {
    // Se estiver logado e tentar ir para /login via URL, manda para a home
    if (pathname === '/login' && token) {
      try {
        const valid = verifyToken(token);
        if (valid) return NextResponse.redirect(new URL('/', request.url));
      } catch { }
    }
    return NextResponse.next();
  }

  // PROTEÇÃO GLOBAL: Qualquer rota (que não caiu na exceção acima) exige token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }

  // VALIDAÇÃO DE PERMISSÕES POR ROLE
  const isProtectedRoute = ROUTE_PERMISSIONS.some(route => pathname.startsWith(route.path));

  if (isProtectedRoute) {
    if (!hasRoutePermission(decoded.role as UserRole, pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// checagem de autenticação
export async function getAuthToken(request: NextRequest): Promise<AuthResult> {
  const token = request.cookies.get("auth-token")?.value;

  // verifica a existencia do token
  if (!token) {
    return {
      valid: false, error: NextResponse.json(
        { error: "Unauthorized" }, { status: 401 }
      )
    }
  }

  // validando o token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return { valid: true, decoded };
  } catch (error) {
    return {
      valid: false,
      error: NextResponse.json(
        {
          error:
            error instanceof jwt.TokenExpiredError
              ? "Token expired"
              : "Invalid token"
        },
        { status: 401 }
      )
    };
  }
}

// valida o token e verifica a assinatura
// validateToken removed in favor of shared verifyToken in src/infrastructure/services/auth.ts
