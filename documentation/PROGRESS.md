# Progres Proyek - Mr Dimsum

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **Step 4 - Deploy & Maintenance (Kebutuhan Lanjutan & Persiapan Vercel)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
  - [x] Nama usaha: Mr Dimsum
  - [x] Bidang: Makanan (Kuliner Dimsum Artisan)
  - [x] Tentang: Dimsum favorit warga Jonggol, dengan rasa autentik buatan tangan sendiri
  - [x] Lokasi & Maps: Kawasan Jonggol, Bogor (`https://maps.app.goo.gl/AwjM7kM2geygc3ok6`)
  - [x] Logo: Terlampir dan tersimpan di `public/images/logo.jpg`
  - [x] Rancangan UI: Design system & prototipe di `/design-refence` diintegrasikan
  - [x] Konfigurasi terpusat di `src/config/site.ts`
- [x] STEP 1 - Landing page
  - [x] Hero (Headline, Subjudul, CTA WhatsApp & Menu, Metrics, Floating Badges)
  - [x] About (Kisah Dimsum Jonggol, 3 Pilar Keunggulan, Foto Master Dimsum)
  - [x] Service (4 Layanan: Dine-In & Takeaway, Frozen Dimsum Pack, Katering Acara, Kemitraan Reseller Jonggol)
  - [x] Menu Favorit (Hakau Kristal Udang Segar, Siomay Ayam Udang Special, Lumpia Kulit Tahu Crispy, Pangsit Udang Goreng Mayonaise + Filter Kategori)
  - [x] Berita/Post (3 Artikel Warta Rasa + Modal Pratinjau Baca Lengkap)
  - [x] Contact + Google Maps (Info Alamat, WhatsApp, Jam Operasional, Form Pesan Interaktif, Google Maps Embed Jonggol ber-title & lazy loading)
  - [x] Navbar & Footer (Menu aksesibel mobile & desktop, logo Mr Dimsum, medsos, jam buka)
  - [x] Responsif & aksesibilitas dicek (Mobile 375px, Tablet 768px, Desktop 1280px)
  - [x] Dikonfirmasi pengguna (Lanjut ke Step 2)
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) di root project + fungsi inisiasi tabel idempoten (`initTables`)
  - [x] Panduan instalasi dan deployment Google Spreadsheet di `documentation/SETUP.md`
  - [x] Login (`/login`) & Register (`/register`) dengan validasi form, loading state, error alert, dan cookie HTTP-only (JWT via `jose`)
  - [x] Role `admin` & `user` (password ter-hash via `bcryptjs`, tidak pernah disimpan polos)
  - [x] Proteksi rute & middleware: `/admin/*` hanya dapat dibuka oleh role `admin`, non-admin dialihkan
  - [x] Dashboard Overview (`/admin`) dengan metrik total warta, pengguna, role, dan indikator status database
  - [x] Dashboard Manajemen User (`/admin/users`): daftar, cari nama/email, ubah role, aktif/nonaktifkan akun, tambah user, hapus user (proteksi akun sendiri & admin terakhir)
  - [x] Dashboard Manajemen Role (`/admin/roles`): daftar role, tambah/edit role kustom, hak akses/permissions, proteksi role sistem (`admin`, `user`)
  - [x] Dashboard CRUD Berita (`/admin/news`): tambah warta, edit warta, hapus warta, pratinjau, filter status draft vs published
  - [x] Upload Media Lokal (`/api/admin/upload` & `src/lib/storage.ts`): simpan file ke `public/uploads/` dengan validasi format & ukuran (max 5MB)
  - [x] Integrasi Landing Page: section "Warta & Cerita Rasa" menampilkan 3 berita terbaru dari database dengan tombol "Lihat Semua Berita"
  - [x] Halaman Arsip Seluruh Berita (`/berita`) lengkap dengan fitur pencarian judul & konten, filter kategori, hitungan warta aktif, modal baca lengkap, dan tombol kembali ke beranda
  - [x] Fitur Ganti Kata Sandi (`/admin/profile`) + peringatan keamanan kredensial bawaan
  - [x] Integrasi Navbar: tombol "Masuk" untuk tamu, badge "Dashboard Admin" untuk admin, nama & tombol keluar untuk pelanggan
  - [x] Dikonfirmasi pengguna (Lanjut ke Step 3)
- [x] STEP 3 - Sistem Pemesanan/Booking & QRIS
  - [x] Formulir Pemesanan Interaktif (`/pesanan/buat`): pemilihan menu dimsum dengan tombol +/- counter, tipe pesanan (Takeaway, Dine-in, Delivery Jonggol), validasi nomor WhatsApp penerima, input alamat/meja, dan estimasi waktu siap
  - [x] Halaman Pembayaran QRIS Dinamis (`/pesanan/[id]/bayar`): rincian tagihan, ID transaksi unik (`ORD-XXXXXX`), instruksi langkah pembayaran, tombol salin nominal, dan barcode QRIS resmi Gopay Merchant (*MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF* - NMID: `ID1026545853032` tersimpan di `public/images/qris.jpg`)
  - [x] Tiket Pesanan & Database: tabel `Orders` dibuat di `setup.gs` dan fallback lokal dengan status awal `menunggu_konfirmasi`
  - [x] Halaman "Pesanan Anda" (`/pesanan`): pelacakan tiket pemesanan khusus pengguna yang sedang login (dilindungi verifikasi kepemilikan data di server), status badge visual, dan tombol WhatsApp bantuan kasir
  - [x] Dashboard Admin Pesanan (`/admin/orders`): filter status pesanan (Semua, Menunggu, Dikonfirmasi, Dibatalkan), metrik omzet, aksi konfirmasi pembayaran satu klik (`dikonfirmasi`), aksi tolak/batalkan dengan alasan, serta pintasan tautan langsung WhatsApp (`wa.me`)
  - [x] Integrasi Navigasi: Menu "Pesanan Anda" otomatis muncul di Navbar saat pelanggan login, tombol CTA "Pesan Sekarang" di Navbar & menu favorit mengarah langsung ke `/pesanan/buat`
  - [x] Responsif & Aksesibilitas dicek untuk mobile & desktop
  - [x] Dikonfirmasi pengguna (Lanjut ke Step 4)
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Konfirmasi kebutuhan payment gateway otomatis & cloud media
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

---

## Kredensial Akun Pengujian
- **Halaman Login:** [http://localhost:3000/login](http://localhost:3000/login)
- **Email Admin:** `admin@gmail.com`
- **Password:** `123456`

---

## Alur Pengujian Fitur Step 3
1. **Pemesanan Dimsum:**
   - Masuk ke [http://localhost:3000/pesanan/buat](http://localhost:3000/pesanan/buat).
   - Pilih menu (misal: Siomay Ayam Udang & Hakau Kristal), tentukan tipe pemesanan (Dine-in / Takeaway / Delivery).
   - Klik **"Lanjut ke Pembayaran QRIS"**.
2. **Pembayaran QRIS:**
   - Halaman [http://localhost:3000/pesanan/{id}/bayar](http://localhost:3000/pesanan/{id}/bayar) menampilkan barcode QRIS Mr Dimsum, kode pembayaran `ORD-XXXXXX`, dan petunjuk transfer.
   - Status awal tiket adalah `menunggu_konfirmasi`.
3. **Pelacakan Tiket Pelanggan:**
   - Buka menu **"Pesanan Anda"** di [http://localhost:3000/pesanan](http://localhost:3000/pesanan) untuk melihat riwayat pesanan.
4. **Konfirmasi Kasir / Admin:**
   - Masuk sebagai Admin ke [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders).
   - Klik tombol **"Konfirmasi Pembayaran"** pada pesanan yang baru masuk.
   - Tersedia juga tombol pintas **"WhatsApp"** untuk langsung menghubungi nomor pelanggan via `wa.me`.
   - Kembali ke [http://localhost:3000/pesanan](http://localhost:3000/pesanan) di sisi pelanggan, status akan langsung berganti menjadi badge hijau `dikonfirmasi`.
