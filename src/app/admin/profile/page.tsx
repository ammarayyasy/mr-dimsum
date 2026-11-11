"use client";

import { useState, useEffect } from "react";
import {
  KeyRound,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  User as UserIcon,
  Mail,
  Lock,
} from "lucide-react";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

export default function AdminProfilePage() {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMessage("Kata sandi berhasil diperbarui dengan aman.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(json.error || "Gagal memperbarui kata sandi.");
      }
    } catch {
      setErrorMessage("Koneksi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#ffeada]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-2">
          <KeyRound className="w-3.5 h-3.5 text-[#feb316]" />
          <span>Keamanan Akun</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
          Profil & Ganti Kata Sandi
        </h1>
        <p className="text-xs sm:text-sm text-[#554336] mt-1">
          Kelola kredensial akun administrator Anda untuk menjaga keamanan website Mr Dimsum.
        </p>
      </div>

      {/* Security Warning Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs leading-relaxed">
          <span className="font-bold text-amber-950">
            Penting: Amankan Akun Sebelum Peluncuran (Deploy Vercel)
          </span>
          <p className="text-amber-800">
            Akun admin awal dibuat dengan kombinasi publik (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">admin@gmail.com</code> / sandi: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">123456</code>). Sangat disarankan mengganti kata sandi dengan kombinasi yang kuat dan unik sekarang juga.
          </p>
        </div>
      </div>

      {/* Profile Info Card */}
      {user && (
        <div className="bg-white rounded-2xl border border-[#ffeada] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold text-lg flex items-center justify-center shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#4d2a00] flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-[#8d4b00]" />
                {user.name}
              </span>
              <span className="text-xs text-[#554336] flex items-center gap-2 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#8d4b00]" />
                {user.email}
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#4d2a00] text-white">
            Peran: {user.roleName}
          </span>
        </div>
      )}

      {/* Change Password Form Card */}
      <div className="bg-white rounded-3xl border border-[#ffeada] p-6 sm:p-8 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-[#4d2a00] mb-4">
          Perbarui Kata Sandi Administrator
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d4b00]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama (misal: 123456)"
                className="w-full pl-9 pr-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
              Kata Sandi Baru (Min. 6 Karakter)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d4b00]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kata sandi baru yang aman"
                className="w-full pl-9 pr-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
              Ulangi Kata Sandi Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d4b00]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-9 pr-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#ffeada] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Menyimpan..." : "Perbarui Kata Sandi"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

