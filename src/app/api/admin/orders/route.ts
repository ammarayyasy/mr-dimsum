import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { Order, OrderItem } from "@/types/db";

export async function GET() {
  try {
    await requireAdmin();

    const orders = await db.find<Order>("Orders");

    const formatted = orders.map((ord) => {
      let itemsList: OrderItem[] = [];
      if (typeof ord.items === "string") {
        try {
          itemsList = JSON.parse(ord.items);
        } catch {
          itemsList = [];
        }
      } else if (Array.isArray(ord.items)) {
        itemsList = ord.items;
      }
      return {
        ...ord,
        whatsapp: ord.whatsapp !== undefined && ord.whatsapp !== null ? String(ord.whatsapp) : "",
        total_price: Number(ord.total_price) || 0,
        items: itemsList,
      };
    });

    const sorted = [...formatted].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      data: sorted,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: "Gagal memuat seluruh pesanan." },
      { status: 500 }
    );
  }
}

