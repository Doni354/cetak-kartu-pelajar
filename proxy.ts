import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require auth
  const publicPaths = ["/login", "/api/auth/login"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Skip auth for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("session_token");
  const isAuthenticated = sessionToken?.value === "authenticated";

  // If unauthenticated: API routes return 401 JSON, page routes redirect to /login
  if (!isAuthenticated && !isPublicPath) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid atau telah berakhir" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect root to dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
