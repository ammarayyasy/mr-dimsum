import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { Order } from "@/types/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status, cancel_reason } = body;

    const existing = await db.findById<Order>("Orders", id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const validStatuses = ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const updateData: Partial<Order> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "dibatalkan" && cancel_reason) {
      updateData.cancel_reason = String(cancel_reason).trim();
    }

    const updated = await db.update<Order>("Orders", id, updateData);

    return NextResponse.json({
      success: true,
      message:
        status === "dikonfirmasi"
          ? "Pembayaran pesanan berhasil dikonfirmasi!"
          : "Pesanan berhasil dibatalkan.",
      data: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED" || msg === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}

