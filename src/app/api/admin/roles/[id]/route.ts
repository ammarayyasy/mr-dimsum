import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { Role } from "@/types/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { description, permissions } = body;

    const targetRole = await db.findById<Role>("Roles", id);
    if (!targetRole) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    const updateFields: Partial<Role> = {};
    if (description !== undefined) updateFields.description = String(description).trim();
    if (permissions !== undefined) {
      updateFields.permissions = Array.isArray(permissions) ? permissions : [];
    }

    const updated = await db.update<Role>("Roles", id, updateFields);

    return NextResponse.json({
      success: true,
      message: "Role berhasil diperbarui.",
      data: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memperbarui role." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const targetRole = await db.findById<Role>("Roles", id);
    if (!targetRole) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    // Role sistem tidak boleh dihapus
    if (targetRole.is_system) {
      return NextResponse.json(
        { success: false, error: "Role bawaan sistem ('admin' atau 'user') dilindungi dan tidak boleh dihapus." },
        { status: 400 }
      );
    }

    await db.delete("Roles", id);

    return NextResponse.json({
      success: true,
      message: `Role '${targetRole.name}' berhasil dihapus.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal menghapus role." }, { status: 500 });
  }
}

