import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodedToken extends JwtPayload {
  id: string;
  name: string;
  role: string;
}

export function verifyToken(token?: string | null) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;
    return { id: decoded.id, name: decoded.name, role: decoded.role };
  } catch (e) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  return req.cookies.get("auth-token")?.value ?? null;
}

export function getUserFromRequest(req: NextRequest) {
  const token = getTokenFromRequest(req);
  return verifyToken(token);
}

export default { verifyToken, getTokenFromRequest, getUserFromRequest };
