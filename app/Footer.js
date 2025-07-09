// File: app/Footer.js

"use client";

import Link from 'next/link'; // <-- Impor komponen Link
import { 
    Server, Bot, GitBranch, Cloud, Power, Type, Component, Library, PanelTop, Frame, Leaf, 
    Package, CheckSquare, BrainCircuit, Orbit, Paintbrush 
} from 'lucide-react';

// Data untuk footer sekarang berada di dalam komponennya sendiri
const footerSections = [
  {
    title: 'Services & Platforms',
    items: [
      { name: 'Pollinations.ai', icon: <BrainCircuit size={16} />, url: 'https://pollinations.ai/' },
      { name: 'Google', icon: <Power size={16} />, url: 'https://www.google.com' },
      { name: 'Vercel', icon: <Server size={16} />, url: 'https://vercel.com/' },
      { name: 'Cloudflare', icon: <Cloud size={16} />, url: 'https://www.cloudflare.com/' },
      { name: 'GitHub', icon: <GitBranch size={16} />, url: 'https://github.com/' },
      { name: 'OpenAI', icon: <Bot size={16} />, url: 'https://openai.com/' }
    ]
  },
  {
    title: 'Frameworks & Libraries',
    items: [
      { name: 'Next.js', icon: <Frame size={16} />, url: 'https://nextjs.org/' },
      { name: 'React', icon: <Component size={16} />, url: 'https://react.dev/' },
      { name: 'NextAuth.js', icon: <PanelTop size={16} />, url: 'https://next-auth.js.org/' },
      { name: 'Tailwind CSS', icon: <Library size={16} />, url: 'https://tailwindcss.com/' },
      { name: 'Lucide Icons', icon: <Leaf size={16} />, url: 'https://lucide.dev/' },
      { name: 'Framer Motion', icon: <Orbit size={16} />, url: 'https://www.framer.com/motion/' }
    ]
  },
  {
    title: 'Tooling & Language',
    items: [
      { name: 'Node.js', icon: <Power size={16} />, url: 'https://nodejs.org/' },
      { name: 'TypeScript', icon: <Type size={16} />, url: 'https://www.typescriptlang.org/' },
      { name: 'pnpm', icon: <Package size={16} />, url: 'https://pnpm.io/' },
      { name: 'ESLint', icon: <CheckSquare size={16} />, url: 'https://eslint.org/' },
      { name: 'Prettier', icon: <Paintbrush size={16} />, url: 'https://prettier.io/' }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="w-full mt-16 p-8 border-t border-gray-500/20 text-sm">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold mb-4 text-base">{section.title}</h3>
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item.name}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center mt-12 pt-8 border-t border-gray-500/20 opacity-70">
        <p>&copy; {new Date().getFullYear()} RuangRiung AI Image Generator - Developed with ❤️ by{' '}
          <a href="https://ariftirtana.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Arif Tirtana
          </a>
        </p>
        {/* --- BLOK BARU DITAMBAHKAN DI SINI --- */}
        <div className="mt-4 flex justify-center gap-x-4">
          <Link href="/privacy" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Kebijakan Privasi
          </Link>
          <span className="opacity-50">|</span>
          <Link href="/terms" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Ketentuan Layanan
          </Link>
           <span className="opacity-50">|</span>
          <Link href="/data-deletion" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Penghapusan Data
          </Link>
        </div>
        {/* --- AKHIR BLOK BARU --- */}
      </div>
    </footer>
  );
}