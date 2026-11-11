# Maintenance Log - Mr Dimsum

Dokumen ini digunakan untuk memantau pemeliharaan website, backlog fitur lanjutan, catatan perbaikan bug, dan riwayat pembaruan sistem setelah website dipublikasikan.

---

## Backlog Fitur (Pengembangan Lanjutan)
- [ ] **Payment Gateway Otomatis (Midtrans / Xendit)**: Otomatisasi verifikasi pembayaran QRIS tanpa perlu pengecekan manual mutasi oleh admin/kasir.
- [ ] **Notifikasi WhatsApp & Email Otomatis**: Pengiriman tiket pesanan dan notifikasi status langsung ke WhatsApp pembeli via WA Cloud API / Resend.
- [ ] **Cloud Media Storage (Vercel Blob / Cloudinary)**: Migrasi modul `src/lib/storage.ts` agar upload foto warta baru di dashboard admin tersimpan permanen di cloud Vercel.

---

## Bug Diketahui
*(Tidak ada bug aktif)*

---

## Riwayat Perubahan
- **11 November 2026**: 
  - Penambahan tombol cepat & menu navigasi *"Pesanan Saya"* pada Navbar (khusus pelanggan yang sudah login).
  - Integrasi barcode QRIS resmi Gopay Merchant (*MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF* - NMID: `ID1026545853032`) pada halaman pembayaran tiket.
  - Perbaikan keamanan tipe data nomor WhatsApp (`String coercion`) pada dashboard pesanan admin.
  - Persiapan deployment produksi Vercel & verifikasi sanitasi rahasia `.gitignore`.
- **10 November 2026**: 
  - Selesai implementasi Step 2: Sistem akun login/register, proteksi dashboard admin, CRUD warta warta rasa, dan konektor database Google Spreadsheet.
- **9 November 2026**: 
  - Selesai implementasi Step 1: Landing page lengkap Mr Dimsum (Hero, About, Menu Favorit, Layanan, Kontak, dan Google Maps Jonggol).
