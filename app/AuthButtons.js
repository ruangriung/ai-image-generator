// File: app/AuthButtons.js

"use client";

import Link from 'next/link';
import { Mail } from 'lucide-react'; // Impor ikon baru
import { NeumorphicButton } from './components';

export default function AuthButtons() {
  return (
    // Gunakan komponen Link dari Next.js untuk navigasi
    <Link href="/contact" passHref>
      <NeumorphicButton 
        as="a" // Render tombol sebagai tag anchor (<a>)
        className="!p-3" 
        aria-label="Buka halaman kontak"
        title="Hubungi Kami"
      >
        <Mail size={20} />
      </NeumorphicButton>
    </Link>
  );
}