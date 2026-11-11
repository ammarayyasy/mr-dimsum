import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { Role } from "@/types/db";

export async function GET() {
  try {
    await requireAdmin();
    const roles = await db.find<Role>("Roles");
    return NextResponse.json({ success: true, data: roles });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memuat role." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama role wajib diisi." },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim().toLowerCase().replace(/\s+/g, "_");

    const existing = await db.find<Role>("Roles", { name: cleanName });
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Role dengan nama '${cleanName}' sudah ada.` },
        { status: 409 }
      );
    }

    const newRole = await db.create<Role>("Roles", {
      name: cleanName,
      description: String(description || "").trim(),
      permissions: Array.isArray(permissions) ? permissions : ["read_news"],
      is_system: false,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Role baru berhasil ditambahkan.",
      data: newRole,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal membuat role." }, { status: 500 });
  }
}

