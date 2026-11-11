export interface DishItem {
  id: string;
  name: string;
  description: string;
  category: "Kukus" | "Goreng" | "Sup";
  portion: string;
  price: number;
  badge?: string;
  rating: number;
  image: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  thumbnail: string;
  readTime: string;
}

export const siteConfig = {
  name: "Mr Dimsum",
  tagline: "Sekali Coba, Pengen Lagi!",
  taglineSub: "Dimsum Artisan Autentik Buatan Tangan",
  category: "Makanan & Kuliner",
  aboutShort: "Dimsum favorit warga Jonggol, dengan rasa autentik buatan tangan sendiri.",
  aboutFull:
    "Mr Dimsum berawal dari kecintaan menghadirkan sajian dimsum artisan berkualitas premium bagi warga Jonggol dan sekitarnya. Setiap kulit dimsum ditipiskan secara manual dan diracik dengan isian daging ayam serta udang segar pilihan tanpa tambahan bahan pengawet. Kami menghadirkan perpaduan cita rasa tradisional yang hangat, higienis, dan 100% halal untuk dinikmati bersama keluarga tercinta.",
  
  logo: "/images/logo.jpg",
  heroImage: "/images/hero-dimsum.png",
  chefImage: "/images/chef-master.png",
  
  location: {
    address: "Jl. Raya Dayeuh (Kawasan IDN), Jonggol, Kab. Bogor, Jawa Barat 16830",
    city: "Jonggol, Bogor",
    mapsUrl: "https://maps.app.goo.gl/AwjM7kM2geygc3ok6",
    embedUrl: "https://maps.google.com/maps?q=-6.5252823,107.0381356&hl=id&z=16&output=embed",
  },
  
  contact: {
    whatsapp: "+62 812-8900-5544",
    whatsappClean: "6281289005544",
    phone: "0812-8900-5544",
    email: "halo@mrdimsum.com",
    hours: "Setiap Hari: 08.00 - 21.00 WIB",
  },

  socials: {
    instagram: "https://instagram.com/mrdimsum_jonggol",
    tiktok: "https://tiktok.com/@mrdimsum_jonggol",
    whatsapp: "https://wa.me/6281289005544?text=Halo%20Mr%20Dimsum,%20saya%20ingin%20bertanya%20menu%20dan%20pemesanan",
  },

  qris: {
    image: "/images/qris.jpg",
    merchantName: "MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF",
    nmid: "ID1026545853032",
    code: "A01",
    provider: "Gopay Merchant",
  },

  metrics: [
    { value: "08:00", label: "Kukusan Pertama Harian" },
    { value: "100%", label: "Halal & Alami" },
    { value: "0%", label: "Bahan Pengawet" },
    { value: "4.9/5", label: "Rating Kepuasan Pelanggan" },
  ],

  values: [
    {
      title: "Bahan Segar Pilihan",
      desc: "Daging ayam dan udang segar harian yang diolah langsung demi menjaga kesegaran rasa alami.",
      icon: "Sparkles",
    },
    {
      title: "Artisan Handmade Tiap Hari",
      desc: "Dibungkus dan dilipat teliti dengan tangan setiap pagi tanpa mesin pencetak pabrikan.",
      icon: "HeartHandshake",
    },
    {
      title: "100% Halal & Higienis",
      desc: "Standar dapur bersih, higienis, dan terjamin kehalalannya untuk seluruh keluarga.",
      icon: "ShieldCheck",
    },
  ],

  featuredDishes: [
    {
      id: "hakau-udang",
      name: "Hakau Kristal Udang Segar",
      description: "Kulit transparan tipis lembut dengan isian udang laut utuh yang gurih kenyal dan manis alami.",
      category: "Kukus",
      portion: "3 pcs / porsi",
      price: 24000,
      badge: "Best Seller #1",
      rating: 4.9,
      image: "/images/hero-dimsum.png",
    },
    {
      id: "siomay-ayam-udang",
      name: "Siomay Ayam Udang Special",
      description: "Olahan daging ayam segar berpadu udang empuk dengan topping parutan wortel manis dan saus cocolan khas.",
      category: "Kukus",
      portion: "4 pcs / porsi",
      price: 20000,
      badge: "Favorit Warga",
      rating: 4.9,
      image: "/images/gourmet-variety.png",
    },
    {
      id: "lumpia-kulit-tahu",
      name: "Lumpia Kulit Tahu Crispy",
      description: "Balutan kulit kembang tahu garing renyah keemasan dengan isian daging gurih juicy.",
      category: "Goreng",
      portion: "3 pcs / porsi",
      price: 22000,
      badge: "Crispy Gurih",
      rating: 4.8,
      image: "/images/crispy-platter.png",
    },
    {
      id: "pangsit-udang-goreng",
      name: "Pangsit Udang Goreng Mayonaise",
      description: "Pangsit goreng renyah isi udang padat disajikan bersama saus mayo creamy gurih manis.",
      category: "Goreng",
      portion: "3 pcs / porsi",
      price: 22000,
      badge: "Cemilan Favorit",
      rating: 4.8,
      image: "/images/crispy-platter.png",
    },
  ] as DishItem[],

  services: [
    {
      id: "dine-in-takeaway",
      title: "Dine-In & Takeaway Hangat",
      description: "Nikmati langsung sajian kukusan bambu panas di outlet kami di Jonggol atau bawa pulang kemasan praktis untuk disantap bersama keluarga.",
      icon: "Utensils",
      features: ["Kukus fresh saat dipesan", "Kemasan food-grade higienis", "Area santai & nyaman"],
    },
    {
      id: "frozen-pack",
      title: "Frozen Dimsum Siap Masak",
      description: "Stok dimsum beku higienis tahan lama dengan kemasan vacuum pack. Lengkap dengan petunjuk kukus mudah dan saus spesial Mr Dimsum.",
      icon: "PackageCheck",
      features: ["Kemasan vacuum kedap udara", "Termasuk saus chili oil & cocolan", "Tahan hingga 2 bulan di freezer"],
    },
    {
      id: "catering-event",
      title: "Pesanan Acara & Katering",
      description: "Penyediaan dimsum live-steam hangat untuk hajatan, rapat kantor, gathering sekolah, pesta ulang tahun, dan pesta pernikahan di area Bogor & sekitarnya.",
      icon: "Users",
      features: ["Dukungan live-cooking / kukus di tempat", "Harga paket hemat khusus acara", "Pilihan ragam menu lengkap"],
    },
    {
      id: "kemitraan-reseller",
      title: "Kemitraan & Reseller Jonggol",
      description: "Peluang usaha reseller dan suplier dimsum untuk kafe, warkop kekinian, kantin, maupun usaha kuliner lokal dengan margin menguntungkan.",
      icon: "Store",
      features: ["Pasokan rutin terjamin", "Harga modal kemitraan ramah", "Materi promosi siap pakai"],
    },
  ] as ServiceItem[],

  news: [
    {
      id: "1",
      title: "Rahasia Dimsum Tetap Juicy: Kenapa Mr Dimsum Selalu Handmade Tiap Hari?",
      slug: "rahasia-dimsum-juicy-mr-dimsum",
      excerpt: "Mempertahankan tekstur juicy dan kulit kenyal lembut ternyata membutuhkan teknik lipatan tradisional yang tidak bisa digantikan mesin.",
      content: "Mr Dimsum berkomitmen menjaga tradisi pembuatan manual. Mulai dari penipisan lembaran kulit hingga takaran isian daging ayam dan udang segar harian, setiap proses dilakukan dengan ketelitian tinggi oleh tim pengrajin dimsum kami di Jonggol...",
      date: "08 November 2026",
      author: "Admin Mr Dimsum",
      category: "Cerita Rasa",
      thumbnail: "/images/chef-master.png",
      readTime: "3 menit",
    },
    {
      id: "2",
      title: "Tips Praktis Mengukus Frozen Dimsum di Rumah Agar Lembut Maksimal",
      slug: "tips-mengukus-frozen-dimsum-lembut",
      excerpt: "Beli frozen pack Mr Dimsum? Ikuti 4 langkah sederhana ini agar tekstur dan kenikmatannya sama persis seperti makan langsung di outlet.",
      content: "Banyak pelanggan bertanya bagaimana cara terbaik menikmati paket frozen dimsum. Cukup panaskan panci kukusan hingga air mendidih beruap banyak, olesi alas wadah dengan sedikit minyak agar tidak lengket, lalu kukus selama 8-10 menit tanpa perlu di-thawing terlebih dahulu...",
      date: "02 November 2026",
      author: "Dapur Mr Dimsum",
      category: "Tips & Trik",
      thumbnail: "/images/hero-dimsum.png",
      readTime: "2 menit",
    },
    {
      id: "3",
      title: "Paket Dimsum Party Box untuk Kumpul Keluarga & Acara Sekolah di Jonggol",
      slug: "paket-dimsum-party-box-jonggol",
      excerpt: "Kini hadir paket klakat pesta isi 30 & 50 pcs campur varian, solusi lezat dan hemat untuk sajian segala acara spesial Anda.",
      content: "Merayakan momen kumpul keluarga atau syukuran bersama teman kini makin meriah dengan Party Box Mr Dimsum. Paket ini menghadirkan perpaduan siomay ayam, hakau kristal, hingga lumpia kulit tahu garing yang disukai semua usia...",
      date: "25 Oktober 2026",
      author: "Admin Mr Dimsum",
      category: "Promo & Event",
      thumbnail: "/images/crispy-platter.png",
      readTime: "2 menit",
    },
  ] as NewsPost[],
};

