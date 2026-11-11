import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#fff1e7] border-t border-[#ffeada] text-[#554336] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#feb316] bg-white shrink-0 shadow-sm">
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} Logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-[#4d2a00]">
                  {siteConfig.name}
                </span>
                <span className="text-xs font-semibold text-[#8d4b00]">
                  {siteConfig.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#554336] max-w-sm leading-relaxed">
              {siteConfig.aboutShort} Sajian dimsum kukus dan goreng dibuat segar harian dengan 100% bahan halal berkualitas tinggi tanpa bahan pengawet.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white text-[#8d4b00] hover:bg-[#8d4b00] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white text-[#8d4b00] hover:bg-[#8d4b00] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-serif text-base font-bold text-[#4d2a00]">
              Navigasi Halaman
            </h4>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm">
              <Link href="#beranda" className="hover:text-[#8d4b00] transition-colors">
                Beranda
              </Link>
              <Link href="#tentang-kami" className="hover:text-[#8d4b00] transition-colors">
                Tentang Kami
              </Link>
              <Link href="#menu" className="hover:text-[#8d4b00] transition-colors">
                Menu Favorit
              </Link>
              <Link href="#layanan" className="hover:text-[#8d4b00] transition-colors">
                Layanan & Katering
              </Link>
              <Link href="#berita" className="hover:text-[#8d4b00] transition-colors">
                Warta Rasa
              </Link>
              <Link href="#kontak" className="hover:text-[#8d4b00] transition-colors">
                Kontak & Lokasi Peta
              </Link>
            </nav>
          </div>

          {/* Operating hours & Location */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h4 className="font-serif text-base font-bold text-[#4d2a00]">
              Dapur & Operasional Jonggol
            </h4>
            <p className="text-xs sm:text-sm text-[#554336] leading-relaxed">
              {siteConfig.location.address}
            </p>
            <div className="p-3.5 rounded-xl bg-white/80 border border-[#ffeada] flex flex-col gap-1 mt-1">
              <span className="text-[11px] font-bold uppercase text-[#8d4b00]">
                Jam Buka Setiap Hari
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#4d2a00]">
                {siteConfig.contact.hours}
              </p>
              <span className="text-[11px] text-[#554336]">
                Kukusan klakat hangat selalu ready
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#ffeada] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#554336]">
          <p>
            © 2026 {siteConfig.name}. Hak Cipta Dilindungi.
          </p>
          <p className="flex items-center gap-1 font-medium">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>untuk Warga Jonggol</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
