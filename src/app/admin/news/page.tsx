"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { NewsArticle } from "@/types/db";
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  // State Modal Form (Create / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // State Modal Konfirmasi Hapus
  const [deletingArticle, setDeletingArticle] = useState<NewsArticle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State Modal Preview
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/news");
      const json = await res.json();
      if (json.success) {
        setArticles(json.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat artikel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormContent("");
    setFormThumbnail("/images/hero-dimsum.png");
    setFormStatus("published");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormExcerpt(article.excerpt);
    setFormContent(article.content);
    setFormThumbnail(article.thumbnail_path || "/images/hero-dimsum.png");
    setFormStatus(article.status);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setFormThumbnail(json.url);
      } else {
        setFormError(json.error || "Gagal mengunggah foto.");
      }
    } catch {
      setFormError("Gagal menghubungi server upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      setFormError("Judul dan konten berita wajib diisi.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title: formTitle,
        excerpt: formExcerpt || formContent.slice(0, 140),
        content: formContent,
        thumbnail_path: formThumbnail,
        status: formStatus,
      };

      let res;
      if (editingArticle) {
        res = await fetch(`/api/admin/news/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (json.success) {
        setIsFormOpen(false);
        loadArticles();
      } else {
        setFormError(json.error || "Gagal menyimpan warta.");
      }
    } catch {
      setFormError("Gagal menghubungi server.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingArticle) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/news/${deletingArticle.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeletingArticle(null);
        loadArticles();
      } else {
        alert(json.error || "Gagal menghapus warta.");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus warta.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredArticles = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ffeada]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-2">
            <Newspaper className="w-3.5 h-3.5 text-[#feb316]" />
            <span>Kabar & Artikel Kuliner</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">
            Manajemen Warta Berita
          </h1>
          <p className="text-xs sm:text-sm text-[#554336] mt-1">
            Artikel yang dipublikasikan akan langsung muncul di section &quot;Warta & Cerita Rasa&quot; pada landing page.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Warta Baru</span>
        </button>
      </div>

      {/* Controls: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d4b00]" />
          <input
            type="text"
            placeholder="Cari judul atau isi berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] placeholder-[#554336]/50 focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === "all"
                ? "bg-[#8d4b00] text-white"
                : "bg-white border border-[#ffeada] text-[#554336] hover:bg-[#ffeada]"
            }`}
          >
            Semua ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("published")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === "published"
                ? "bg-emerald-700 text-white"
                : "bg-white border border-[#ffeada] text-[#554336] hover:bg-[#ffeada]"
            }`}
          >
            Tayang ({articles.filter((a) => a.status === "published").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("draft")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === "draft"
                ? "bg-amber-700 text-white"
                : "bg-white border border-[#ffeada] text-[#554336] hover:bg-[#ffeada]"
            }`}
          >
            Draft ({articles.filter((a) => a.status === "draft").length})
          </button>
        </div>
      </div>

      {/* Table & List */}
      <div className="bg-white rounded-2xl border border-[#ffeada] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-sm text-[#554336]">
            <div className="w-8 h-8 border-3 border-[#8d4b00]/30 border-t-[#8d4b00] rounded-full animate-spin" />
            <span>Memuat warta dari database...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <Newspaper className="w-12 h-12 text-[#ffeada]" />
            <h2 className="font-serif text-lg font-bold text-[#4d2a00]">Belum ada warta</h2>
            <p className="text-xs text-[#554336] max-w-sm">
              {searchQuery
                ? "Tidak ada artikel yang cocok dengan pencarian Anda."
                : "Mulai tuliskan kabar kuliner, tips memasak, atau promo Mr Dimsum pertama Anda."}
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#4d2a00]"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Warta Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fff8f5] border-b border-[#ffeada] text-[11px] font-bold uppercase tracking-wider text-[#554336]">
                  <th className="py-3 px-4">Warta / Artikel</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffeada] text-xs">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#fffdfb] transition-colors">
                    {/* Title & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-12 rounded-lg overflow-hidden border border-[#ffeada] shrink-0 bg-[#ffeada]">
                          <Image
                            src={article.thumbnail_path || "/images/hero-dimsum.png"}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col max-w-md">
                          <span className="font-bold text-[#4d2a00] line-clamp-1 hover:text-[#8d4b00] transition-colors">
                            {article.title}
                          </span>
                          <span className="text-[11px] text-[#554336] line-clamp-1 mt-0.5">
                            {article.excerpt}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-4 text-[#554336] whitespace-nowrap">
                      {article.author_id || "Admin Mr Dimsum"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          article.status === "published"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {article.status === "published" ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Tayang</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Draft</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#554336] whitespace-nowrap">
                      {new Date(article.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewArticle(article)}
                          title="Lihat Pratinjau"
                          className="p-1.5 rounded-lg text-[#554336] hover:bg-[#ffeada] hover:text-[#4d2a00]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(article)}
                          title="Edit Berita"
                          className="p-1.5 rounded-lg text-[#8d4b00] hover:bg-[#ffeada]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingArticle(article)}
                          title="Hapus Berita"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#ffeada] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffeada]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#feb316]" />
                <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                  {editingArticle ? "Ubah Warta Berita" : "Tulis Warta Baru"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-[#554336] hover:bg-[#ffeada]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Judul Warta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahasia Racikan Adonan Dimsum Artisan..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-4 py-2 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Isi Warta Lengkap
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan cerita lengkap..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] focus:ring-2 focus:ring-[#8d4b00] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Upload Foto Thumbnail */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Foto Thumbnail / Sampul
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#fff8f5] border border-[#ffeada]">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-[#ffeada] shrink-0 bg-[#ffeada]">
                    <Image
                      src={formThumbnail || "/images/hero-dimsum.png"}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-xs text-[#554336]">
                      File disimpan di folder lokal <code className="bg-[#ffeada] px-1 rounded text-[#4d2a00]">public/uploads/</code> (JPG, PNG, WEBP max 5MB).
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#ffeada] text-[#8d4b00] text-xs font-bold hover:bg-[#ffeada] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? "Mengunggah..." : "Pilih File Foto"}</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d2a00] mb-1.5">
                  Status Publikasi
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
                  className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-[#ffeada] rounded-xl text-xs sm:text-sm text-[#4d2a00] font-semibold focus:ring-2 focus:ring-[#8d4b00] focus:outline-none"
                >
                  <option value="published">Tayang (Published) - Langsung tampil di Landing Page</option>
                  <option value="draft">Konsep (Draft) - Hanya tersimpan di dashboard</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#ffeada] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#554336] hover:bg-[#ffeada]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || uploadingImage}
                  className="px-5 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4d2a00] disabled:opacity-50"
                >
                  {formSubmitting ? "Menyimpan..." : editingArticle ? "Simpan Perubahan" : "Terbitkan Warta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingArticle && (
        <div className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#4d2a00]">
              Hapus Warta Berita?
            </h2>
            <p className="text-xs text-[#554336] mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus artikel <strong>&quot;{deletingArticle.title}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingArticle(null)}
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

      {/* Modal Preview */}
      {previewArticle && (
        <div
          className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#ffeada] shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f5efeb] text-[#4d2a00] hover:bg-[#ffeada]"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-3">
              {previewArticle.status === "published" ? "Tayang di Web" : "Status Konsep"}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00] leading-tight mb-2">
              {previewArticle.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[#554336] pb-4 mb-4 border-b border-[#ffeada]">
              <span>Oleh: {previewArticle.author_id}</span>
              <span>•</span>
              <span>
                {new Date(previewArticle.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-[#ffeada]">
              <Image
                src={previewArticle.thumbnail_path || "/images/hero-dimsum.png"}
                alt={previewArticle.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-sm text-[#554336] leading-relaxed space-y-4">
              <p className="font-medium text-[#4d2a00]">{previewArticle.excerpt}</p>
              <p className="whitespace-pre-line">{previewArticle.content}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

