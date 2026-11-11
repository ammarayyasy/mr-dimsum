import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Sparkles, HeartHandshake, ShieldCheck, Award } from "lucide-react";

export default function About() {
  return (
    <section id="tentang-kami" className="py-20 sm:py-28 bg-[#fff8f5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Left Column */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative rounded-3xl p-3 bg-[#fff1e7] shadow-xl border border-[#ffdcbe]">
              <div className="relative w-full h-[380px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#ffeada]">
                <Image
                  src={siteConfig.chefImage}
                  alt="Dapur Pengrajin Mr Dimsum Jonggol"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Quote card below image */}
              <div className="p-4 bg-[#fdfbf7] rounded-xl mt-3 border border-[#ffeada] shadow-sm">
                <p className="text-xs sm:text-sm text-[#554336] italic leading-relaxed">
                  “Setiap lipatan kulit dimsum dikerjakan dengan hati dan ketelitian tinggi di dapur Jonggol kami demi menghadirkan rasa autentik yang bikin pengen lagi.”
                </p>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#8d4b00]">
                  <span>— Dapur Artisan Mr Dimsum</span>
                  <span className="text-[#feb316] font-bold">100% Buatan Tangan</span>
                </div>
              </div>
            </div>

            {/* Heritage Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -right-4 bg-[#4d2a00] text-[#fff8f5] px-6 py-4 rounded-2xl shadow-xl flex-col items-center justify-center border-2 border-[#feb316]">
              <span className="font-serif text-2xl font-bold text-[#feb316]">Jonggol</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffeada]">
                Autentik & Fresh
              </span>
            </div>
          </div>

          {/* Story & Pillars Right Column */}
          <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffeada] text-[#8d4b00] text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>Tentang Mr Dimsum</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#4d2a00] leading-tight tracking-tight">
                Merawat Tradisi Rasa, <br className="hidden sm:inline" />
                <span className="text-[#8d4b00]">Favorit Warga Jonggol</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#554336] leading-relaxed">
              {siteConfig.aboutFull}
            </p>

            {/* 3 Craft Pillars */}
            <div className="flex flex-col gap-3.5 pt-2">
              {siteConfig.values.map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#f5efeb] hover:bg-[#fff1e7] border border-transparent hover:border-[#ffeada] transition-all duration-200 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-white text-[#8d4b00] flex items-center justify-center shrink-0 shadow-sm">
                    {idx === 0 && <Sparkles className="w-5 h-5 text-[#8d4b00]" />}
                    {idx === 1 && <HeartHandshake className="w-5 h-5 text-[#feb316]" />}
                    {idx === 2 && <ShieldCheck className="w-5 h-5 text-[#8d4b00]" />}
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#4d2a00]">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#554336] mt-0.5 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

