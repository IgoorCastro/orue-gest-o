import { hasRoutePermission, ROUTE_PERMISSIONS } from "@/src/domain/auth/permissions";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  role: string;
  exp?: number;
}

export function authGuard(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
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
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Função auxiliar para decodificar
  const decodeToken = (t: string): DecodedToken | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(t);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) return null;
      return decoded;
    } catch {
      return null;
    }
  };

  // 2. PROTEÇÃO GLOBAL: Qualquer rota (que não caiu na exceção acima) exige token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. VALIDAÇÃO DE PERMISSÕES POR ROLE
  const isProtectedRoute = ROUTE_PERMISSIONS.some(route => pathname.startsWith(route.path));

  if (isProtectedRoute) {
    if (!hasRoutePermission(decoded.role, pathname)) {
      // Redireciona para a página base da role dele (ex: /admin ou /operator)
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// checagem de autenticação
export async function getAuthTokem(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return {
      valid: false, error: NextResponse.json(
        { error: "Unauthorized" }, { status: 401 }
      )
    }
  }

  try {
    const decoded = jwtDecode<any>(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return {
        valid: false, error: NextResponse.json(
          { error: "Token expired" }, { status: 401 }
        )
      };
    }
    return { valid: true, decoded };
  } catch {
    return {
      valid: false, error: NextResponse.json(
        { error: "Invalid token" }, { status: 401 }
      )
    };
  }
}