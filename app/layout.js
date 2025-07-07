// File: app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  manifest: "/manifest.json",
  title: 'RuangRiung AI Image Generator - Create Stunning Digital Art',
  description: 'Generate stunning AI art with multiple styles - from photorealistic to anime, cyberpunk to Studio Ghibli. Create professional photography, digital art, oil paintings and more with advanced AI image generation.',
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
    icon: '/icon.ico',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  applicationName: 'RuangRiung AI Image Generator',
  appleWebApp: {
    statusBarStyle: '#000000',
    capable: 'yes',
  },
  msapplication: {
    navbuttonColor: '#000000',
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={inter.className}>
        <header>
          {/* Tambahkan logo/nama aplikasi di sini jika ada */}
        </header>
        <main id="main-content" tabIndex="-1">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  )
}