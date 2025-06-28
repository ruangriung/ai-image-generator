# RuangRiung AI Image & Multimedia Generator

Selamat datang di RuangRiung AI Generator\! Aplikasi web canggih yang memungkinkan Anda mengubah imajinasi menjadi karya seni visual dan audio yang menakjubkan menggunakan kekuatan kecerdasan buatan. Dibuat dengan Next.js dan Tailwind CSS, proyek ini menawarkan antarmuka yang bersih, modern, dan kaya akan fitur.

## ✨ Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur canggih untuk memaksimalkan kreativitas Anda:

  * **Generator Multi-Modal**:
      * **Gambar (Image)**: Hasilkan gambar dari teks dengan berbagai model AI, termasuk `Flux`, `DALL-E 3`, dan `Stability`.
      * **Video**: Gunakan asisten prompt untuk merancang deskripsi video sinematik yang siap digunakan pada platform text-to-video.
      * **Audio**: Ubah teks menjadi suara dengan berbagai pilihan suara realistis.
  * **Kustomisasi Tingkat Lanjut**:
      * **Ratusan Gaya Seni**: Pilih dari daftar gaya yang sangat lengkap, mulai dari *photorealistic*, *anime*, *cyberpunk*, hingga gaya lukisan klasik.
      * **Kontrol Ukuran & Kualitas**: Tentukan resolusi gambar dengan preset atau ukuran kustom, serta pilih kualitas output (Standard, HD, Ultra).
      * **Batch Generation**: Hasilkan beberapa gambar sekaligus (hingga 10) dalam satu kali proses.
      * **Seed Control**: Gunakan *seed* untuk mereproduksi hasil yang konsisten atau biarkan acak untuk variasi tak terbatas.
  * **Asisten Cerdas Berbasis AI**:
      * **Penyempurnaan Prompt**: Tingkatkan prompt sederhana Anda menjadi deskripsi yang lebih kaya dan artistik dengan satu klik.
      * **Analisis Gambar-ke-Prompt**: Unggah gambar dan biarkan AI menganalisisnya untuk membuat prompt deskriptif secara otomatis.
      * **Saran Prompt Dinamis**: Dapatkan ide-ide prompt kreatif yang dibuat oleh AI dan bisa diperbarui kapan saja.
  * **Editor Gambar Bawaan**:
      * **Filter & Penyesuaian**: Terapkan filter dasar dan lakukan penyesuaian pada gambar yang dihasilkan.
      * **Watermark**: Tambahkan watermark berupa teks atau logo pada karya Anda dengan kontrol posisi, ukuran, dan opasitas.
  * **Manajemen & Riwayat**:
      * **Riwayat Generasi**: Semua gambar yang Anda buat secara otomatis tersimpan dalam riwayat.
      * **Prompt Favorit**: Simpan prompt favorit Anda untuk digunakan kembali di lain waktu.
  * **Antarmuka Pengguna Modern**:
      * **Desain Neumorphic**: Tampilan yang bersih dan modern dengan efek 3D yang halus.
      * **Mode Gelap & Terang**: Sesuaikan tampilan sesuai preferensi Anda.
      * **PWA (Progressive Web App)**: Install aplikasi langsung di perangkat Anda untuk akses yang lebih cepat dan pengalaman seperti aplikasi native.

## 🚀 Memulai Proyek

Proyek ini dibuat menggunakan [Next.js](https://nextjs.org/). Untuk menjalankannya secara lokal, ikuti langkah-langkah berikut:

### 1\. Prasyarat

Pastikan Anda memiliki [Node.js](https://nodejs.org/) (versi 18.17.0 atau lebih tinggi) dan npm/yarn/pnpm terinstal di komputer Anda.

### 2\. Kloning Repositori

```bash
git clone https://github.com/ruangriung/ai-image-generator.git
cd ai-image-generator
```

### 3\. Instalasi Dependensi

Jalankan salah satu perintah berikut sesuai dengan manajer paket yang Anda gunakan:

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 4\. Menjalankan Server Development

Setelah instalasi selesai, jalankan server development:

```bash
npm run dev
```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda untuk melihat hasilnya. Halaman akan otomatis diperbarui setiap kali Anda melakukan perubahan pada kode.

## 🛠️ Teknologi yang Digunakan

  * **Framework**: [Next.js](https://nextjs.org/)
  * **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  * **UI/UX**: Desain Neumorphic, Ikon dari [Lucide React](https://lucide.dev/)
  * **PWA**: [next-pwa](https://github.com/shadowwalker/next-pwa)
  * **Deployment**: [Vercel](https://vercel.com/)

## 部署 di Vercel

Cara termudah untuk mendeploy aplikasi Next.js Anda adalah dengan menggunakan [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dari para pembuat Next.js.
