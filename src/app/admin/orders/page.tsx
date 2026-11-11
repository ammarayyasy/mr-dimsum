"use client";

import { useEffect, useState } from "react";
import { Order, OrderItem } from "@/types/db";
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  X,
  AlertCircle,
  Filter,
  DollarSign,
  Truck,
  UtensilsCrossed,
  Package,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // State Modal Pembatalan
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat pesanan admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmPayment = async (orderId: string) => {
    if (!confirm("Konfirmasi bahwa pembayaran QRIS untuk pesanan ini sudah masuk dan valid?")) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dikonfirmasi" }),
      });
      const json = await res.json();
      if (json.success) {
        fetchOrders();
      } else {
        alert(json.error || "Gagal mengonfirmasi pesanan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingOrder) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch(`/api/admin/orders/${cancelingOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "dibatalkan",
          cancel_reason: cancelReason || "Dibatalkan oleh pihak pengelola toko.",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCancelingOrder(null);
        setCancelReason("");
        fetchOrders();
      } else {
        setActionError(json.error || "Gagal membatalkan pesanan.");
      }
    } catch {
      setActionError("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(false);
    }
  };

  const getWaLinkForCustomer = (order: Order) => {
    // Format nomor WhatsApp: jika mulai dari 08, ganti ke 628
    const rawWa = String(order.whatsapp || "").trim();
    let clean = rawWa.replace(/[^\d]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    } else if (clean.startsWith("8")) {
      clean = "62" + clean;
    }

    const userName = order.user_name || "Pelanggan";
    const orderCode = order.order_code || "";
    const totalPrice = Number(order.total_price || 0).toLocaleString("id-ID");

    let greeting = `Halo Kak ${userName}, kami dari Mr Dimsum Jonggol. Terkait tiket pesanan #${orderCode} senilai Rp ${totalPrice}: `;
    if (order.status === "dikonfirmasi") {
      greeting += `Pembayaran QRIS Kakak sudah kami terima dan pesanan sedang kami siapkan ya. Terima kasih!`;
    } else if (order.status === "menunggu_konfirmasi") {
      greeting += `Kami belum melihat mutasi pembayaran QRIS untuk pesanan ini. Apakah Kakak sudah melakukan pembayaran?`;
    } else {
      greeting += `Apakah ada hal yang bisa kami bantu seputar pesanan Anda?`;
    }

    return `https://wa.me/${clean}?text=${encodeURIComponent(greeting)}`;
  };

  const filteredOrders = orders.filter((ord) => {
    const q = (searchQuery || "").toLowerCase().trim();
    const orderCode = String(ord.order_code || "").toLowerCase();
    const userName = String(ord.user_name || "").toLowerCase();
    const wa = String(ord.whatsapp || "").toLowerCase();
    const address = String(ord.address || "").toLowerCase();

    const matchesSearch =
      orderCode.includes(q) ||
      userName.includes(q) ||
      wa.includes(q) ||
      address.includes(q);

    const matchesStatus = filterStatus === "all" || ord.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPending = orders.filter((o) => o.status === "menunggu_konfirmasi").length;
  const totalConfirmed = orders.filter((o) => o.status === "dikonfirmasi").length;
  const totalRevenue = orders
    .filter((o) => o.status === "dikonfirmasi")
    .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffeada]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#feb316]" />
            <span>Step 3 - Sistem Pemesanan & QRIS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
            Daftar Tiket Pesanan Masuk
          </h1>
          <p className="text-xs sm:text-sm text-[#554336] mt-1">
            Verifikasi mutasi pembayaran QRIS dan hubungi pembeli langsung melalui WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#ffeada] text-[#8d4b00] font-bold text-xs hover:bg-[#ffeada] transition-colors self-start sm:self-auto"
        >
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#ffeada] shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#554336]">
            Total Pesanan
          </span>
          <span className="font-serif text-2xl font-bold text-[#4d2a00] mt-1">
            {orders.length}
          </span>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Perlu Konfirmasi
          </span>
          <span className="font-serif text-2xl font-bold text-amber-900 mt-1">
            {totalPending}
          </span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Dikonfirmasi
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-900 mt-1">
            {totalConfirmed}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ffeada] shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#554336]">
            Total Pendapatan Terverifikasi
          </span>
          <span className="font-serif text-xl font-bold text-[#8d4b00] mt-1">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d4b00]" />
          <input
            type="text"
            placeholder="Cari kode tiket, nama, atau nomor WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] placeholder-[#554336]/50 focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Semua" },
            { id: "menunggu_konfirmasi", label: `Menunggu (${totalPending})` },
            { id: "dikonfirmasi", label: "Dikonfirmasi" },
            { id: "dibatalkan", label: "Dibatalkan" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? "bg-[#8d4b00] text-white"
                  : "bg-white border border-[#ffeada] text-[#554336] hover:bg-[#ffeada]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#ffeada] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-[#554336]">
            <div className="w-8 h-8 border-3 border-[#8d4b00]/30 border-t-[#8d4b00] rounded-full animate-spin" />
            <span>Memuat data tiket pesanan...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#554336]">
            Tidak ada tiket pesanan yang cocok dengan filter atau pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff8f5] border-b border-[#ffeada] text-[11px] font-bold uppercase tracking-wider text-[#554336]">
                  <th className="py-3 px-4">Kode Tiket & Pemesan</th>
                  <th className="py-3 px-4">Layanan</th>
                  <th className="py-3 px-4">Menu Dipesan</th>
                  <th className="py-3 px-4">Total Tagihan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi & Kontak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffeada] text-xs">
                {filteredOrders.map((ord) => {
                  const itemsList: OrderItem[] =
                    typeof ord.items === "string"
                      ? JSON.parse(ord.items || "[]")
                      : ord.items || [];

                  return (
                    <tr key={ord.id} className="hover:bg-[#fffdfb] transition-colors">
                      {/* Code & Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-[#8d4b00] text-sm">
                            #{ord.order_code}
                          </span>
                          <span className="font-semibold text-[#4d2a00] mt-0.5">
                            {ord.user_name || "Pelanggan"}
                          </span>
                          <span className="text-[11px] text-[#554336]">
                            WA: {String(ord.whatsapp || "-")}
                          </span>
                          <span className="text-[10px] text-[#554336]/70 mt-0.5">
                            {ord.created_at
                              ? new Date(ord.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                      </td>

                      {/* Order Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4d2a00]">
                            {ord.order_type === "delivery" ? (
                              <>
                                <Truck className="w-3.5 h-3.5 text-[#8d4b00]" />
                                <span>Kurir Delivery</span>
                              </>
                            ) : ord.order_type === "dine_in" ? (
                              <>
                                <UtensilsCrossed className="w-3.5 h-3.5 text-[#8d4b00]" />
                                <span>Dine-In</span>
                              </>
                            ) : (
                              <>
                                <Package className="w-3.5 h-3.5 text-[#8d4b00]" />
                                <span>Takeaway</span>
                              </>
                            )}
                          </span>

                          {ord.table_number && (
                            <span className="text-[10px] bg-[#ffeada] px-1.5 py-0.5 rounded text-[#8d4b00] self-start">
                              Meja: {ord.table_number}
                            </span>
                          )}

                          {ord.address && (
                            <span className="text-[10px] text-[#554336] max-w-xs line-clamp-2">
                              {ord.address}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5 max-w-xs">
                          {itemsList.map((it, i) => (
                            <span key={i} className="text-[11px] text-[#4d2a00]">
                              • {it.name} <strong className="text-[#8d4b00]">x{it.quantity}</strong>
                            </span>
                          ))}
                          {ord.notes && (
                            <span className="text-[10px] italic text-[#554336] mt-1">
                              Catatan: &quot;{ord.notes}&quot;
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-serif font-bold text-sm text-[#4d2a00]">
                          Rp {Number(ord.total_price || 0).toLocaleString("id-ID")}
                        </span>
                        <span className="block text-[10px] text-[#8d4b00]">
                          Metode: QRIS
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {ord.status === "menunggu_konfirmasi" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Menunggu</span>
                          </span>
                        )}
                        {ord.status === "dikonfirmasi" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Dikonfirmasi</span>
                          </span>
                        )}
                        {ord.status === "dibatalkan" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span>Dibatalkan</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Tombol Hubungi WhatsApp Pembeli */}
                          <a
                            href={getWaLinkForCustomer(ord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Hubungi Pembeli via WhatsApp"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Tombol Konfirmasi Pembayaran */}
                          {ord.status === "menunggu_konfirmasi" && (
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(ord.id)}
                              disabled={actionLoading}
                              title="Konfirmasi Pembayaran QRIS Masuk"
                              className="px-2.5 py-1.5 rounded-lg bg-[#8d4b00] text-white hover:bg-[#4d2a00] font-bold text-[11px] transition-colors disabled:opacity-50"
                            >
                              Konfirmasi
                            </button>
                          )}

                          {/* Tombol Tolak / Batalkan */}
                          {ord.status === "menunggu_konfirmasi" && (
                            <button
                              type="button"
                              onClick={() => {
                                setCancelingOrder(ord);
                                setCancelReason("");
                                setActionError("");
                              }}
                              title="Tolak atau Batalkan Pesanan"
                              className="px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-bold text-[11px] transition-colors"
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tolak / Batalkan Pesanan */}
      {cancelingOrder && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#ffeada]">
              <h2 className="font-serif text-lg font-bold text-[#4d2a00]">
                Batalkan Tiket #{cancelingOrder.order_code}
              </h2>
              <button
                type="button"
                onClick={() => setCancelingOrder(null)}
                className="p-1 rounded-lg text-[#554336] hover:bg-[#ffeada]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Alasan Pembatalan
                </label>
                <textarea
                  rows={3}
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Contoh: Stok menu hakau habis, atau bukti transfer belum masuk dalam batas waktu..."
                  className="w-full px-3.5 py-2 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#ffeada] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancelingOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#554336] hover:bg-[#ffeada]"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Memproses..." : "Ya, Batalkan Pesanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

