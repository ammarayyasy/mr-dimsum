"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Order, OrderItem } from "@/types/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
  QrCode,
} from "lucide-react";

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Cek auth pengguna
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/login?callbackUrl=/pesanan");
          return;
        }
        setAuthChecked(true);

        // Ambil tiket pesanan milik pengguna
        fetch("/api/orders")
          .then((r) => r.json())
          .then((json) => {
            if (json.success) {
              setOrders(json.data || []);
            }
          })
          .finally(() => setLoading(false));
      })
      .catch(() => router.push("/login?callbackUrl=/pesanan"));
  }, [router]);

  const getWaLinkForOrder = (order: Order) => {
    const text = encodeURIComponent(
      `Halo Admin Mr Dimsum Jonggol, saya ingin menanyakan status tiket pesanan #${order.order_code} atas nama ${order.user_name}.`
    );
    return `https://wa.me/${siteConfig.contact.whatsappClean}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda Mr Dimsum</span>
            </Link>

            <Link
              href="/pesanan/buat"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#4d2a00] shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pesan Dimsum Baru</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold uppercase tracking-wider mb-2">
                <Ticket className="w-3.5 h-3.5 text-[#feb316]" />
                <span>Tiket Pesanan Pelanggan</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
                Pesanan Anda
              </h1>
              <p className="text-xs sm:text-sm text-[#554336] mt-1">
                Pantau konfirmasi pembayaran dan status sajian dimsum pesanan Anda secara langsung.
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#fff8f5] border border-[#ffeada] flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#554336]">Total Tiket:</span>
              <span className="font-serif text-xl font-bold text-[#8d4b00]">
                {orders.length}
              </span>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="bg-white rounded-3xl border border-[#ffeada] p-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#8d4b00]/30 border-t-[#8d4b00] rounded-full animate-spin" />
              <span className="text-xs text-[#554336]">Memuat tiket pesanan Anda...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ffeada] p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-[#ffeada]" />
              <div className="flex flex-col gap-1 max-w-sm">
                <h2 className="font-serif text-lg font-bold text-[#4d2a00]">
                  Belum Ada Riwayat Pesanan
                </h2>
                <p className="text-xs text-[#554336] leading-relaxed">
                  Anda belum memiliki pesanan aktif. Rasakan kelezatan dimsum kukus hangat dan frozen pack buatan tangan kami sekarang.
                </p>
              </div>
              <Link
                href="/pesanan/buat"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#4d2a00] shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Pesan Dimsum Sekarang</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((ord) => {
                const itemsList: OrderItem[] =
                  typeof ord.items === "string"
                    ? JSON.parse(ord.items || "[]")
                    : ord.items || [];

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 shadow-sm flex flex-col gap-6"
                  >
                    {/* Header Bar of Ticket */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffeada]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#ffeada] text-[#8d4b00] flex items-center justify-center font-bold shrink-0">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-[#4d2a00]">
                            #{ord.order_code}
                          </span>
                          <span className="text-[11px] text-[#554336]">
                            {new Date(ord.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            WIB
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        {ord.status === "menunggu_konfirmasi" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span>Menunggu Konfirmasi</span>
                          </span>
                        )}
                        {ord.status === "dikonfirmasi" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Dikonfirmasi</span>
                          </span>
                        )}
                        {ord.status === "dibatalkan" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Dibatalkan</span>
                          </span>
                        )}

                        <span className="px-2.5 py-1 rounded-full bg-[#fff8f5] border border-[#ffeada] text-[11px] font-semibold text-[#8d4b00] capitalize">
                          {ord.order_type === "delivery"
                            ? "🛵 Kurir Delivery"
                            : ord.order_type === "dine_in"
                            ? "🥢 Makan di Kedai"
                            : "🥡 Takeaway"}
                        </span>
                      </div>
                    </div>

                    {/* Notification Callout based on status */}
                    {ord.status === "menunggu_konfirmasi" && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span>
                            Pembayaran Anda sedang diverifikasi oleh admin. Jika Anda belum menyelesaikan pembayaran, silakan buka kode QRIS.
                          </span>
                        </div>
                        <Link
                          href={`/pesanan/${ord.id}/bayar`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 text-white font-bold text-[11px] shrink-0 hover:bg-amber-800 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Buka QRIS Pembayaran</span>
                        </Link>
                      </div>
                    )}

                    {ord.status === "dikonfirmasi" && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">
                            Selamat, pembayaran Anda telah dikonfirmasi!
                          </strong>
                          <span>
                            Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp saat pesanan Anda sedang dikukus dan disiapkan.
                          </span>
                        </div>
                      </div>
                    )}

                    {ord.status === "dibatalkan" && (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs leading-relaxed flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">
                            Pesanan ini telah dibatalkan
                          </strong>
                          <span>
                            Alasan: {ord.cancel_reason || "Tidak ada rincian alasan dari pengelola."}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Order Details & Items Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Items */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4b00]">
                          Menu yang Dipesan
                        </span>
                        <div className="divide-y divide-[#ffeada]/60 text-xs">
                          {itemsList.map((it, i) => (
                            <div key={i} className="py-2 flex items-center justify-between">
                              <span className="text-[#4d2a00]">
                                {it.name} <strong className="text-[#8d4b00]">x{it.quantity}</strong>
                              </span>
                              <span className="font-semibold text-[#554336]">
                                Rp {it.subtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery/Destination Info */}
                      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#fff8f5] border border-[#ffeada] text-xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4b00]">
                          Informasi Penerima
                        </span>
                        <p className="text-[#4d2a00]">
                          <strong>Nama:</strong> {ord.user_name}
                        </p>
                        <p className="text-[#4d2a00]">
                          <strong>WhatsApp:</strong> {ord.whatsapp}
                        </p>
                        {ord.table_number && (
                          <p className="text-[#4d2a00]">
                            <strong>Nomor Meja:</strong> {ord.table_number}
                          </p>
                        )}
                        {ord.address && (
                          <p className="text-[#4d2a00]">
                            <strong>Alamat:</strong> {ord.address}
                          </p>
                        )}
                        {ord.notes && (
                          <p className="text-[#554336] italic">
                            &quot;{ord.notes}&quot;
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Total & Action Footer */}
                    <div className="pt-4 border-t border-[#ffeada] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#554336]">Total Pembayaran:</span>
                        <span className="font-serif text-xl font-bold text-[#8d4b00]">
                          Rp {ord.total_price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getWaLinkForOrder(ord)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#ffeada] text-[#8d4b00] hover:bg-[#ffeada] text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hubungi Kasir via WA</span>
                        </a>

                        {ord.status === "menunggu_konfirmasi" && (
                          <Link
                            href={`/pesanan/${ord.id}/bayar`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8d4b00] text-white hover:bg-[#4d2a00] text-xs font-bold transition-colors shadow-sm"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Buka QRIS</span>
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

