import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/merge", "/compress", "/pdf-to-word"];
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("pdfmaster_token")?.value;
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authRoutes.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/merge/:path*", "/compress/:path*", "/pdf-to-word/:path*", "/login", "/signup"]
};
