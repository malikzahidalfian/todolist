# To Do List & Target Kerja (Aplikasi Desktop Mandiri + Sidebar Dashboard)

Aplikasi desktop mandiri untuk mengelola target sasaran kerja, jobdesk harian (dengan auto-reset otomatis tiap hari & streak tracker), jobdesk umum, **Multi Kategori Toko / Akun Bisnis**, **Kalender Pelacak & Riwayat Kerja Harian**, serta **Vision Board Harapan & Target Impian Bos Ricko**.

Dilengkapi dengan desain baru **Sidebar Navigation Dashboard**:
1. 🌟 **Target Impian (Halaman Pertama):** Vision board motivasi, quote penyemangat, dan target impian (HP Tecno, Yamaha NMAX, Umroh Bareng Istri).
2. 📋 **Jobdesk & Tugas:** Manajemen jobdesk harian per toko/akun, jobdesk umum dengan sub-tugas & %, dan target harapan strategis.
3. 📅 **Kalender Agenda:** Jadwal agenda kerja per tanggal dan pelacak riwayat tugas kemarin.

Aplikasi ini **100% mandiri**, berjalan dengan runtime Electron lokalnya sendiri di dalam folder `C:\To Do List`, serta menyimpan data langsung di folder `data/` (`todos.json`, `categories.json`, `goals.json`, `agendas.json`, dan `history.json`). **Tidak memiliki ketergantungan apa pun terhadap aplikasi Ricko Office.**

---

## 🚀 Cara Menjalankan
Ada dua cara mudah untuk membuka aplikasi:
1. **Shortcut Desktop:** Klik dua kali ikon shortcut **`To Do List`** di Desktop laptop Anda.
2. **File Batch:** Klik dua kali file **`Buka To Do List.bat`** di dalam folder `C:\To Do List`.

---

## 📂 Fitur Kategori Bisnis, Toko & Akun
- **Kategori Bawaan:**
  - 🏪 `Toko Shopee MP3 Player`
  - 💎 `Toko Zyra Jewelry`
  - 👟 `Akun Affiliate @reviewsepatucowok`
  - 🏢 `Operasional & Markas`
- **Tambah & Hapus Kategori Bebas:** Tombol `＋ Tambah Kategori` dan `⚙️ Kelola Kategori` memungkinkan Bos membuat atau menghapus kategori toko/akun kapan saja. Jika kategori dihapus, tugas di dalamnya otomatis dialihkan secara aman ke kategori lain.
- **Jobdesk Terpisah per Kategori:** Setiap kategori memiliki daftar jobdesk harian, jobdesk umum (dengan sub-jobdesk), dan target sasaran tersendiri.
- **Tab Filter Cepat:** Klik tab kategori di bagian atas untuk fokus pada pekerjaan toko/akun yang sedang dikerjakan.

---

## 📌 Jobdesk Umum dengan Sub-Jobdesk & Persentase Capaian
- Setiap tugas jobdesk umum kini bisa ditambahkan **sub-jobdesk** (checklist langkah pengerjaan).
- Persentase progress dihitung secara otomatis (misal: 2 dari 4 sub-tugas selesai = 50%) lengkap dengan bar visual.
- Input cepat langsung pada kartu tugas untuk menambahkan sub-jobdesk baru tanpa modal tambahan.

---

## 🎯 Target Kategori (Harapan & Sasaran Strategis)
- Target sasaran difokuskan sebagai **harapan & capaian strategis** dari tiap kategori (misal: *"Tembus omset 50jt & Star Seller Shopee"*), tanpa angka/counter yang membebani.
- Dilengkapi status jelas (`🎯 Sedang Dikejar` atau `🏆 Target Tercapai!`) dan tombol toggle satu klik.

---

## 📅 Fitur Kalender: Pelacak Riwayat & Agenda Kerja Terjadwal
- **Agenda Kerja Terjadwal:** Tombol `＋ Tambah Agenda` memungkinkan Bos menjadwalkan pekerjaan pada tanggal dan hari tertentu (misal: *"Buat 10 video Shopee"* pada tanggal 15 Nov).
- **Indikator Agenda pada Kalender:** Tanggal yang memiliki agenda ditandai dengan badge pin (`📌 1`).
- **Inspeksi Riwayat Harian:** Klik tanggal mana saja untuk melihat ketercapaian tugas harian dan tugas apa saja yang belum selesai kemarin atau di masa lampau.

---

## 📱 Panduan Versi HP & Hosting Gratis (PWA / Web App)
Aplikasi ini dibangun menggunakan standar web murni (HTML5, CSS3, JavaScript) sehingga sangat siap dijadikan aplikasi HP:
1. **Hosting Gratis:** Bisa di-upload langsung ke **Vercel**, **Netlify**, atau **GitHub Pages** (gratis selamanya dengan HTTPS).
2. **Sebagai Aplikasi HP (PWA - Progressive Web App):**
   - Tambahkan `manifest.json` dan `service-worker.js`.
   - Buka link web di browser HP (Chrome Android / Safari iOS), lalu tekan tombol **"Tambahkan ke Layar Utama" (Install)**.
   - Aplikasi akan tampil di menu HP dengan logo 3D, berjalan fullscreen, dan bisa dibuka offline.
3. **Sebagai File APK Asli:**
   - Dapat di-bundle menjadi file `.apk` asli menggunakan **Capacitor** dari tim Ionic.

---

## 🔤 Tampilan Ringkas & Font Proporsional
- Ukuran font diturunkan ke ukuran proporsional (13px) dengan margin dan padding yang lebih ringkas dan elegan, sehingga tidak terasa kebesaran di layar laptop.
- Kolom PIC / Petugas telah dihapus agar tampilan lebih bersih dan fokus pada eksekusi tugas.

---

## 📅 Fitur Kalender Pelacak & Riwayat Harian
- **Widget Kalender Bulanan Interaktif:** Indikator warna ketercapaian per tanggal (🟢 Hijau, 🟡 Kuning, 🔴 Merah).
- **Inspeksi Tugas yang Belum Dikerjakan:** Klik tanggal mana saja (atau klik tombol **`⏮ Cek Kemarin`**) untuk langsung melihat tugas harian apa yang belum dilakukan pada hari tersebut.

---

## 🌟 Fitur Vision Board (Harapan & Target Impian)
- **⚡ Kata-Kata Penyemangat Harian**
- **📱 Target HP Tecno Camon 50 Pro (Rp 4.500.000)**
- **🛵 Target Motor Yamaha NMAX (Rp 35.000.000)**
- **🕋 Target Umroh Bareng Istri (Paket Berdua Makkah & Madinah)**
- **🔍 Lightbox Zoom:** Klik foto sampul mana saja untuk memperbesar foto nyata.

---

## 🎨 Logo Aplikasi 3D & Ikon Shortcut Desktop
- Desain logo 3D premium checkmark target kerja dengan palet warna modern glassmorphic.
- Terpasang pada:
  - Header aplikasi di samping judul dan badge versi.
  - Ikon jendela & taskbar Windows Electron (`src/assets/app-icon.ico`).
  - Pintasan Desktop laptop (`To Do List.lnk`).

---

## 📦 Struktur Folder
```
C:\To Do List\
├── Buka To Do List.bat            # Launcher aplikasi instan
├── package.json                   # Konfigurasi aplikasi (v1.0.5)
├── CHANGELOG.md                   # Catatan versi & riwayat pembaruan
├── README.md                      # Dokumentasi petunjuk pemakaian
├── data\
│   ├── todos.json                 # Database tugas & target lokal
│   ├── categories.json            # Database kategori toko & akun
│   ├── agendas.json               # Database agenda kerja terjadwal
│   ├── goals.json                 # Database target impian & motivasi
│   └── history.json               # Database riwayat harian per tanggal
├── src\
│   ├── main.js                    # Proses utama Electron & window
│   ├── preload.js                 # Bridge IPC aman
│   ├── index.html                 # Antarmuka (UI) aplikasi
│   ├── style.css                  # Tema & styling ringkas (Dark / Light)
│   ├── app.js                     # Logika data, filter, kategori, streak, & kalender
│   └── assets\
│       └── targets\               # Foto asli HP Tecno, NMAX, & Ka'bah Umroh
├── scripts\
│   └── create-shortcut.ps1        # Script pembuat shortcut desktop
└── node_modules\
    └── electron\                  # Runtime Electron mandiri
```
