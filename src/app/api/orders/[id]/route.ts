import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { Order, OrderItem } from "@/types/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = await db.findById<Order>("Orders", id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Keamanan: Cek kepemilikan pesanan
    const isOwner = order.user_id === session.userId;
    const isAdmin = session.roleName === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Anda tidak berhak melihat pesanan ini." },
        { status: 403 }
      );
    }

    // Parse items jika string
    let parsedItems: OrderItem[] = [];
    if (typeof order.items === "string") {
      try {
        parsedItems = JSON.parse(order.items);
      } catch {
        parsedItems = [];
      }
    } else if (Array.isArray(order.items)) {
      parsedItems = order.items;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        whatsapp: order.whatsapp !== undefined && order.whatsapp !== null ? String(order.whatsapp) : "",
        total_price: Number(order.total_price) || 0,
        items: parsedItems,
      },
    });
  } catch (err: unknown) {
    console.error("Order detail error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat rincian pesanan." },
      { status: 500 }
    );
  }
}

