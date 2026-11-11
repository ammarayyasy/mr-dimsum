import { NextResponse } from "next/server";
import { db } from "@/lib/sheets";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { User, Role } from "@/types/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existingUsers = await db.find<User>("Users", { email: cleanEmail });
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email ini sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 409 }
      );
    }

    // Cari atau pastikan role 'user' ada
    let userRole = (await db.find<Role>("Roles", { name: "user" }))[0];
    if (!userRole) {
      userRole = {
        id: "role-user",
        name: "user",
        description: "Pengguna pelanggan umum terdaftar",
        permissions: ["read_news", "order"],
        is_system: true,
        created_at: new Date().toISOString(),
      };
      await db.create<Role>("Roles", userRole);
    }

    // Hash password di server
    const hashedPassword = await hashPassword(String(password));

    // Buat akun baru
    const newUser = await db.create<User>("Users", {
      name: String(name).trim(),
      email: cleanEmail,
      password_hash: hashedPassword,
      role_id: userRole.id,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Otomatis login dengan JWT cookie
    const token = await signSession({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roleName: userRole.name,
      roleId: userRole.id,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Pendaftaran akun berhasil.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roleName: userRole.name,
      },
    });
  } catch (err: unknown) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pendaftaran akun. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

