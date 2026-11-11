"use client";

import { useEffect, useState } from "react";
import { Role } from "@/types/db";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Lock,
} from "lucide-react";

interface EnrichedUser {
  id: string;
  name: string;
  email: string;
  role_id: string;
  roleName: string;
  status: "active" | "inactive";
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // State Modal Tambah
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRoleId, setAddRoleId] = useState("role-user");
  const [addStatus, setAddStatus] = useState<"active" | "inactive">("active");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState("");

  // State Modal Edit
  const [editingUser, setEditingUser] = useState<EnrichedUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [editPassword, setEditPassword] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  // State Modal Hapus
  const [deletingUser, setDeletingUser] = useState<EnrichedUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, meRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
        fetch("/api/auth/me"),
      ]);

      const [usersData, rolesData, meData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
        meRes.json(),
      ]);

      if (usersData.success) setUsers(usersData.data || []);
      if (rolesData.success) setRoles(rolesData.data || []);
      if (meData.authenticated && meData.user) setCurrentUserId(meData.user.id);
    } catch (err) {
      console.error("Gagal memuat pengguna:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setAddName("");
    setAddEmail("");
    setAddPassword("");
    setAddRoleId(roles.find((r) => r.name === "user")?.id || "role-user");
    setAddStatus("active");
    setAddError("");
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSubmitting(true);
    setAddError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          email: addEmail,
          password: addPassword,
          role_id: addRoleId,
          status: addStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsAddOpen(false);
        fetchData();
      } else {
        setAddError(json.error || "Gagal menambahkan pengguna.");
      }
    } catch {
      setAddError("Koneksi gagal.");
    } finally {
      setAddSubmitting(false);
    }
  };

  const openEditModal = (user: EnrichedUser) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRoleId(user.role_id);
    setEditStatus(user.status);
    setEditPassword("");
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditSubmitting(true);
    setEditError("");

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          role_id: editRoleId,
          status: editStatus,
          password: editPassword || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEditingUser(null);
        fetchData();
      } else {
        setEditError(json.error || "Gagal memperbarui pengguna.");
      }
    } catch {
      setEditError("Koneksi gagal.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeletingUser(null);
        fetchData();
      } else {
        alert(json.error || "Gagal menghapus pengguna.");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role_id === filterRole || u.roleName === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffeada]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-[#feb316]" />
            <span>Manajemen Akses & Pelanggan</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
            Daftar Pengguna Sistem
          </h1>
          <p className="text-xs sm:text-sm text-[#554336] mt-1">
            Pantau akun pelanggan terdaftar serta tim pengelola Mr Dimsum Jonggol.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] shadow-sm transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d4b00]" />
          <input
            type="text"
            placeholder="Cari nama atau email pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] placeholder-[#554336]/50 focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-white border border-[#ffeada] rounded-xl text-xs font-semibold text-[#4d2a00] focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
          >
            <option value="all">Semua Peran (Role)</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#ffeada] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-[#554336]">
            <div className="w-8 h-8 border-3 border-[#8d4b00]/30 border-t-[#8d4b00] rounded-full animate-spin" />
            <span>Memuat data pengguna...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#554336]">
            Tidak ada pengguna yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff8f5] border-b border-[#ffeada] text-[11px] font-bold uppercase tracking-wider text-[#554336]">
                  <th className="py-3 px-4">Nama Lengkap & Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Bergabung</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffeada] text-xs">
                {filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-[#fffdfb] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#ffeada] text-[#8d4b00] font-bold flex items-center justify-center text-xs uppercase shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#4d2a00]">{user.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#8d4b00] text-white">
                                  Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#554336]">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.roleName === "admin"
                              ? "bg-[#4d2a00] text-white"
                              : "bg-[#ffeada] text-[#8d4b00]"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3 text-[#feb316]" />
                          <span>{user.roleName}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {user.status === "active" ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-red-600" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#554336] whitespace-nowrap">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            title="Edit Pengguna"
                            className="p-1.5 rounded-lg text-[#8d4b00] hover:bg-[#ffeada]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isCurrent}
                            onClick={() => setDeletingUser(user)}
                            title={isCurrent ? "Tidak dapat menghapus akun sendiri" : "Hapus Pengguna"}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Modal Tambah Pengguna */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#ffeada] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
              <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                Tambah Pengguna Baru
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-[#554336] hover:bg-[#ffeada]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Nama anggota"
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="anggota@email.com"
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Kata Sandi Awal (Min 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                    Peran (Role)
                  </label>
                  <select
                    value={addRoleId}
                    onChange={(e) => setAddRoleId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs font-semibold text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                    Status Akun
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as "active" | "inactive")}
                    className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs font-semibold text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#ffeada] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#554336] hover:bg-[#ffeada]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] disabled:opacity-50"
                >
                  {addSubmitting ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#ffeada] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
              <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                Ubah Pengguna
              </h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-[#554336] hover:bg-[#ffeada]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Email (Permanen)
                </label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email}
                  className="w-full px-3.5 py-2 bg-[#eae3dc]/50 border border-[#ffeada] rounded-xl text-xs text-[#554336] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                    Peran (Role)
                  </label>
                  <select
                    value={editRoleId}
                    onChange={(e) => setEditRoleId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs font-semibold text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                    Status Akun
                  </label>
                  <select
                    value={editStatus}
                    disabled={editingUser.id === currentUserId}
                    onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                    className="w-full px-3 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs font-semibold text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none disabled:opacity-50"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Reset Sandi (Kosongkan jika tidak diubah)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8d4b00]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Sandi baru..."
                    className="w-full pl-9 pr-4 py-2 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#ffeada] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#554336] hover:bg-[#ffeada]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] disabled:opacity-50"
                >
                  {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Pengguna */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#4d2a00]">
              Hapus Pengguna?
            </h2>
            <p className="text-xs text-[#554336] mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>&quot;{deletingUser.name}&quot; ({deletingUser.email})</strong>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#554336] hover:bg-[#ffeada]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? "Menghapus..." : "Ya, Hapus Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

