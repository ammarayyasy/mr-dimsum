"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Order, OrderItem } from "@/types/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  QrCode,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  Info,
  Copy,
  Check,
} from "lucide-react";

function OrderPaymentContent() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrder(json.data);
        } else {
          setError(json.error || "Pesanan tidak ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat informasi pesanan."))
      .finally(() => setLoading(false));
  }, [orderId]);

  const copyTotal = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.total_price.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWaLink = () => {
    if (!order) return siteConfig.socials.whatsapp;
    const text = encodeURIComponent(
      `Halo Mr Dimsum Jonggol, saya sudah melakukan pembayaran QRIS untuk tiket pesanan #${order.order_code} senilai Rp ${order.total_price.toLocaleString("id-ID")}. Mohon dicek dan dikonfirmasi ya.`
    );
    return `https://wa.me/${siteConfig.contact.whatsappClean}?text=${text}`;
  };

  const itemsList: OrderItem[] = order
    ? typeof order.items === "string"
      ? JSON.parse(order.items || "[]")
      : order.items || []
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/pesanan"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Daftar Pesanan Anda</span>
        </Link>

        <span className="text-xs font-semibold text-[#554336]">
          Tiket #{order?.order_code || "..."}
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-[#ffeada] p-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#8d4b00]/30 border-t-[#8d4b00] rounded-full animate-spin" />
          <span className="text-xs text-[#554336]">Memuat detail pembayaran QRIS...</span>
        </div>
      ) : error || !order ? (
        <div className="bg-white rounded-3xl border border-red-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <span className="text-sm font-bold text-red-700">{error || "Pesanan tidak ditemukan"}</span>
          <Link
            href="/pesanan/buat"
            className="mt-2 px-4 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold"
          >
            Buat Pesanan Baru
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* Payment Summary Header Card */}
          <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Menunggu Pembayaran & Konfirmasi</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
                Selesaikan Pembayaran QRIS
              </h1>
              <p className="text-xs text-[#554336] mt-1">
                Tiket: <strong className="text-[#8d4b00] font-mono">#{order.order_code}</strong> • Pemesan: {order.user_name}
              </p>
            </div>

            {/* Amount to pay */}
            <div className="flex flex-col sm:items-end p-4 rounded-2xl bg-[#fff8f5] border border-[#ffeada] shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#554336]">
                Total yang Harus Dibayar
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8d4b00]">
                  Rp {order.total_price.toLocaleString("id-ID")}
                </span>
                <button
                  type="button"
                  onClick={copyTotal}
                  title="Salin Nominal"
                  className="p-1.5 rounded-lg bg-white border border-[#ffeada] text-[#554336] hover:text-[#4d2a00] hover:bg-[#ffeada]"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* QRIS Card & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* QR Code Container (6 cols) */}
            <div className="md:col-span-6 bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold">
                <QrCode className="w-3.5 h-3.5 text-[#feb316]" />
                <span>Pindai QRIS Gopay Merchant</span>
              </div>

              {/* QRIS Graphic */}
              <div className="relative w-full max-w-[320px] aspect-[722/1024] rounded-2xl overflow-hidden border border-[#ffeada] shadow-md bg-white">
                <Image
                  src="/images/qris.jpg"
                  alt="QRIS Mohammad Ammar Ayyasy, Digital & Kreatif"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="text-center">
                <p className="text-[11px] text-[#554336]">
                  NMID: <strong className="font-mono text-[#4d2a00]">ID1026545853032</strong>
                </p>
                <p className="text-[11px] font-semibold text-[#4d2a00] mt-0.5">
                  MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF
                </p>
              </div>
            </div>

            {/* Instructions & Actions (6 cols) */}
            <div className="md:col-span-6 flex flex-col justify-between gap-6">
              
              {/* Step Guide */}
              <div className="bg-white rounded-3xl border border-[#ffeada] p-6 shadow-sm flex flex-col gap-4">
                <h2 className="font-serif text-base font-bold text-[#4d2a00] pb-2 border-b border-[#ffeada] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#8d4b00]" />
                  <span>Cara Membayar Melalui QRIS</span>
                </h2>

                <ol className="space-y-3 text-xs text-[#554336]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Buka aplikasi perbankan m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay) di ponsel Anda.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Pilih menu <strong>Scan / Bayar QRIS</strong>, lalu arahkan kamera ke barcode QRIS Mr Dimsum di samping.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Pastikan nama penerima tertulis <strong>MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF</strong> dan masukkan nominal tepat sebesar <strong>Rp {order.total_price.toLocaleString("id-ID")}</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Setelah transaksi berhasil, klik tombol <strong>&quot;Saya Sudah Membayar&quot;</strong> di bawah ini.
                    </span>
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/pesanan"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#8d4b00] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#4d2a00] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#feb316]" />
                  <span>Saya Sudah Membayar (Cek Status Tiket)</span>
                </Link>

                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 shadow-sm transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi Cepat via WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

          {/* Order Items Breakdown */}
          <div className="bg-white rounded-3xl border border-[#ffeada] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-serif text-base font-bold text-[#4d2a00] pb-2 border-b border-[#ffeada] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#8d4b00]" />
              <span>Rincian Menu dalam Tiket #{order.order_code}</span>
            </h2>

            <div className="divide-y divide-[#ffeada]/60 text-xs">
              {itemsList.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#4d2a00]">{it.name}</span>
                    <span className="text-[11px] text-[#554336]">
                      {it.quantity} porsi x Rp {it.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="font-semibold text-[#4d2a00]">
                    Rp {it.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="p-3 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-xs text-[#554336] mt-2">
                <strong>Catatan:</strong> {order.notes}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default function OrderPaymentPage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-[#554336]">
              Memuat data pembayaran...
            </div>
          }
        >
          <OrderPaymentContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
