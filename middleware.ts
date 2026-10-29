import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const cookieName = "team_rbac_session";
const protectedRoutes: Record<string, string[]> = {
  "/super-admin": ["SUPER_ADMIN"],
  "/admin": ["SUPER_ADMIN", "ADMIN"],
  "/manager": ["SUPER_ADMIN", "ADMIN", "MANAGER"],
  "/user": ["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = Object.keys(protectedRoutes).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (!matchedPrefix) return NextResponse.next();

  const token = request.cookies.get(cookieName)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) throw new Error("Missing AUTH_SECRET");
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const allowed = protectedRoutes[matchedPrefix];
    if (typeof payload.role !== "string" || !allowed.includes(payload.role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(cookieName);
    return response;
  }
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*", "/manager/:path*", "/user/:path*"],
};
