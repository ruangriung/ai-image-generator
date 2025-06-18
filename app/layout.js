import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Metadata untuk SEO
export const metadata = {
  // BARIS BARU: Menambahkan tautan ke manifest.json
  manifest: "/manifest.json",

  // Judul dan Deskripsi Utama
  title: 'RuangRiung AI Image Generator - Create Stunning Digital Art',
  description: 'Generate stunning AI art with multiple styles - from photorealistic to anime, cyberpunk to Studio Ghibli. Create professional photography, digital art, oil paintings and more with advanced AI image generation.',
  
  // ... sisa metadata Anda tetap sama
  keywords: 'AI image generator, pembuat gambar AI, seni digital AI, generator gambar Indonesia, RuangRiung, AI kreatif, text to image Indonesia, ai Indonesia, gambar AI realistis, ilustrasi AI, fotografi AI, seni AI Indonesia, gambar anime AI, AI artistik, teknologi kreatif, AI untuk desain, pembuat konten AI, AI lokal Indonesia, seni digital, gambar berkualitas tinggi, AI painting, generator gambar online, AI untuk UMKM, kreasi visual AI, AI untuk konten media sosial, gambar unik AI, AI untuk pemasaran, seni generatif, AI untuk bisnis, teknologi AI Indonesia, inovasi kreatif, AI untuk pengusaha',
  verification: {
    google: '3Mybm59m8--LyAZpVYIGHrVk1fSkYemj33bq5RBBdxA',
  },
  openGraph: {
    title: 'RuangRiung AI Image Generator - Create Stunning Digital Art',
    description: 'Transform text into beautiful AI-generated artwork in various styles including photography, anime, digital painting and more.',
    url: 'https://ruangriung.my.id',
    type: 'website',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'RuangRiung AI Image Generator',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  applicationName: 'RuangRiung AI Image Generator',
  appleWebApp: {
    statusBarStyle: '#000000', // Warna status bar untuk aplikasi web di iOS
    capable: 'yes', // Menambahkan properti ini untuk iOS
  },
  msapplication: {
    navbuttonColor: '#000000', // Warna tombol navigasi di Windows
  },
};

// Pengaturan Viewport, termasuk theme-color
export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}