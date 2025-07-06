/** @type {import('next').NextConfig} */

// Impor withPWA
const withPWA = require("next-pwa")({
  dest: "public",       // Direktori tujuan untuk file service worker
  register: true,       // Daftarkan service worker secara otomatis
  skipWaiting: true,    // Langsung aktifkan service worker baru tanpa menunggu
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA saat development
});

// Konfigurasi Next.js Anda
const nextConfig = {
  // Tambahkan konfigurasi Next.js lainnya di sini jika ada
  env: {
    POLLINATIONS_API_TOKEN: process.env.POLLINATIONS_API_TOKEN,
    // tambahkan env lain jika perlu
  },
};

// Gabungkan konfigurasi PWA dengan konfigurasi Next.js
module.exports = withPWA(nextConfig);