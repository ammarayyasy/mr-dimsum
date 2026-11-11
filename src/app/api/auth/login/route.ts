import { NextResponse } from "next/server";
import { db } from "@/lib/sheets";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { User, Role } from "@/types/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Cari user berdasarkan email
    const users = await db.find<User>("Users", { email: cleanEmail });
    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Akun Anda dinonaktifkan oleh administrator. Hubungi admin untuk bantuan." },
        { status: 403 }
      );
    }

    // Bandingkan password
    const isMatch = await verifyPassword(String(password), user.password_hash || "");
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    // Ambil info role
    const roles = await db.find<Role>("Roles", { id: user.role_id });
    const userRole = roles[0] || { id: user.role_id, name: "user" };

    // Buat JWT Token
    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      roleName: userRole.name,
      roleId: userRole.id,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleName: userRole.name,
      },
    });
  } catch (err: unknown) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi gangguan saat memproses login. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

