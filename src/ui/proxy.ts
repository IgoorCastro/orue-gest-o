import { NextResponse, type NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp?: number;
}

interface RoutePermission {
  path: string;
  allowedRoles: string[];
}

// Configuração de permissões de rotas (espelhado de lib/permissions.ts)
const ROUTE_PERMISSIONS: RoutePermission[] = [
  { path: '/dashboard', allowedRoles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
  { path: '/product-stock', allowedRoles: ['ADMIN', 'MANAGER', 'OPERATOR'] },
  { path: '/inbound', allowedRoles: ['ADMIN', 'MANAGER'] },
  { path: '/outbound', allowedRoles: ['ADMIN', 'MANAGER'] },
  { path: '/transfer', allowedRoles: ['ADMIN', 'MANAGER'] },
  { path: '/stock-moviment', allowedRoles: ['ADMIN', 'MANAGER'] },
  { path: '/user', allowedRoles: ['ADMIN'] },
  { path: '/store', allowedRoles: ['ADMIN'] },
  { path: '/product', allowedRoles: ['ADMIN'] },
  { path: '/material', allowedRoles: ['ADMIN'] },
  { path: '/color', allowedRoles: ['ADMIN'] },
];

function hasRoutePermission(role: string, pathname: string): boolean {
  for (const route of ROUTE_PERMISSIONS) {
    if (pathname.startsWith(route.path)) {
      return route.allowedRoles.includes(role);
    }
  }
  return false;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Função auxiliar para decodificar token com tratamento de erro
  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      // Validar se o token não expirou
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  // Se usuário estiver autenticado e tentar acessar /login, redirecionar para dashboard
  if (pathname === '/login' && token) {
    const decoded = decodeToken(token);
    if (decoded && decoded.role) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
  }

  // Configuração do / - para qualquer usuário autenticado
  if (pathname.startsWith('/') && pathname !== '/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Validação genérica de rotas protegidas (sem role na URL)
  const isProtectedRoute = ROUTE_PERMISSIONS.some(route => pathname.startsWith(route.path));

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = decodeToken(token);


    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Validar permissão baseada na role
    if (!hasRoutePermission(decoded.role, pathname)) {
      return NextResponse.redirect(new URL(`/${decoded.role.toLocaleLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Rotas onde o middleware irá agir
  matcher: [
    '/:path',
    '/'
    // '/admin/:path*',
    // '/manager/:path*',
    // '/operator/:path*',
    // '/inbound/:path*',
    // '/outbound/:path*',
    // '/transfer/:path*',
    // '/transfer-history/:path*',
    // '/product-stock/:path*',
    // '/users/:path*',
    // '/stores/:path*',
    // '/products/:path*',
    // '/materials/:path*',
    // '/login',
  ]
};