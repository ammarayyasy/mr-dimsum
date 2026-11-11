import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { Order, OrderItem } from "@/types/db";

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Anda harus masuk ke akun terlebih dahulu untuk memesan.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, order_type, whatsapp, address, table_number, notes } = body;

    // Validasi item pesanan
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pilih minimal 1 menu dimsum untuk dipesan." },
        { status: 400 }
      );
    }

    // Validasi kuantitas setiap item di server
    for (const it of items) {
      if (!it.quantity || it.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: "Jumlah pesanan harus lebih dari 0." },
          { status: 400 }
        );
      }
    }

    // Validasi nomor WhatsApp
    const cleanWa = String(whatsapp || "").replace(/[^\d+]/g, "").trim();
    if (!cleanWa || cleanWa.length < 9) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp aktif wajib diisi dengan benar." },
        { status: 400 }
      );
    }

    // Validasi tipe pesanan
    const validTypes = ["dine_in", "takeaway", "delivery"];
    const finalType = validTypes.includes(order_type) ? order_type : "takeaway";

    if (finalType === "delivery" && (!address || String(address).trim().length < 5)) {
      return NextResponse.json(
        { success: false, error: "Alamat pengantaran wajib diisi lengkap untuk pengiriman." },
        { status: 400 }
      );
    }

    // Hitung total harga resmi di server
    const calculatedItems: OrderItem[] = items.map((it) => ({
      dish_id: String(it.dish_id),
      name: String(it.name),
      price: Number(it.price) || 0,
      quantity: Math.max(1, Math.floor(Number(it.quantity) || 1)),
      subtotal: (Number(it.price) || 0) * Math.max(1, Math.floor(Number(it.quantity) || 1)),
    }));

    const totalPrice = calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    // Generate kode tiket pesanan unik: ORD-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `ORD-${randomSuffix}`;

    const newOrder = await db.create<Order>("Orders", {
      order_code: orderCode,
      user_id: session.userId,
      user_name: session.name,
      user_email: session.email,
      whatsapp: cleanWa,
      order_type: finalType,
      address: address ? String(address).trim() : "",
      table_number: table_number ? String(table_number).trim() : "",
      items: calculatedItems,
      total_price: totalPrice,
      status: "menunggu_konfirmasi",
      notes: notes ? String(notes).trim() : "",
      payment_method: "QRIS",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat. Silakan lakukan pembayaran QRIS.",
      data: newOrder,
    });
  } catch (err: unknown) {
    console.error("Order create error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pesanan. Silakan coba kembali." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid. Silakan login." },
        { status: 401 }
      );
    }

    // Pengguna hanya boleh melihat pesanan miliknya sendiri
    const orders = await db.find<Order>("Orders", { user_id: session.userId });

    // Format parse items jika tersimpan sebagai JSON string di spreadsheet
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

    // Urutkan dari yang paling baru
    const sorted = [...formatted].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      data: sorted,
    });
  } catch (err: unknown) {
    console.error("Order fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar pesanan." },
      { status: 500 }
    );
  }
}

