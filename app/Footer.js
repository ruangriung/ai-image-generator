// File: app/Footer.js

"use client";

// Impor ikon yang relevan, GitBranch dan Star tidak lagi diperlukan untuk GitHub
import { 
    Server, Bot, Cloud, Power, Type, Component, Library, PanelTop, Frame, Leaf, 
    Package, CheckSquare, BrainCircuit, Orbit, Paintbrush 
} from 'lucide-react';

const footerSections = [
  {
    title: 'Services & Platforms',
    items: [
      { name: 'Pollinations.ai', icon: <BrainCircuit size={16} />, url: 'https://pollinations.ai/' },
      { name: 'Google', icon: <Power size={16} />, url: 'https://www.google.com' },
      { name: 'Vercel', icon: <Server size={16} />, url: 'https://vercel.com/' },
      { name: 'Cloudflare', icon: <Cloud size={16} />, url: 'https://www.cloudflare.com/' },
      // --- PERUBAHAN DI SINI ---
      { name: 'GitHub', icon: <img src="/github-icon.svg" alt="GitHub icon" className="w-4 h-4" />, url: 'https://github.com/' },
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
      
      <div className="text-center mt-12">
        <h4 className="font-semibold text-base mb-2">Ucapan Terima Kasih</h4>
        <p className="opacity-80 max-w-2xl mx-auto">
          Aplikasi ini tidak akan terwujud tanpa komunitas <i>open-source</i> yang luar biasa. Terima kasih kepada semua pengembang dan kontributor yang karyanya telah membantu proyek ini.
        </p>
        <p className="mt-4">
          <a 
            href="https://github.com/ruangriung/ai-image-generator" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-2 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {/* --- PERUBAHAN DI SINI --- */}
            <img src="/github-icon.svg" alt="GitHub icon" className="w-4 h-4" /> Beri Bintang di GitHub
          </a>
        </p>
      </div>

      <div className="text-center mt-12 pt-8 border-t border-gray-500/20 opacity-70">
        <p>&copy; {new Date().getFullYear()} RuangRiung AI Image Generator - Developed with ❤️ by{' '}
          <a href="https://ariftirtana.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Arif Tirtana
          </a>
        </p>
      </div>
    </footer>
  );
}