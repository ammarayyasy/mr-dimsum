"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NewsArticle } from "@/types/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface DisplayArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  author: string;
}

export default function AllNewsPage() {
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPost, setSelectedPost] = useState<DisplayArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          const mapped: DisplayArticle[] = json.data.map((item: NewsArticle) => {
            // Deteksi kategori dari judul jika belum spesifik
            let cat = "Warta Dapur";
            const lower = item.title.toLowerCase();
            if (lower.includes("resep") || lower.includes("saus") || lower.includes("bumbu")) {
              cat = "Resep & Bumbu";
            } else if (lower.includes("cara") || lower.includes("tips") || lower.includes("kukus")) {
              cat = "Tips Memasak";
            } else if (lower.includes("promo") || lower.includes("diskon") || lower.includes("paket")) {
              cat = "Promo & Paket";
            }

            return {
              id: item.id,
              title: item.title,
              category: cat,
              date: new Date(item.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              readTime: "3 mnt",
              thumbnail: item.thumbnail_path || "/images/hero-dimsum.png",
              excerpt: item.excerpt,
              content: item.content,
              author: item.author_id || "Admin Mr Dimsum",
            };
          });
          setArticles(mapped);
        } else {
          setArticles(siteConfig.news);
        }
      })
      .catch(() => {
        setArticles(siteConfig.news);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter artikel berdasarkan query pencarian dan kategori
  const filteredArticles = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Semua",
    ...Array.from(new Set(articles.map((a) => a.category))),
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda Mr Dimsum</span>
            </Link>

            <span className="text-xs text-[#554336]">
              Menampilkan {filteredArticles.length} dari {articles.length} Warta
            </span>
          </div>

          {/* Page Hero Header */}
          <div className="bg-white rounded-3xl border border-[#ffeada] p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#feb316]/10 rounded-full blur-3xl -z-10" />
            <div className="max-w-3xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold uppercase tracking-wider self-start">
                <Newspaper className="w-3.5 h-3.5 text-[#feb316]" />
                <span>Arsip Lengkap Warta & Cerita Rasa</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4d2a00] tracking-tight leading-tight">
                Kumpulan Kabar & Catatan Dapur Jonggol
              </h1>
              <p className="text-sm sm:text-base text-[#554336] leading-relaxed mt-1">
                Kisah di balik racikan bumbu handmade, panduan mengolah dimsum di rumah, liputan kegiatan, hingga promo dan menu spesial terhangat dari Mr Dimsum.
              </p>
            </div>
          </div>

          {/* Search Bar & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d4b00]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul warta, tips, atau resep..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#ffeada] rounded-2xl text-sm text-[#4d2a00] placeholder-[#554336]/50 focus:outline-none focus:ring-2 focus:ring-[#8d4b00] shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#554336] hover:text-[#4d2a00]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#8d4b00] text-white shadow-sm"
                      : "bg-white border border-[#ffeada] text-[#554336] hover:bg-[#ffeada] hover:text-[#4d2a00]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-[#ffeada]" />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ffeada] p-16 text-center flex flex-col items-center justify-center gap-3">
              <BookOpen className="w-12 h-12 text-[#ffeada]" />
              <h2 className="font-serif text-xl font-bold text-[#4d2a00]">
                Warta tidak ditemukan
              </h2>
              <p className="text-xs sm:text-sm text-[#554336] max-w-sm">
                Tidak ada artikel yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#8d4b00] text-white text-xs font-bold hover:bg-[#4d2a00] transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((item) => (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#ffeada] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative w-full h-52 overflow-hidden bg-[#ffeada]">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#4d2a00]/90 text-white text-[11px] font-bold">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-xs text-[#554336]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#feb316]" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#feb316]" />
                          {item.readTime}
                        </span>
                      </div>

                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#4d2a00] group-hover:text-[#8d4b00] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#554336] line-clamp-3 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-0 mt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPost(item)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8d4b00] hover:text-[#4d2a00] transition-colors"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Modal Dialog for Reading Article */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-[#4d2a00]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#ffeada] shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#f5efeb] text-[#4d2a00] hover:bg-[#ffeada] transition-colors"
              aria-label="Tutup artikel"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold mb-3">
              {selectedPost.category}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00] leading-tight mb-3">
              {selectedPost.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[#554336] pb-4 mb-4 border-b border-[#ffeada]">
              <span>Oleh: {selectedPost.author}</span>
              <span>•</span>
              <span>{selectedPost.date}</span>
              <span>•</span>
              <span>{selectedPost.readTime} baca</span>
            </div>

            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden mb-6 bg-[#ffeada]">
              <Image
                src={selectedPost.thumbnail}
                alt={selectedPost.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-sm sm:text-base text-[#554336] leading-relaxed space-y-4">
              <p className="font-semibold text-[#4d2a00]">{selectedPost.excerpt}</p>
              <p className="whitespace-pre-line">{selectedPost.content}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#ffeada] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-xl bg-[#8d4b00] text-white font-bold text-xs sm:text-sm hover:bg-[#4d2a00] transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

