import fs from "fs/promises";
import path from "path";
import { Role, User, NewsArticle, Order } from "@/types/db";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL?.trim();
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET || "mrdimsum_gas_secret_key_2026_jonggol_secure";

// Path untuk fallback data lokal (ketika APPS_SCRIPT_URL belum disetel)
const LOCAL_DB_PATH = path.join(process.cwd(), "src", "data", "local-database.json");

// Hash bcrypt untuk password "123456"
const DEFAULT_ADMIN_HASH = "$2b$10$qKzYln9cJtveNGG89DqFRu5rMUFS340wwmcIM7c6u.ktobhkA5BDy";

interface LocalDatabase {
  Roles: Role[];
  Users: User[];
  News: NewsArticle[];
  Orders: Order[];
}

const INITIAL_LOCAL_DB: LocalDatabase = {
  Roles: [
    {
      id: "role-admin",
      name: "admin",
      description: "Administrator utama dengan akses penuh ke seluruh sistem dan warta",
      permissions: ["all"],
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user",
      name: "user",
      description: "Pengguna pelanggan umum terdaftar",
      permissions: ["read_news", "order"],
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-default",
      name: "Admin Mr Dimsum",
      email: "admin@gmail.com",
      password_hash: DEFAULT_ADMIN_HASH,
      role_id: "role-admin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news-1",
      title: "Rahasia Kulit Hakau Transparan & Gurih Kenyal Ala Pengrajin",
      slug: "rahasia-kulit-hakau-transparan",
      excerpt:
        "Kupas tuntas teknik adonan tang mien khusus untuk menghasilkan kulit hakau kristal yang lentur, bening, dan tidak mudah pecah saat dikukus panas.",
      content:
        "Proses pembuatan hakau dimulai dari pemilihan tepung gandum bebas gluten (tang mien) kualitas prima yang diseduh dengan air mendidih murni. Teknik pengadukan dengan pisau koki pipih menghasilkan ketebalan yang pas dan tekstur kenyal sempurna khas Mr Dimsum Jonggol.",
      thumbnail_path: "/images/hero-dimsum.png",
      status: "published",
      author_id: "Admin Mr Dimsum",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "news-2",
      title: "Resep Saus Chili Oil Wangi Semerbak Pendamping Dimsum",
      slug: "resep-saus-chili-oil-wangi-semerbak",
      excerpt:
        "Perpaduan cabai kering pilihan, bawang putih cincang, dan minyak aromatik rempah yang menghasilkan pedas gurih nagih tanpa rasa langu.",
      content:
        "Chili oil kami dimasak perlahan pada suhu terkontrol bersama rempah kayu manis, bunga lawang, dan minyak wijen murni. Menghasilkan aroma khas yang melengkapi kenikmatan siomay dan pangsit goreng Mr Dimsum.",
      thumbnail_path: "/images/crispy-platter.png",
      status: "published",
      author_id: "Admin Mr Dimsum",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "news-3",
      title: "Cara Mengukus Frozen Dimsum Agar Lembut Seperti Makan di Kedai",
      slug: "cara-mengukus-frozen-dimsum",
      excerpt:
        "Panduan praktis menyajikan stok dimsum beku di rumah dalam 10 menit tanpa takut kulit mengeras atau isian daging belum matang.",
      content:
        "Pastikan kukusan sudah beruap banyak sebelum memasukkan dimsum beku. Jangan biarkan menempel langsung pada logam kukusan, gunakan kertas baking berpori atau daun pisang agar aroma semakin harum dan kulit tetap lembut.",
      thumbnail_path: "/images/gourmet-variety.png",
      status: "published",
      author_id: "Admin Mr Dimsum",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  Orders: [],
};

/**
 * Helper pembacaan database lokal cadangan
 */
async function getLocalDb(): Promise<LocalDatabase> {
  try {
    const data = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data) as LocalDatabase;
  } catch {
    // Jika belum ada, buat direktori dan simpan initial db
    await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(INITIAL_LOCAL_DB, null, 2), "utf-8");
    return INITIAL_LOCAL_DB;
  }
}

/**
 * Helper penyimpanan ke database lokal cadangan
 */
async function saveLocalDb(db: LocalDatabase): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function isUsingGoogleAppsScript(): boolean {
  return Boolean(
    APPS_SCRIPT_URL &&
      APPS_SCRIPT_URL.startsWith("http") &&
      !APPS_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")
  );
}

/**
 * Memanggil Google Apps Script Web App
 */
async function callAppsScript<T>(payload: Record<string, unknown>): Promise<T> {
  if (!isUsingGoogleAppsScript()) {
    throw new Error("APPS_SCRIPT_URL belum disetel.");
  }

  const response = await fetch(APPS_SCRIPT_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: APPS_SCRIPT_SECRET,
      ...payload,
    }),
    cache: "no-store",
    redirect: "follow",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Apps Script error HTTP ${response.status}: ${text}`);
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || "Gagal memproses data di Google Apps Script");
  }

  return json as T;
}

export type TableName = "Roles" | "Users" | "News" | "Orders";

/**
 * Operasi Database Terpadu (Google Apps Script dengan cadangan Lokal)
 */
export const db = {
  /**
   * Cari banyak data berdasarkan filter opsional
   */
  async find<T>(table: TableName, filter?: Partial<T>): Promise<T[]> {
    if (isUsingGoogleAppsScript()) {
      try {
        const res = await callAppsScript<{ success: boolean; data: T[] }>({
          action: "find",
          table,
          filter,
        });
        return res.data || [];
      } catch (err) {
        console.warn("Gagal terhubung ke Google Apps Script, beralih ke cache lokal:", err);
      }
    }

    // Fallback Lokal
    const local = await getLocalDb();
    const rows = (local[table] || []) as unknown as T[];
    if (!filter || Object.keys(filter).length === 0) {
      return rows;
    }

    return rows.filter((item) => {
      for (const key in filter) {
        const expected = filter[key];
        const actual = (item as Record<string, unknown>)[key];
        if (key === "email" && typeof expected === "string" && typeof actual === "string") {
          if (expected.toLowerCase() !== actual.toLowerCase()) return false;
        } else if (expected !== actual) {
          return false;
        }
      }
      return true;
    });
  },

  /**
   * Cari satu data berdasarkan ID
   */
  async findById<T>(table: TableName, id: string): Promise<T | null> {
    if (isUsingGoogleAppsScript()) {
      try {
        const res = await callAppsScript<{ success: boolean; data: T }>({
          action: "findById",
          table,
          id,
        });
        return res.data || null;
      } catch (err) {
        console.warn("Gagal terhubung ke Google Apps Script findById, fallback lokal:", err);
      }
    }

    const local = await getLocalDb();
    const rows = (local[table] || []) as unknown as Array<T & { id: string }>;
    const found = rows.find((r) => r.id === id);
    return found || null;
  },

  /**
   * Buat record baru
   */
  async create<T extends { id: string }>(
    table: TableName,
    data: Omit<T, "id"> & { id?: string }
  ): Promise<T> {
    if (isUsingGoogleAppsScript()) {
      try {
        const res = await callAppsScript<{ success: boolean; data: T }>({
          action: "create",
          table,
          data,
        });
        return res.data;
      } catch (err) {
        console.warn("Gagal membuat di Google Apps Script, fallback lokal:", err);
      }
    }

    const local = await getLocalDb();
    const record = {
      ...data,
      id: data.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (local[table] as any[]).push(record);
    await saveLocalDb(local);
    return record as unknown as T;
  },

  /**
   * Perbarui record berdasarkan ID
   */
  async update<T extends { id: string }>(
    table: TableName,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    if (isUsingGoogleAppsScript()) {
      try {
        const res = await callAppsScript<{ success: boolean; data: T }>({
          action: "update",
          table,
          id,
          data,
        });
        return res.data;
      } catch (err) {
        console.warn("Gagal update di Google Apps Script, fallback lokal:", err);
      }
    }

    const local = await getLocalDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = local[table] as any[];
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new Error(`Data dengan ID ${id} tidak ditemukan.`);
    }

    const updated = {
      ...rows[idx],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    rows[idx] = updated;
    await saveLocalDb(local);
    return updated as T;
  },

  /**
   * Hapus record berdasarkan ID
   */
  async delete(table: TableName, id: string): Promise<boolean> {
    if (isUsingGoogleAppsScript()) {
      try {
        const res = await callAppsScript<{ success: boolean }>({
          action: "delete",
          table,
          id,
        });
        return res.success;
      } catch (err) {
        console.warn("Gagal delete di Google Apps Script, fallback lokal:", err);
      }
    }

    const local = await getLocalDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = local[table] as any[];
    const initialLen = rows.length;
    local[table] = rows.filter((r) => r.id !== id);
    if (local[table].length === initialLen) {
      return false;
    }
    await saveLocalDb(local);
    return true;
  },
};
