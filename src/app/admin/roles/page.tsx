"use client";

import { useEffect, useState } from "react";
import { Role } from "@/types/db";
import {
  ShieldCheck,
  Plus,
  Lock,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Key,
  Info,
} from "lucide-react";

const AVAILABLE_PERMISSIONS = [
  { id: "read_news", label: "Membaca Warta & Berita" },
  { id: "manage_news", label: "Kelola (CRUD) Warta Berita" },
  { id: "manage_users", label: "Kelola Pengguna Sistem" },
  { id: "manage_roles", label: "Kelola Role & Hak Akses" },
  { id: "manage_orders", label: "Kelola Pemesanan Dimsum (Step 3)" },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Tambah
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPermissions, setAddPermissions] = useState<string[]>(["read_news"]);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState("");

  // Modal Edit
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  // Modal Hapus
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/roles");
      const json = await res.json();
      if (json.success) {
        setRoles(json.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openAddModal = () => {
    setAddName("");
    setAddDescription("");
    setAddPermissions(["read_news"]);
    setAddError("");
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSubmitting(true);
    setAddError("");

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          description: addDescription,
          permissions: addPermissions,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsAddOpen(false);
        fetchRoles();
      } else {
        setAddError(json.error || "Gagal membuat role.");
      }
    } catch {
      setAddError("Koneksi gagal.");
    } finally {
      setAddSubmitting(false);
    }
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setEditDescription(role.description || "");
    const perms = Array.isArray(role.permissions)
      ? role.permissions
      : typeof role.permissions === "string"
      ? JSON.parse(role.permissions || "[]")
      : [];
    setEditPermissions(perms);
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    setEditSubmitting(true);
    setEditError("");

    try {
      const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editDescription,
          permissions: editPermissions,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEditingRole(null);
        fetchRoles();
      } else {
        setEditError(json.error || "Gagal memperbarui role.");
      }
    } catch {
      setEditError("Koneksi gagal.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/roles/${deletingRole.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeletingRole(null);
        fetchRoles();
      } else {
        alert(json.error || "Gagal menghapus role.");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus role.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const togglePermission = (
    permId: string,
    list: string[],
    setter: (val: string[]) => void
  ) => {
    if (list.includes(permId)) {
      setter(list.filter((p) => p !== permId));
    } else {
      setter([...list, permId]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffeada]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#feb316]" />
            <span>Tingkatan Hak Akses</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
            Manajemen Role & Izin
          </h1>
          <p className="text-xs sm:text-sm text-[#554336] mt-1">
            Role bawaan sistem (<code className="bg-[#ffeada] px-1 rounded font-bold">admin</code> dan <code className="bg-[#ffeada] px-1 rounded font-bold">user</code>) dilindungi demi kestabilan aplikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Role Kustom</span>
        </button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-sm text-[#554336]">
            Memuat daftar role...
          </div>
        ) : (
          roles.map((role) => {
            const isSystem = role.is_system;
            const perms = Array.isArray(role.permissions)
              ? role.permissions
              : typeof role.permissions === "string"
              ? JSON.parse(role.permissions || "[]")
              : [];

            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-[#ffeada] p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xl font-bold text-[#4d2a00]">
                        {role.name}
                      </span>
                      {isSystem ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4d2a00] text-white">
                          <Lock className="w-2.5 h-2.5 text-[#feb316]" />
                          <span>Sistem</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffeada] text-[#8d4b00]">
                          Kustom
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(role)}
                        title="Edit Role"
                        className="p-1.5 rounded-lg text-[#8d4b00] hover:bg-[#ffeada]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!isSystem && (
                        <button
                          type="button"
                          onClick={() => setDeletingRole(role)}
                          title="Hapus Role"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#554336] leading-relaxed mb-4">
                    {role.description || "Tidak ada deskripsi."}
                  </p>

                  {/* Permissions Pills */}
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8d4b00] mb-2 flex items-center gap-1">
                      <Key className="w-3 h-3 text-[#feb316]" />
                      <span>Hak Akses ({perms.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {perms.includes("all") ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          Akses Penuh (Full Administrator)
                        </span>
                      ) : perms.length === 0 ? (
                        <span className="text-xs text-[#554336] italic">
                          Tidak ada izin khusus
                        </span>
                      ) : (
                        perms.map((p: string) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-lg bg-[#fff8f5] border border-[#ffeada] text-[11px] text-[#4d2a00] font-medium"
                          >
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ffeada] text-[11px] text-[#554336] flex items-center justify-between">
                  <span>ID: {role.id}</span>
                  {isSystem && (
                    <span className="flex items-center gap-1 text-[#8d4b00]">
                      <Info className="w-3 h-3" />
                      Role bawaan tidak dapat dihapus
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tambah Role */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#ffeada] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
              <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                Tambah Role Kustom
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
                  Nama Role (Contoh: kasir, editor)
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="editor_warta"
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="Menulis dan mengedit warta harian..."
                  className="w-full px-3.5 py-2 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-2">
                  Pilih Hak Akses (Permissions)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-xs cursor-pointer hover:bg-[#ffeada]/50"
                    >
                      <input
                        type="checkbox"
                        checked={addPermissions.includes(perm.id)}
                        onChange={() =>
                          togglePermission(perm.id, addPermissions, setAddPermissions)
                        }
                        className="rounded text-[#8d4b00] focus:ring-[#8d4b00]"
                      />
                      <span className="font-medium text-[#4d2a00]">{perm.label}</span>
                    </label>
                  ))}
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
                  {addSubmitting ? "Menyimpan..." : "Simpan Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Role */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#ffeada] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
              <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                Ubah Role: {editingRole.name}
              </h2>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
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
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              {!editingRole.is_system && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-2">
                    Hak Akses (Permissions)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_PERMISSIONS.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-xs cursor-pointer hover:bg-[#ffeada]/50"
                      >
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(perm.id)}
                          onChange={() =>
                            togglePermission(perm.id, editPermissions, setEditPermissions)
                          }
                          className="rounded text-[#8d4b00] focus:ring-[#8d4b00]"
                        />
                        <span className="font-medium text-[#4d2a00]">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#ffeada] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
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

      {/* Modal Hapus Role */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="font-serif text-lg font-bold text-[#4d2a00]">
              Hapus Role?
            </h2>
            <p className="text-xs text-[#554336] mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus role <strong>&quot;{deletingRole.name}&quot;</strong>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingRole(null)}
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

