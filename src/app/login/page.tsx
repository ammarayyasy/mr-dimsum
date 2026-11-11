"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
        setLoading(false);
        return;
      }

      // Berhasil login
      if (data.user.roleName === "admin") {
        router.push(callbackUrl);
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setErrorMessage("Koneksi gagal. Pastikan jaringan internet Anda aktif.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-[#ffeada] rounded-3xl relative">
      
      {/* Logo & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#feb316] shadow-sm mb-3">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
          Masuk ke Akun
        </h1>
        <p className="text-xs sm:text-sm text-[#554336] mt-1">
          Portal Pengrajin & Pelanggan {siteConfig.name} Jonggol
        </p>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8d4b00]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-sm text-[#4d2a00] placeholder-[#554336]/40 focus:outline-none focus:ring-2 focus:ring-[#8d4b00] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8d4b00]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-sm text-[#4d2a00] placeholder-[#554336]/40 focus:outline-none focus:ring-2 focus:ring-[#8d4b00] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#554336] hover:text-[#4d2a00]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#8d4b00] text-white font-bold text-sm tracking-wide hover:bg-[#4d2a00] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#feb316] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Register Link */}
      <div className="mt-6 pt-5 border-t border-[#ffeada] text-center text-xs text-[#554336]">
        <span>Belum memiliki akun? </span>
        <Link
          href="/register"
          className="font-bold text-[#8d4b00] hover:text-[#4d2a00] underline"
        >
          Daftar sebagai Pelanggan
        </Link>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#feb316]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8d4b00]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Back to Home Button */}
      <div className="max-w-md w-full mx-auto px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda Mr Dimsum</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 rounded-3xl border border-[#ffeada] text-center text-sm text-[#554336]">
              Memuat formulir masuk...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
