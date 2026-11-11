import { NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { User, Role } from "@/types/db";

export async function GET() {
  try {
    await requireAdmin();

    const [users, roles] = await Promise.all([
      db.find<User>("Users"),
      db.find<Role>("Roles"),
    ]);

    const roleMap = new Map<string, Role>();
    roles.forEach((r) => {
      roleMap.set(r.id, r);
      roleMap.set(r.name, r);
    });

    const enriched = users.map((u) => {
      const role = roleMap.get(u.role_id) || {
        id: u.role_id,
        name: u.role_id,
        description: "",
        permissions: [],
        is_system: false,
        created_at: "",
      };
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role_id: u.role_id,
        roleName: role.name,
        status: u.status,
        created_at: u.created_at,
        updated_at: u.updated_at,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memuat pengguna." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, email, password, role_id, status } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await db.find<User>("Users", { email: cleanEmail });
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(String(password));

    const newUser = await db.create<User>("Users", {
      name: String(name).trim(),
      email: cleanEmail,
      password_hash,
      role_id: role_id || "role-user",
      status: status === "inactive" ? "inactive" : "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Pengguna baru berhasil ditambahkan.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id,
        status: newUser.status,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal membuat pengguna." }, { status: 500 });
  }
}

