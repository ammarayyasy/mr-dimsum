import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { deleteFile } from "@/lib/storage";
import { NewsArticle } from "@/types/db";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, thumbnail_path, status } = body;

    const existing = await db.findById<NewsArticle>("News", id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan." },
        { status: 404 }
      );
    }

    const updatedData: Partial<NewsArticle> = {};
    if (title) {
      updatedData.title = String(title).trim();
      updatedData.slug = slugify(title);
    }
    if (excerpt !== undefined) updatedData.excerpt = String(excerpt).trim();
    if (content !== undefined) updatedData.content = String(content).trim();
    if (thumbnail_path !== undefined) updatedData.thumbnail_path = thumbnail_path;
    if (status !== undefined) {
      updatedData.status = status === "draft" ? "draft" : "published";
    }

    const updated = await db.update<NewsArticle>("News", id, updatedData);

    return NextResponse.json({
      success: true,
      message: "Berita berhasil diperbarui.",
      data: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memperbarui berita." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const existing = await db.findById<NewsArticle>("News", id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan." },
        { status: 404 }
      );
    }

    // Jika gambar di folder /uploads/, bersihkan file fisik
    if (existing.thumbnail_path && existing.thumbnail_path.startsWith("/uploads/")) {
      await deleteFile(existing.thumbnail_path);
    }

    await db.delete("News", id);

    return NextResponse.json({
      success: true,
      message: "Berita berhasil dihapus.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal menghapus berita." }, { status: 500 });
  }
}

