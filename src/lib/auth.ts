import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AuthSessionPayload } from "@/types/db";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "mr_dimsum_artisan_jwt_secret_key_jonggol_bogor_2026_super_secure";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "mr_dimsum_session";
const SESSION_EXPIRATION = "7d";

/**
 * Hash password menggunakan bcryptjs (salt rounds 10)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Bandingkan password polos dengan hash di database
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Tandatangani token JWT menggunakan jose
 */
export async function signSession(payload: AuthSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(JWT_SECRET);
}

/**
 * Verifikasi token JWT
 */
export async function verifySession(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Mengambil session pengguna yang sedang aktif dari cookie Next.js
 */
export async function getCurrentSession(): Promise<AuthSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch {
    return null;
  }
}

/**
 * Memastikan pemanggil adalah administrator, atau melempar error jika tidak sah
 */
export async function requireAdmin(): Promise<AuthSessionPayload> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (session.roleName !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/**
 * Menyimpan session ke cookie httpOnly
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  });
}

/**
 * Menghapus cookie session (Logout)
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
