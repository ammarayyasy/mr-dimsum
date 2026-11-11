import { NextResponse } from "next/server";
import { db } from "@/lib/sheets";
import { NewsArticle } from "@/types/db";

export async function GET() {
  try {
    const articles = await db.find<NewsArticle>("News", { status: "published" });

    // Urutkan artikel dari yang terbaru
    const sorted = [...articles].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json({
      success: true,
      data: sorted,
    });
  } catch (err: unknown) {
    console.error("Public news API error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat warta berita." },
      { status: 500 }
    );
  }
}

