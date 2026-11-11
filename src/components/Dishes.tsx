"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, DishItem } from "@/config/site";
import { Star, ShoppingBag, Flame, Sparkles } from "lucide-react";

export default function Dishes() {
  const [filter, setFilter] = useState<"Semua" | "Kukus" | "Goreng">("Semua");

  const filteredDishes =
    filter === "Semua"
      ? siteConfig.featuredDishes
      : siteConfig.featuredDishes.filter((d) => d.category === filter);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#fdfbf7] border-y border-[#ffeada]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#feb316]" />
              <span>Pilihan Favorit Warga Jonggol</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4d2a00] tracking-tight">
              Cita Rasa Juara Paling Dicari
            </h2>
            <p className="text-sm sm:text-base text-[#554336] mt-2">
              Koleksi dimsum buatan tangan yang paling sering dipesan dan dicari. Selalu dikukus dan digoreng segar langsung sesuai pesanan Anda.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#fff1e7] p-1.5 rounded-full border border-[#ffeada] self-start md:self-auto">
            {(["Semua", "Kukus", "Goreng"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  filter === tab
                    ? "bg-[#8d4b00] text-white shadow-sm"
                    : "text-[#554336] hover:text-[#4d2a00] hover:bg-white/60"
                }`}
              >
                {tab === "Semua" ? "Semua Varian" : `${tab} Hangat`}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#ffeada] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image container */}
                <div className="relative w-full h-52 sm:h-56 bg-[#ffeada] overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {dish.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#4d2a00]/90 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide">
                      {dish.badge}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[#4d2a00] text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#feb316] text-[#feb316]" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-[#554336]">
                    <span className="font-semibold text-[#8d4b00]">{dish.portion}</span>
                    <span className="px-2 py-0.5 rounded bg-[#fff1e7] text-[11px] font-medium text-[#4d2a00]">
                      {dish.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#4d2a00] group-hover:text-[#8d4b00] transition-colors line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-[#554336] line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0 mt-2 border-t border-[#f5efeb] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#554336]">Harga mulai</span>
                  <span className="font-serif text-lg font-bold text-[#8d4b00]">
                    {formatRupiah(dish.price)}
                  </span>
                </div>
                <Link
                  href="/pesanan/buat"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8d4b00] text-white hover:bg-[#4d2a00] text-xs font-bold transition-colors shadow-sm"
                  title="Pesan Online dengan QRIS"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pesan</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#ffeada] to-[#fff1e7] border border-[#ffdcbe] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#feb316] text-[#4d2a00] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#4d2a00]">
                Ingin Pesan Varian Campur atau Partai Besar?
              </h4>
              <p className="text-xs sm:text-sm text-[#554336]">
                Tersedia paket pesta & klakat tampah untuk arisan, rapat, dan hajatan di Jonggol.
              </p>
            </div>
          </div>
          <a
            href={siteConfig.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#4d2a00] hover:bg-[#8d4b00] text-white text-xs sm:text-sm font-bold shrink-0 transition-colors shadow-sm"
          >
            Konsultasi Paket WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}

