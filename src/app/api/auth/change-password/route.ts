import { NextResponse } from "next/server";
import { getCurrentSession, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { User } from "@/types/db";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Kata sandi lama dan baru wajib diisi." },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const user = await db.findById<User>("Users", session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // Cek password saat ini
    const isCurrentValid = await verifyPassword(String(currentPassword), user.password_hash || "");
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Kata sandi saat ini salah." },
        { status: 400 }
      );
    }

    // Hash password baru
    const newHash = await hashPassword(String(newPassword));
    await db.update<User>("Users", user.id, {
      password_hash: newHash,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  } catch (err: unknown) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kata sandi." },
      { status: 500 }
    );
  }
}

