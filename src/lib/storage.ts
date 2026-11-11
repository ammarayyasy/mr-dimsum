import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Tipe mime gambar yang diperbolehkan
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Deteksi apakah berjalan di production Vercel atau lokal
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function ensureUploadsDir(): Promise<void> {
  if (IS_PRODUCTION) return; // Di production, tidak ada disk lokal
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Gagal membuat folder uploads:", err);
  }
}

/**
 * Menyimpan file yang diunggah:
 * - Production (Vercel): tersimpan ke Vercel Blob (cloud), dikembalikan URL publik https://...
 * - Development (lokal): tersimpan ke public/uploads/, dikembalikan path lokal /uploads/...
 */
export async function saveFile(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Format file tidak didukung (${file.type}). Gunakan format JPG, PNG, atau WEBP.`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Batas maksimal adalah 5MB.`
    );
  }

  // Ekstrak ekstensi yang aman
  const originalExt = path.extname(file.name).toLowerCase();
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(originalExt)
    ? originalExt
    : ".jpg";

  // Nama file unik dengan timestamp & random hash
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const filename = `media-${Date.now()}-${randomSuffix}${safeExt}`;

  // ─── MODE PRODUCTION: Upload ke Vercel Blob ───────────────────────────────
  if (IS_PRODUCTION && BLOB_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      token: BLOB_TOKEN,
    });
    return blob.url; // URL publik dari CDN Vercel Blob, misal: https://xxxx.public.blob.vercel-storage.com/uploads/media-...
  }

  // ─── MODE DEVELOPMENT: Simpan ke disk lokal ──────────────────────────────
  await ensureUploadsDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

/**
 * Menghapus file:
 * - Production: hapus dari Vercel Blob (via URL lengkap)
 * - Development: hapus dari disk lokal /uploads/
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return false;

  try {
    // ─── MODE PRODUCTION: Hapus dari Vercel Blob ───────────────────────────
    if (IS_PRODUCTION && BLOB_TOKEN && fileUrl.startsWith("https://")) {
      const { del } = await import("@vercel/blob");
      await del(fileUrl, { token: BLOB_TOKEN });
      return true;
    }

    // ─── MODE DEVELOPMENT: Hapus dari disk lokal ──────────────────────────
    if (!fileUrl.startsWith("/uploads/")) {
      return false; // Jangan hapus aset statis seperti /images/hero.png
    }
    const filename = path.basename(fileUrl);
    const fullPath = path.join(UPLOADS_DIR, filename);
    await fs.unlink(fullPath);
    return true;
  } catch (err) {
    console.warn("Gagal menghapus file lama:", fileUrl, err);
    return false;
  }
}

