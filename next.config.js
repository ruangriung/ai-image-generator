/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  env: {
    POLLINATIONS_API_TOKEN: process.env.POLLINATIONS_API_TOKEN,
    // --- PENAMBAHAN BARU ---
    // Ganti 'passwordRahasia' dengan kata sandi yang Anda inginkan
    NEXT_PUBLIC_LAB_ACCESS_PASSWORD: process.env.LAB_ACCESS_PASSWORD || 'passwordRahasia',
    // ----------------------
  },
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = withPWA(nextConfig);