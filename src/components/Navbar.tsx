"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, ArrowUpRight, User, ShieldCheck, LogOut, LogIn, Ticket } from "lucide-react";

interface CurrentAuth {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentAuth | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const baseNavLinks = [
    { label: "Beranda", href: "/#beranda" },
    { label: "Tentang Kami", href: "/#tentang-kami" },
    { label: "Menu Favorit", href: "/#menu" },
    { label: "Layanan", href: "/#layanan" },
    { label: "Warta Rasa", href: "/berita" },
    { label: "Kontak & Peta", href: "/#kontak" },
  ];

  const navLinks = currentUser
    ? [
        ...baseNavLinks.slice(0, 4),
        { label: "Pesanan Saya", href: "/pesanan" },
        ...baseNavLinks.slice(4),
      ]
    : baseNavLinks;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#ffeada]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#8d4b00] rounded-lg p-1"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#feb316] shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} Logo`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#4d2a00] leading-none tracking-tight group-hover:text-[#8d4b00] transition-colors">
              {siteConfig.name}
            </span>
            <span className="text-[11px] font-semibold text-[#8d4b00] uppercase tracking-wider mt-1">
              Jonggol • Artisan Homemade
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="Navigasi Utama"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-[#554336] hover:text-[#8d4b00] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#8d4b00] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/pesanan/buat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8d4b00] text-white hover:bg-[#4d2a00] shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Pesan Sekarang</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* User Auth State Action */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Tombol Khusus: Pesanan Saya (Cek Status) */}
              <Link
                href="/pesanan"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#8d4b00] text-xs font-bold transition-all shadow-xs"
                title="Lihat status tiket pesanan saya"
              >
                <Ticket className="w-3.5 h-3.5 text-[#8d4b00]" />
                <span>Pesanan Saya</span>
              </Link>

              {currentUser.roleName === "admin" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4d2a00] text-white text-xs font-bold hover:bg-[#8d4b00] transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#feb316]" />
                  <span>Dashboard Admin</span>
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffeada] text-[#4d2a00] text-xs font-bold">
                  <User className="w-3.5 h-3.5 text-[#8d4b00]" />
                  <span>{currentUser.name.split(" ")[0]}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                title="Keluar"
                className="w-8 h-8 rounded-full bg-[#ffeada]/60 text-red-700 flex items-center justify-center hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold hover:bg-[#feb316] hover:text-[#4d2a00] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#ffeada]/70 text-[#4d2a00] hover:bg-[#ffeada] focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fff8f5] border-b border-[#ffeada] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-[#4d2a00] hover:bg-[#ffeada] hover:text-[#8d4b00] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-[#ffeada] flex flex-col gap-2.5">
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  {/* Tombol Pesanan Saya di Menu Mobile */}
                  <Link
                    href="/pesanan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[#8d4b00] font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-[#8d4b00]" />
                    <span>Pesanan Saya (Cek Status)</span>
                  </Link>

                  {currentUser.roleName === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4d2a00] text-white font-bold text-xs uppercase tracking-wider"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#feb316]" />
                      <span>Buka Dashboard Admin</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 text-red-700 font-bold text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar ({currentUser.name})</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ffeada] text-[#8d4b00] font-bold text-xs uppercase tracking-wider hover:bg-[#feb316] hover:text-[#4d2a00]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk / Akun</span>
                </Link>
              )}

              <Link
                href="/pesanan/buat"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8d4b00] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:bg-[#4d2a00]"
              >
                <span>Pesan Dimsum Sekarang</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
