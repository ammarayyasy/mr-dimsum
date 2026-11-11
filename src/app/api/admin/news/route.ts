import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/sheets";
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

export async function GET() {
  try {
    await requireAdmin();
    const articles = await db.find<NewsArticle>("News");
    const sorted = [...articles].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({ success: true, data: sorted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memuat berita." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { title, excerpt, content, thumbnail_path, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Judul dan isi berita wajib diisi." },
        { status: 400 }
      );
    }

    const slug = slugify(title);

    const article = await db.create<NewsArticle>("News", {
      title: String(title).trim(),
      slug,
      excerpt: String(excerpt || content.slice(0, 140)).trim(),
      content: String(content).trim(),
      thumbnail_path: thumbnail_path || "/images/hero-dimsum.png",
      status: status === "draft" ? "draft" : "published",
      author_id: session.name || "Admin Mr Dimsum",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Berita baru berhasil diterbitkan.",
      data: article,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal menyimpan berita." }, { status: 500 });
  }
}

