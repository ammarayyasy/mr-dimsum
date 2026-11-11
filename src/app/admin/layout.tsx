"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  LayoutDashboard,
  ShoppingBag,
  Newspaper,
  Users,
  ShieldCheck,
  KeyRound,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Database,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [dbStatus, setDbStatus] = useState<string>("Memeriksa database...");
  const [isGAS, setIsGAS] = useState<boolean>(false);

  useEffect(() => {
    // Ambil info session admin
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          router.push("/login?callbackUrl=" + pathname);
        }
      })
      .catch(() => router.push("/login"));

    // Ambil status sistem
    fetch("/api/admin/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDbStatus(data.databaseName);
          setIsGAS(data.databaseMode === "google_spreadsheet");
        }
      })
      .catch(() => setDbStatus("Simulasi Lokal"));
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Ringkasan", href: "/admin", icon: LayoutDashboard },
    { label: "Pesanan Masuk", href: "/admin/orders", icon: ShoppingBag },
    { label: "Warta & Berita", href: "/admin/news", icon: Newspaper },
    { label: "Manajemen Pengguna", href: "/admin/users", icon: Users },
    { label: "Manajemen Role", href: "/admin/roles", icon: ShieldCheck },
    { label: "Ganti Kata Sandi", href: "/admin/profile", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-[#ffeada] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#feb316]">
            <Image src={siteConfig.logo} alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-serif font-bold text-base text-[#4d2a00]">
            Admin {siteConfig.name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#fff8f5] text-[#4d2a00] hover:bg-[#ffeada]"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#ffeada] p-5 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#feb316] shadow-sm">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-[#4d2a00] leading-none">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] font-bold text-[#8d4b00] uppercase tracking-wider mt-1">
                  Dashboard Pengrajin
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#554336] hover:bg-[#ffeada]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Status Card */}
          <div
            className={`p-3 rounded-2xl border text-xs flex flex-col gap-1.5 ${
              isGAS
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>Status Database</span>
            </div>
            <p className="text-[11px] leading-snug">{dbStatus}</p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Menu Admin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#8d4b00] text-white shadow-sm"
                      : "text-[#554336] hover:bg-[#ffeada]/60 hover:text-[#4d2a00]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#feb316]" : "text-[#8d4b00]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#ffeada] flex flex-col gap-3">
          {currentUser && (
            <div className="px-2 py-1 flex flex-col">
              <span className="text-xs font-bold text-[#4d2a00] truncate">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-[#554336] truncate">
                {currentUser.email}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors"
            >
              <span>Lihat Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}

