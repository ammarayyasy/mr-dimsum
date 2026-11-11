import Image from "next/image";
import { siteConfig } from "@/config/site";
import { ArrowRight, Star, Sparkles, MessageCircle, Clock, ShieldCheck, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#fff8f5] via-[#fdfbf7] to-[#f5efeb]"
    >
      {/* Warm Ambient Glows */}
      <div className="absolute top-10 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#feb316]/20 blur-3xl pointer-events-none -mr-20" />
      <div className="absolute bottom-10 left-0 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#8d4b00]/10 blur-3xl pointer-events-none -ml-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 text-left">
            {/* Halal & Fresh Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffeada] border border-[#ffdcbe] text-[#4d2a00] shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#feb316] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8d4b00]">
                ✨ 100% Halal & Fresh Handmade Jonggol
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#4d2a00] leading-[1.15] tracking-tight">
              Cita Rasa Autentik <br className="hidden sm:inline" />
              <span className="italic text-[#8d4b00]">Dimsum Artisan</span>, <br className="hidden sm:inline" />
              Buatan Tangan Setiap Hari
            </h1>

            {/* Subheadline / Tagline */}
            <p className="text-base sm:text-lg text-[#554336] max-w-xl leading-relaxed">
              {siteConfig.aboutShort} Menghadirkan kelembutan kulit tipis berpadu isian udang dan ayam pilihan yang gurih, juicy, serta bebas dari bahan pengawet.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#8d4b00] hover:bg-[#4d2a00] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Jelajahi Menu Favorit</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#ffeada] text-[#4d2a00] border border-[#ffdcbe] font-bold text-sm sm:text-base shadow-sm transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 text-[#8d4b00]" />
                <span>Pesan Cepat via WhatsApp</span>
              </a>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-2 border-t border-[#ffeada] w-full max-w-lg">
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">08:00</span>
                <span className="text-xs sm:text-sm text-[#554336]">Kukusan Pertama</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8d4b00]">100%</span>
                <span className="text-xs sm:text-sm text-[#554336]">Halal & Alami</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4d2a00]">0%</span>
                <span className="text-xs sm:text-sm text-[#554336]">Bahan Pengawet</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="relative rounded-3xl p-3 bg-white/70 backdrop-blur-md shadow-2xl border border-[#ffeada]">
                <div className="relative w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#ffeada]">
                  <Image
                    src={siteConfig.heroImage}
                    alt="Mr Dimsum - Sajian Dimsum Artisan Jonggol"
                    fill
                    className="object-cover transform hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4d2a00]/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Card: Rating */}
              <div className="absolute -top-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#ffeada] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#feb316] text-[#4d2a00] flex items-center justify-center font-bold shadow-sm">
                  <Star className="w-5 h-5 fill-[#4d2a00]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-[#4d2a00]">4.9 / 5.0</span>
                  </div>
                  <span className="text-xs text-[#554336]">Kepuasan Warga Jonggol</span>
                </div>
              </div>

              {/* Floating Card: Fresh Daily */}
              <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#ffeada] flex items-center gap-3 max-w-[260px]">
                <div className="w-10 h-10 rounded-full bg-[#ffeada] text-[#8d4b00] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-[#8d4b00]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4d2a00] leading-tight">
                    "Sekali Coba, Pengen Lagi!"
                  </p>
                  <span className="text-[11px] text-[#554336]">Resep khas rumahan Jonggol</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

