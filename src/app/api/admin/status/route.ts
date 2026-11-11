import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db, isUsingGoogleAppsScript } from "@/lib/sheets";
import { User, Role, NewsArticle, Order } from "@/types/db";

export async function GET() {
  try {
    await requireAdmin();

    const isGAS = isUsingGoogleAppsScript();

    const [users, roles, news, orders] = await Promise.all([
      db.find<User>("Users"),
      db.find<Role>("Roles"),
      db.find<NewsArticle>("News"),
      db.find<Order>("Orders"),
    ]);

    const publishedNews = news.filter((n) => n.status === "published").length;
    const draftNews = news.filter((n) => n.status === "draft").length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const pendingOrders = orders.filter((o) => o.status === "menunggu_konfirmasi").length;
    const confirmedOrders = orders.filter((o) => o.status === "dikonfirmasi").length;

    return NextResponse.json({
      success: true,
      databaseMode: isGAS ? "google_spreadsheet" : "local_dev_fallback",
      databaseName: isGAS ? "Google Spreadsheet (Apps Script API)" : "Simulasi Lokal (Development Store)",
      stats: {
        totalUsers: users.length,
        activeUsers,
        totalRoles: roles.length,
        totalNews: news.length,
        publishedNews,
        draftNews,
        totalOrders: orders.length,
        pendingOrders,
        confirmedOrders,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Gagal memuat status sistem." }, { status: 500 });
  }
}

