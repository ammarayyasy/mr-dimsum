# Panduan Setup Google Spreadsheet & Google Apps Script
**Proyek:** Mr Dimsum Artisan Jonggol  
**Target:** Database Serverless Berbasis Google Spreadsheet untuk Next.js

---

## Ringkasan Konsep (Mengapa Memakai Pola Ini?)
Aplikasi website Mr Dimsum memakai **Google Spreadsheet** sebagai basis data (database) yang hemat biaya, fleksibel, dan mudah dilihat langsung.
Agar spreadsheet tidak bisa diakses atau diutak-atik sembarang orang dari browser, dibuat lapisan keamanan:
```
Pengunjung / Browser ──> Server Next.js ──(Secret Token)──> Google Apps Script ──> Google Spreadsheet
```
Hanya server Next.js yang memegang kunci rahasia (`APPS_SCRIPT_SECRET`) untuk berkomunikasi dengan Google Apps Script Web App.

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka browser dan kunjungi [Google Sheets](https://sheets.new).
2. Beri nama spreadsheet Anda, misalnya: **`Database Mr Dimsum`**.
3. Biarkan sheet kosong (jangan ubah apa-apa dulu), karena skrip kita yang akan membuat tabel dan header secara otomatis.

---

## Langkah 2: Buka Apps Script Editor
1. Di menu Google Spreadsheet, klik **Ekstensi (Extensions)** > **Apps Script**.
2. Tab baru editor Google Apps Script akan terbuka.
3. Beri nama proyek Apps Script di kiri atas, misalnya: **`Mr Dimsum Backend API`**.

---

## Langkah 3: Masukkan File `code.gs` dan `setup.gs`
1. Di editor Apps Script, Anda akan melihat file bawaan bernama `Code.gs`.
   - Hapus seluruh isi di dalamnya.
   - Buka file `code.gs` di root project lokal Anda, salin (**Copy**) seluruh kodenya, lalu tempel (**Paste**) ke editor Apps Script.
   - Klik ikon **Simpan (Save)** (ikon disket) atau tekan `Ctrl + S`.
2. Tambahkan file baru di Apps Script:
   - Klik tombol **+** di samping menu *Files* > pilih **Script**.
   - Beri nama: `setup`.
   - Hapus teks bawaan.
   - Buka file `setup.gs` di root project lokal Anda, salin (**Copy**) seluruh kodenya, lalu tempel (**Paste**).
   - Klik ikon **Simpan (Save)**.

---

## Langkah 4: Jalankan Inisialisasi Tabel (`initTables`)
1. Di bar atas editor Apps Script, pastikan memilih fungsi **`initTables`** dari dropdown daftar fungsi.
2. Klik tombol **Run (Jalankan)**.
3. Google akan meminta izin (*Authorization Required*):
   - Klik **Review permissions (Tinjau izin)**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik tautan kecil **Advanced (Lanjutan)** di bagian bawah, lalu klik **Go to Mr Dimsum Backend API (unsafe) / Buka...**.
   - Klik **Allow (Izinkan)**.
4. Periksa panel *Execution log* di bawah:
   - Anda akan melihat log sukses: Sheet `Roles`, `Users`, dan `News` telah dibuat otomatis beserta akun admin awal dan 3 warta perdana.
5. Kembali ke tab Google Spreadsheet Anda: Anda akan melihat 3 sheet rapi berlatar cokelat espresso Mr Dimsum (`#4D2A00`) sudah terisi!

> **Catatan Keamanan:** Fungsi `initTables()` bersifat **idempoten** (aman dijalankan berulang kali tanpa membuat data ganda).

---

## Langkah 5: Atur Script Properties (Kunci Token Rahasia)
1. Di bilah samping kiri editor Apps Script, klik ikon roda gigi **Project Settings (Setelan Proyek)**.
2. Gulir ke bawah hingga bagian **Script Properties (Properti Skrip)**.
3. Klik **Add script property (Tambahkan properti skrip)**:
   - **Property:** `APPS_SCRIPT_SECRET`
   - **Value:** `mrdimsum_gas_secret_key_2026_jonggol_secure` *(atau kunci acak pilihan Anda)*
4. Klik **Save script properties**.

---

## Langkah 6: Deploy sebagai Web App
1. Di kanan atas editor Apps Script, klik tombol biru **Deploy** > **New deployment (Penerapan baru)**.
2. Klik ikon roda gigi di samping *Select type* > pilih **Web app**.
3. Isi konfigurasi berikut:
   - **Description:** `Mr Dimsum Web App v1`
   - **Execute as (Jalankan sebagai):** `Me (email-anda@gmail.com)` *(Wajib pilih Me)*
   - **Who has access (Siapa yang memiliki akses):** `Anyone (Siapa saja)` *(Tenang, keamanan dijaga oleh secret token)*
4. Klik **Deploy**.
5. Salin **Web app URL** yang muncul (formatnya: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Langkah 7: Sambungkan ke File `.env.local`
Buka file `.env.local` di proyek Next.js Anda di laptop, lalu isi URL Web App tadi:
```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
APPS_SCRIPT_SECRET=mrdimsum_gas_secret_key_2026_jonggol_secure
JWT_SECRET=mr_dimsum_artisan_jwt_secret_key_jonggol_bogor_2026_super_secure
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Cara Memperbarui Deployment (Jika Ada Perubahan Kode)
Google Apps Script mengharuskan pembuatan *Deployment Version* baru agar perubahan kode aktif di Web App:
1. Setelah mengubah kode di Apps Script editor, simpan (`Ctrl + S`).
2. Klik **Deploy** > **Manage deployments (Kelola penerapan)**.
3. Klik ikon pensil (**Edit**) di versi aktif.
4. Pada dropdown *Version*, pilih **New version**.
5. Klik **Deploy**. URL Web App tetap sama, dan perubahan Anda langsung berlaku!

---

## Peringatan Akun Admin Awal
Inisialisasi `setup.gs` membuat akun default:
- **Email:** `admin@gmail.com`
- **Password:** `123456`

> [!WARNING]
> Kredensial ini bersifat publik untuk pengujian awal. Segera buka menu **Ganti Password** di dashboard admin sebelum mempublikasikan website ke publik!

---

## Catatan Penyimpanan Media (Upload Gambar)
- Pada Step 2 ini, semua upload gambar disimpan di folder lokal `public/uploads/`.
- Ini berfungsi optimal saat dijalankan di komputer lokal (*development*).
- Disk Vercel bersifat *read-only* & sementara (*ephemeral*) saat production. Pada **Step 4**, kita akan menyambungkan upload ke penyimpanan *cloud* (misalnya Vercel Blob atau Cloudinary) dengan mengganti modul `src/lib/storage.ts` tanpa mengubah kode UI dashboard.

