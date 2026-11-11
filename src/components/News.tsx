"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NewsArticle } from "@/types/db";
import { Newspaper, Calendar, Clock, ArrowRight, X, Sparkles, BookOpen } from "lucide-react";

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

export default function News() {
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [selectedPost, setSelectedPost] = useState<DisplayArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          const mapped: DisplayArticle[] = json.data.map((item: NewsArticle) => ({
            id: item.id,
            title: item.title,
            category: "Warta Dapur",
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
          }));
          setArticles(mapped);
        } else {
          // Fallback ke siteConfig
          setArticles(siteConfig.news);
        }
      })
      .catch(() => {
        setArticles(siteConfig.news);
      })
      .finally(() => setLoading(false));
  }, []);

  // Hanya tampilkan 3 berita paling terbaru di landing page
  const latestArticles = articles.slice(0, 3);

  return (
    <section id="berita" className="py-20 sm:py-28 bg-[#fdfbf7] border-y border-[#ffeada]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5 text-[#feb316]" />
              <span>Warta & Cerita Rasa</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4d2a00] tracking-tight">
              Kabar Terbaru Dapur Jonggol
            </h2>
            <p className="text-sm sm:text-base text-[#554336] mt-2">
              Cerita di balik racikan bumbu, tips mengolah dimsum di rumah, hingga promo dan menu spesial terhangat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8d4b00] hover:text-[#4d2a00] bg-white border border-[#ffeada] px-4 py-2 rounded-full shadow-sm hover:shadow transition-all group"
            >
              <BookOpen className="w-4 h-4 text-[#feb316]" />
              <span>Semua Berita ({articles.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 Latest Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-[#ffeada]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((item) => (
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

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#4d2a00] group-hover:text-[#8d4b00] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

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

        {/* Tombol Lihat Berita Lebih Banyak / Semua Berita */}
        <div className="flex flex-col sm:flex-row items-center justify-center pt-4">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#8d4b00] text-white font-bold text-sm tracking-wide hover:bg-[#4d2a00] shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <span>Lihat Semua Berita ({articles.length} Artikel)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>

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

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00] leading-tight mb-3">
              {selectedPost.title}
            </h3>

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
    </section>
  );
}
