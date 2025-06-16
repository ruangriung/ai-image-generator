import { Inter } from 'next/font/google'
import './globals.css' // <-- BARIS INI SANGAT PENTING!

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Image Generator',
  description: 'Generate images with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}