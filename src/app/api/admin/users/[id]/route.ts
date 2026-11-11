import { NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { User, Role } from "@/types/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { name, role_id, status, password } = body;

    const targetUser = await db.findById<User>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Cek jika target adalah admin saat ini
    const isSelf = session.userId === id;

    // Larangan menonaktifkan akun sendiri
    if (isSelf && status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    // Jika ingin mengubah role menjadi bukan admin, pastikan bukan admin terakhir
    if (role_id && role_id !== targetUser.role_id) {
      const adminRoles = await db.find<Role>("Roles", { name: "admin" });
      const adminRoleId = adminRoles[0]?.id || "role-admin";

      if (targetUser.role_id === adminRoleId && role_id !== adminRoleId) {
        const allUsers = await db.find<User>("Users");
        const activeAdmins = allUsers.filter(
          (u) => u.role_id === adminRoleId && u.status === "active"
        );
        if (activeAdmins.length <= 1) {
          return NextResponse.json(
            { success: false, error: "Tidak dapat mengubah role admin terakhir di sistem." },
            { status: 400 }
          );
        }
      }
    }

    const updateFields: Partial<User> = {};
    if (name) updateFields.name = String(name).trim();
    if (role_id) updateFields.role_id = role_id;
    if (status) updateFields.status = status === "inactive" ? "inactive" : "active";
    if (password && String(password).length >= 6) {
      updateFields.password_hash = await hashPassword(String(password));
    }

    const updated = await db.update<User>("Users", id, updateFields);

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role_id: updated.role_id,
        status: updated.status,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memperbarui pengguna." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    // Larangan menghapus diri sendiri
    if (session.userId === id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang login." },
        { status: 400 }
      );
    }

    const targetUser = await db.findById<User>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Cek apakah target merupakan admin terakhir
    const adminRoles = await db.find<Role>("Roles", { name: "admin" });
    const adminRoleId = adminRoles[0]?.id || "role-admin";

    if (targetUser.role_id === adminRoleId) {
      const allUsers = await db.find<User>("Users");
      const activeAdmins = allUsers.filter(
        (u) => u.role_id === adminRoleId && u.status === "active"
      );
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat menghapus admin terakhir di sistem." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}

