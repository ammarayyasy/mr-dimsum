"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Newspaper,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Database,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalOrders?: number;
  pendingOrders?: number;
  confirmedOrders?: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [databaseMode, setDatabaseMode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setDatabaseMode(data.databaseMode);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ffeada]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#feb316]" />
            <span>Step 2 - Manajemen Pengguna & Dashboard</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
            Pusat Kendali Mr Dimsum
          </h1>
          <p className="text-sm text-[#554336] mt-1">
            Kelola warta kabar terbaru, pengguna terdaftar, serta hak akses dalam satu tempat.
          </p>
        </div>

        <Link
          href="/admin/news"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] shadow-sm transition-all self-start sm:self-auto"
        >
          <Newspaper className="w-4 h-4" />
          <span>Tulis Warta Baru</span>
        </Link>
      </div>

      {/* Database Setup Notice if in local fallback */}
      {databaseMode === "local_dev_fallback" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold">Mode Simulasi Lokal Aktif</h2>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Aplikasi saat ini berjalan memakai basis data cadangan lokal. Untuk menyambungkan ke Google Spreadsheet nyata, ikuti panduan di file <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">documentation/SETUP.md</code>.
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-bold text-amber-800 underline">
            SETUP.md Tersedia
          </span>
        </div>
      )}

      {/* Security Warning Notice regarding default admin password */}
      <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 flex items-start gap-3 text-xs leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Pengingat Keamanan Akun:</span> Anda menggunakan kredensial admin awal (<code className="bg-orange-100 px-1 rounded">admin@gmail.com</code> / <code className="bg-orange-100 px-1 rounded">123456</code>). Disarankan untuk mengganti kata sandi di menu <strong>Ganti Kata Sandi</strong> sebelum situs dipublikasikan ke production.
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Orders Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#ffeada] shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#554336]">
              Pesanan Masuk (QRIS)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ffeada] text-[#8d4b00] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#4d2a00]">
              {loading ? "-" : stats?.totalOrders ?? 0}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#554336] mt-2">
              <span className="text-amber-700 font-semibold">
                {stats?.pendingOrders ?? 0} Menunggu
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">
                {stats?.confirmedOrders ?? 0} Selesai
              </span>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] pt-2 border-t border-[#ffeada]"
          >
            <span>Buka Manajemen Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* News Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#ffeada] shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#554336]">
              Total Warta & Berita
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ffeada] text-[#8d4b00] flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#4d2a00]">
              {loading ? "-" : stats?.totalNews ?? 0}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#554336] mt-2">
              <span className="text-emerald-700 font-semibold">
                {stats?.publishedNews ?? 0} Tayang
              </span>
              <span>•</span>
              <span className="text-amber-700 font-semibold">
                {stats?.draftNews ?? 0} Konsep (Draft)
              </span>
            </div>
          </div>
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] pt-2 border-t border-[#ffeada]"
          >
            <span>Buka Manajemen Berita</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#ffeada] shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#554336]">
              Pengguna Terdaftar
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ffeada] text-[#8d4b00] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#4d2a00]">
              {loading ? "-" : stats?.totalUsers ?? 0}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#554336] mt-2">
              <span className="text-emerald-700 font-semibold">
                {stats?.activeUsers ?? 0} Aktif
              </span>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] pt-2 border-t border-[#ffeada]"
          >
            <span>Buka Manajemen Pengguna</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Roles Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#ffeada] shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#554336]">
              Tingkatan Hak Akses (Role)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ffeada] text-[#8d4b00] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#4d2a00]">
              {loading ? "-" : stats?.totalRoles ?? 0}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#554336] mt-2">
              <span className="font-semibold text-[#8d4b00]">admin & user</span>
            </div>
          </div>
          <Link
            href="/admin/roles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] pt-2 border-t border-[#ffeada]"
          >
            <span>Buka Manajemen Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Action Guides */}
      <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 flex flex-col gap-6">
        <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
          Pintasan Alur Kerja Pengrajin
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[#fff8f5] border border-[#ffeada] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4d2a00]">
              <FileCheck className="w-4 h-4 text-[#8d4b00]" />
              <span>1. Tulis Cerita Baru</span>
            </div>
            <p className="text-xs text-[#554336] leading-relaxed">
              Unggah foto sajian dimsum dan tuliskan artikel tentang tips atau promo. Artikel yang berstatus &quot;published&quot; otomatis tampil di landing page.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fff8f5] border border-[#ffeada] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4d2a00]">
              <Users className="w-4 h-4 text-[#8d4b00]" />
              <span>2. Atur Pelanggan & Kasir</span>
            </div>
            <p className="text-xs text-[#554336] leading-relaxed">
              Ubah peran pengguna menjadi admin tambahan atau nonaktifkan akun yang melanggar. Akun admin dilindungi dari penghapusan mandiri.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fff8f5] border border-[#ffeada] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4d2a00]">
              <Database className="w-4 h-4 text-[#8d4b00]" />
              <span>3. Basis Data Spreadsheet</span>
            </div>
            <p className="text-xs text-[#554336] leading-relaxed">
              Seluruh data terpusat di Google Spreadsheet yang dapat dilihat langsung oleh tim Anda tanpa software database yang rumit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

