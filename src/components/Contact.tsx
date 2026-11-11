"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { MapPin, Phone, Mail, Clock, Send, ExternalLink, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    topic: "Pesanan Acara & Katering",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // WhatsApp auto-compose
    const text = `Halo Mr Dimsum!%0A%0A*Nama:* ${encodeURIComponent(formData.name)}%0A*Kontak:* ${encodeURIComponent(formData.contact)}%0A*Topik:* ${encodeURIComponent(formData.topic)}%0A*Pesan:* ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/${siteConfig.contact.whatsappClean}?text=${text}`, "_blank");
  };

  return (
    <section id="kontak" className="py-20 sm:py-28 bg-[#fff8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-left max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8d4b00] px-3.5 py-1 rounded-full bg-[#ffeada]">
            Hubungi Kami & Lokasi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4d2a00] mt-3 tracking-tight">
            Kami Siap Melayani Anda
          </h2>
          <p className="text-sm sm:text-base text-[#554336] mt-2">
            Konsultasi katering hajatan, pemesanan box frozen, informasi kemitraan reseller di Jonggol, atau kunjungan langsung ke lokasi kami.
          </p>
        </div>

        {/* 2-Column Layout: Form & Info on Left, Google Maps on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Info Cards + Form) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Quick Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#ffeada] shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff1e7] text-[#8d4b00] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8d4b00]">Alamat Dapur</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#4d2a00] mt-0.5">
                    {siteConfig.location.city}
                  </p>
                  <p className="text-xs text-[#554336] mt-0.5">
                    {siteConfig.location.address}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#ffeada] shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff1e7] text-[#8d4b00] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8d4b00]">WhatsApp & Telp</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#4d2a00] mt-0.5">
                    {siteConfig.contact.phone}
                  </p>
                  <p className="text-xs text-[#554336] mt-0.5">Respon cepat harian</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#ffeada] shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff1e7] text-[#8d4b00] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8d4b00]">Jam Buka</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#4d2a00] mt-0.5">
                    {siteConfig.contact.hours}
                  </p>
                  <p className="text-xs text-[#554336] mt-0.5">Kukusan selalu fresh</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#ffeada] shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff1e7] text-[#8d4b00] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#8d4b00]">Surel Resmi</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#4d2a00] mt-0.5">
                    {siteConfig.contact.email}
                  </p>
                  <p className="text-xs text-[#554336] mt-0.5">Kemitraan & kerjasama</p>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ffeada] shadow-md">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4d2a00] mb-2">
                Kirim Pesan & Konsultasi Pesanan
              </h3>
              <p className="text-xs sm:text-sm text-[#554336] mb-6">
                Isi form di bawah ini untuk tersambung langsung dengan tim Mr Dimsum.
              </p>

              {submitted && (
                <div className="p-4 mb-6 rounded-2xl bg-[#f5efeb] border border-[#feb316] text-[#4d2a00] flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8d4b00] shrink-0" />
                  <p className="text-xs sm:text-sm font-medium">
                    Terima kasih! Pesan Anda sedang dialihkan langsung ke WhatsApp Mr Dimsum.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#4d2a00]">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Bpk. Ahmad"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-sm text-[#4d2a00] placeholder-[#554336]/60 focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#4d2a00]">
                      No. WhatsApp / Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="0812xxxx atau email"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-sm text-[#4d2a00] placeholder-[#554336]/60 focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#4d2a00]">
                    Kebutuhan / Topik
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-sm text-[#4d2a00] focus:outline-none focus:ring-2 focus:ring-[#8d4b00]"
                  >
                    <option>Pesanan Acara & Katering</option>
                    <option>Paket Frozen Dimsum Partai Besar</option>
                    <option>Peluang Reseller & Kemitraan</option>
                    <option>Pertanyaan Menu & Lokasi Jonggol</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#4d2a00]">
                    Pesan / Rencana Acara <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan jumlah porsi yang dibutuhkan, tanggal acara, atau pertanyaan Anda..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f5] border border-[#ffeada] text-sm text-[#4d2a00] placeholder-[#554336]/60 focus:outline-none focus:ring-2 focus:ring-[#8d4b00] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#8d4b00] hover:bg-[#4d2a00] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 mt-2"
                >
                  <span>Kirim via WhatsApp</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Embed */}
          <div className="lg:col-span-5 h-full flex flex-col gap-4">
            <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden border border-[#ffeada] shadow-xl bg-[#ffeada]">
              {/* Google Maps Iframe */}
              <iframe
                title="Peta Lokasi Mr Dimsum Jonggol"
                src={siteConfig.location.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Overlay Badge on Map */}
              <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#ffeada] shadow-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#feb316] animate-ping" />
                    <span className="font-serif text-base font-bold text-[#4d2a00]">
                      Mr Dimsum Jonggol
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffeada] text-[11px] font-bold text-[#8d4b00]">
                    Buka Hari Ini
                  </span>
                </div>

                <p className="text-xs text-[#554336]">
                  {siteConfig.location.address}
                </p>

                <div className="pt-2 border-t border-[#f5efeb] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8d4b00]">
                    Jam Buka: 08:00 - 21:00 WIB
                  </span>
                  <a
                    href={siteConfig.location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#feb316] hover:bg-[#8d4b00] text-[#4d2a00] hover:text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

