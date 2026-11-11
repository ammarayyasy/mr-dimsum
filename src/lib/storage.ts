import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Tipe mime gambar yang diperbolehkan
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function ensureUploadsDir(): Promise<void> {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Gagal membuat folder uploads:", err);
  }
}

/**
 * Menyimpan file yang diunggah ke folder lokal public/uploads/
 * Mengembalikan URL publik, misalnya: "/uploads/img-1731112233.webp"
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

  await ensureUploadsDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Ekstrak ekstensi yang aman
  const originalExt = path.extname(file.name).toLowerCase();
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(originalExt)
    ? originalExt
    : ".jpg";

  // Nama file unik dengan timestamp & random hash
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const filename = `media-${Date.now()}-${randomSuffix}${safeExt}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  await fs.writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}

/**
 * Menghapus file lokal jika ada di folder /uploads/
 */
export async function deleteFile(relativePath: string): Promise<boolean> {
  if (!relativePath || !relativePath.startsWith("/uploads/")) {
    return false; // Jangan hapus file di luar folder uploads (misal /images/hero.png)
  }

  try {
    const filename = path.basename(relativePath);
    const fullPath = path.join(UPLOADS_DIR, filename);
    await fs.unlink(fullPath);
    return true;
  } catch (err) {
    console.warn("Gagal menghapus file lama:", relativePath, err);
    return false;
  }
}

