import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "mr_dimsum_artisan_jwt_secret_key_jonggol_bogor_2026_super_secure";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "mr_dimsum_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Verifikasi token jika ada
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sessionPayload: any = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      sessionPayload = payload;
    } catch {
      // Token tidak valid atau kadaluarsa
      sessionPayload = null;
    }
  }

  // 1. Perlindungan rute Admin (/admin dan sub-rutanya)
  if (pathname.startsWith("/admin")) {
    if (!sessionPayload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role harus admin
    if (sessionPayload.roleName !== "admin") {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  // 2. Jika sudah login dan membuka /login atau /register
  if (pathname === "/login" || pathname === "/register") {
    if (sessionPayload) {
      if (sessionPayload.roleName === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};

