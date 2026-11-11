import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan dalam formulir." },
        { status: 400 }
      );
    }

    const publicUrl = await saveFile(file);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Gambar berhasil diunggah ke penyimpanan lokal.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mengunggah file.";
    if (errorMsg === "UNAUTHORIZED" || errorMsg === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Hanya admin yang diizinkan." },
        { status: 403 }
      );
    }
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

