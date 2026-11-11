"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  Truck,
  Package,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  LogIn,
  CheckCircle2,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  portion: string;
  price: number;
  image: string;
}

const MENU_CATALOG: MenuItem[] = [
  ...siteConfig.featuredDishes.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    portion: d.portion,
    price: d.price,
    image: d.image,
  })),
  {
    id: "frozen-siomay-pack",
    name: "Frozen Siomay Ayam Udang Pack (10 Pcs)",
    category: "Frozen Pack",
    portion: "10 pcs beku + chili oil",
    price: 45000,
    image: "/images/gourmet-variety.png",
  },
  {
    id: "frozen-hakau-pack",
    name: "Frozen Hakau Kristal Pack (10 Pcs)",
    category: "Frozen Pack",
    portion: "10 pcs beku + saus cocol",
    price: 55000,
    image: "/images/hero-dimsum.png",
  },
];

export default function OrderCreatePage() {
  const router = useRouter();

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Order State
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [orderType, setOrderType] = useState<"takeaway" | "dine_in" | "delivery">("takeaway");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setUserName(data.user.name || "");
          setUserEmail(data.user.email || "");
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  // Hitung item yang dipilih
  const selectedItems = MENU_CATALOG.filter((item) => (quantities[item.id] || 0) > 0).map(
    (item) => ({
      dish_id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantities[item.id] || 0,
      subtotal: item.price * (quantities[item.id] || 0),
    })
  );

  const grandTotal = selectedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/pesanan/buat");
      return;
    }

    if (selectedItems.length === 0) {
      setErrorMessage("Silakan pilih minimal 1 menu dimsum untuk dipesan.");
      return;
    }

    if (!whatsapp || whatsapp.replace(/[^\d+]/g, "").length < 9) {
      setErrorMessage("Nomor WhatsApp aktif wajib diisi untuk konfirmasi pesanan.");
      return;
    }

    if (orderType === "delivery" && (!address || address.trim().length < 5)) {
      setErrorMessage("Alamat pengantaran wajib diisi lengkap untuk layanan kurir.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: selectedItems,
        order_type: orderType,
        whatsapp,
        address: orderType === "delivery" ? address : undefined,
        table_number: orderType === "dine_in" ? tableNumber : undefined,
        notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "Gagal membuat pesanan.");
        setLoading(false);
        return;
      }

      // Berhasil, arahkan ke halaman pembayaran QRIS
      const orderId = json.data.id;
      router.push(`/pesanan/${orderId}/bayar`);
    } catch {
      setErrorMessage("Koneksi gagal. Pastikan jaringan internet Anda aktif.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda Mr Dimsum</span>
            </Link>

            {isLoggedIn && (
              <Link
                href="/pesanan"
                className="text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] underline"
              >
                Lihat Riwayat Pesanan Anda →
              </Link>
            )}
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#feb316]/10 rounded-full blur-3xl -z-10" />
            <div className="max-w-3xl flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold uppercase tracking-wider self-start">
                <ShoppingBag className="w-3.5 h-3.5 text-[#feb316]" />
                <span>Pemesanan Artisan Dimsum Online</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4d2a00] tracking-tight">
                Formulir Pemesanan Mr Dimsum
              </h1>
              <p className="text-xs sm:text-sm text-[#554336] leading-relaxed">
                Pilih sajian kukus, goreng krispi, atau paket frozen pack favorit Anda. Pembayaran aman dan instan dengan QRIS.
              </p>
            </div>
          </div>

          {/* Login Alert Banner if Guest */}
          {isLoggedIn === false && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-bold">Harap Masuk Terlebih Dahulu</h2>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Untuk menjamin pesanan tercatat dalam tiket resmi dan status pembayaran dapat dipantau di akun Anda, silakan login sebelum memesan.
                  </p>
                </div>
              </div>
              <Link
                href="/login?callbackUrl=/pesanan/buat"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#4d2a00] shrink-0 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </Link>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form and Selection Layout */}
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Menu Selection (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Menu Catalog Grid */}
              <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
                  <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                    1. Pilih Menu Dimsum
                  </h2>
                  <span className="text-xs text-[#554336]">
                    {selectedItems.length} menu terpilih
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MENU_CATALOG.map((dish) => {
                    const qty = quantities[dish.id] || 0;
                    return (
                      <div
                        key={dish.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          qty > 0
                            ? "bg-[#fff8f5] border-[#8d4b00] shadow-sm ring-1 ring-[#8d4b00]/30"
                            : "bg-white border-[#ffeada] hover:border-[#feb316]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#ffeada] shrink-0 bg-[#ffeada]">
                            <Image
                              src={dish.image}
                              alt={dish.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[11px] font-bold text-[#8d4b00] uppercase tracking-wider">
                              {dish.category}
                            </span>
                            <h3 className="font-serif font-bold text-sm text-[#4d2a00] leading-snug line-clamp-2">
                              {dish.name}
                            </h3>
                            <span className="text-[11px] text-[#554336] mt-0.5">
                              {dish.portion}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#ffeada]/60">
                          <span className="font-serif font-bold text-sm text-[#4d2a00]">
                            Rp {dish.price.toLocaleString("id-ID")}
                          </span>

                          <div className="flex items-center gap-2">
                            {qty > 0 ? (
                              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#ffeada] shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(dish.id, -1)}
                                  className="w-6 h-6 rounded-lg bg-[#ffeada] text-[#4d2a00] hover:bg-[#8d4b00] hover:text-white flex items-center justify-center transition-colors"
                                  aria-label="Kurang"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-bold text-xs text-[#4d2a00] min-w-[20px] text-center">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(dish.id, 1)}
                                  className="w-6 h-6 rounded-lg bg-[#8d4b00] text-white hover:bg-[#4d2a00] flex items-center justify-center transition-colors"
                                  aria-label="Tambah"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => updateQuantity(dish.id, 1)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ffeada] text-[#8d4b00] font-bold text-xs hover:bg-[#8d4b00] hover:text-white transition-all shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Pesan</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Type & Information */}
              <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <h2 className="font-serif text-xl font-bold text-[#4d2a00] pb-4 border-b border-[#ffeada]">
                  2. Detail Pemesanan & Pengantaran
                </h2>

                {/* Order Type Radio Cards */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-2.5">
                    Pilihan Jenis Layanan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType("takeaway")}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        orderType === "takeaway"
                          ? "bg-[#fff8f5] border-[#8d4b00] ring-2 ring-[#8d4b00]/20"
                          : "bg-white border-[#ffeada] hover:bg-[#fffdfb]"
                      }`}
                    >
                      <Package className="w-5 h-5 text-[#8d4b00] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#4d2a00] block">
                          Takeaway (Bungkus)
                        </span>
                        <span className="text-[11px] text-[#554336] leading-tight block mt-0.5">
                          Ambil langsung di kedai Jonggol
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("dine_in")}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        orderType === "dine_in"
                          ? "bg-[#fff8f5] border-[#8d4b00] ring-2 ring-[#8d4b00]/20"
                          : "bg-white border-[#ffeada] hover:bg-[#fffdfb]"
                      }`}
                    >
                      <UtensilsCrossed className="w-5 h-5 text-[#8d4b00] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#4d2a00] block">
                          Dine-In (Di Kedai)
                        </span>
                        <span className="text-[11px] text-[#554336] leading-tight block mt-0.5">
                          Makan hangat di tempat
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("delivery")}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        orderType === "delivery"
                          ? "bg-[#fff8f5] border-[#8d4b00] ring-2 ring-[#8d4b00]/20"
                          : "bg-white border-[#ffeada] hover:bg-[#fffdfb]"
                      }`}
                    >
                      <Truck className="w-5 h-5 text-[#8d4b00] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#4d2a00] block">
                          Kurir Delivery
                        </span>
                        <span className="text-[11px] text-[#554336] leading-tight block mt-0.5">
                          Area Jonggol & sekitarnya
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                      Nama Pemesan
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5 flex items-center justify-between">
                      <span>Nomor WhatsApp Aktif</span>
                      <span className="text-[10px] text-[#8d4b00] font-normal">Wajib diisi</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d4b00]">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 081289005544"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Dine-in Table Number Field */}
                {orderType === "dine_in" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                      Nomor Meja (Jika Sudah Duduk)
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: Meja 04 (atau kosongkan jika belum duduk)"
                      className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                    />
                  </div>
                )}

                {/* Delivery Address Field */}
                {orderType === "delivery" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8d4b00]" />
                      <span>Alamat Lengkap Pengantaran (Wilayah Jonggol)</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Contoh: Jl. Raya Jonggol No. 12, RT 02/RW 03, dekat Masjid Al-Ikhlas..."
                      className="w-full px-3.5 py-2 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                    />
                  </div>
                )}

                {/* Special Notes Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8d4b00]" />
                    <span>Catatan Khusus Pesanan (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Chili oil dipisah, tidak pakai daun bawang, minta kukus ekstra panas..."
                    className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Summary & Payment CTA (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-[#ffeada] p-6 shadow-sm sticky top-28 flex flex-col gap-5">
                <h2 className="font-serif text-lg font-bold text-[#4d2a00] pb-3 border-b border-[#ffeada] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#8d4b00]" />
                  <span>Ringkasan Pesanan</span>
                </h2>

                {/* Selected Items List */}
                {selectedItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#554336] flex flex-col items-center gap-2">
                    <UtensilsCrossed className="w-8 h-8 text-[#ffeada]" />
                    <span>Belum ada menu yang dipilih.</span>
                    <span className="text-[11px] text-[#8d4b00]">Klik tombol &quot;Pesan&quot; di daftar menu.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#ffeada]/50 text-xs">
                    {selectedItems.map((it) => (
                      <div key={it.dish_id} className="pt-2.5 flex items-center justify-between">
                        <div className="flex flex-col max-w-[180px]">
                          <span className="font-bold text-[#4d2a00] truncate">
                            {it.name}
                          </span>
                          <span className="text-[11px] text-[#554336]">
                            {it.quantity} x Rp {it.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <span className="font-semibold text-[#4d2a00]">
                          Rp {it.subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total & Payment Method Card */}
                <div className="pt-4 border-t border-[#ffeada] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#554336]">Metode Pembayaran</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold text-[11px]">
                      QRIS Nasional
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#ffeada]">
                    <span className="font-bold text-sm text-[#4d2a00]">Total Biaya</span>
                    <span className="font-serif font-bold text-xl text-[#8d4b00]">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={loading || selectedItems.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#8d4b00] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#4d2a00] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#feb316] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Lanjut Pembayaran QRIS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#554336] text-center leading-relaxed">
                  Setelah submit, Anda akan mendapatkan kode tiket dan kode QRIS untuk menyelesaikan pembayaran secara instan.
                </p>
              </div>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}

