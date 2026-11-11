import { siteConfig } from "@/config/site";
import { Utensils, PackageCheck, Users, Store, CheckCircle2, ArrowRight } from "lucide-react";

export default function Services() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Utensils":
        return <Utensils className="w-6 h-6 text-[#8d4b00]" />;
      case "PackageCheck":
        return <PackageCheck className="w-6 h-6 text-[#8d4b00]" />;
      case "Users":
        return <Users className="w-6 h-6 text-[#8d4b00]" />;
      case "Store":
        return <Store className="w-6 h-6 text-[#8d4b00]" />;
      default:
        return <Utensils className="w-6 h-6 text-[#8d4b00]" />;
    }
  };

  return (
    <section id="layanan" className="py-20 sm:py-28 bg-[#fff8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8d4b00] px-3.5 py-1 rounded-full bg-[#ffeada]">
            Solusi Kuliner Terbaik
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4d2a00] mt-3 tracking-tight">
            Layanan Lengkap Mr Dimsum
          </h2>
          <p className="text-sm sm:text-base text-[#554336] mt-2">
            Dari santap langsung di tempat, paket beku untuk stok kulkas, katering pesta hangat, hingga peluang kemitraan reseller di Jonggol dan sekitarnya.
          </p>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-6 border border-[#ffeada] shadow-sm hover:shadow-xl hover:border-[#ffdcbe] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fff1e7] flex items-center justify-center shadow-inner">
                  {getIcon(srv.icon)}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4d2a00] leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#554336] mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Features checklist */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#f5efeb]">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#4d2a00]">
                      <CheckCircle2 className="w-4 h-4 text-[#feb316] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappClean}?text=Halo%20Mr%20Dimsum,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(srv.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#f5efeb] hover:bg-[#8d4b00] text-[#4d2a00] hover:text-white text-xs font-bold transition-all duration-200"
                >
                  <span>Info Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

