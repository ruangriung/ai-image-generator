// File: app/blog/page.js

import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';
import { NeumorphicButton } from '../components'; // Impor tombol kustom Anda
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Impor ikon

// Atur berapa banyak post yang ingin ditampilkan per halaman
const POSTS_PER_PAGE = 4;

export default function Blog({ searchParams }) {
  const allPostsData = getSortedPostsData();

  // Ambil nomor halaman dari URL, default ke halaman 1 jika tidak ada
  const currentPage = Number(searchParams?.page) || 1;

  // Hitung total halaman yang dibutuhkan
  const totalPages = Math.ceil(allPostsData.length / POSTS_PER_PAGE);

  // Potong array semua post untuk mendapatkan post di halaman saat ini saja
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = allPostsData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Blog RuangRiung AI</h1>
          <p className="text-lg opacity-80 mt-2">Tutorial, berita, dan inspirasi seputar AI generatif.</p>
        </header>

        <section className="space-y-8 min-h-[400px]">
          {currentPosts.length > 0 ? (
            currentPosts.map(({ id, date, title, author }) => (
            <article 
              key={id} 
              className="p-6 rounded-2xl neumorphic-card border border-[var(--shadow-dark)]/50"
            >
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${id}`} className="hover:text-indigo-400 transition-colors">
                  {title}
                </Link>
              </h2>
              <div className="text-sm opacity-70 mb-4">
                <span>
                  {`${new Date(date).toLocaleDateString('id-ID', { dateStyle: 'long' })} - pukul ${new Date(date).toLocaleTimeString('id-ID', { timeStyle: 'short' })}`}
                </span>
                <span className="mx-2">•</span>
                <span>Oleh {author}</span>
              </div>
              <Link href={`/blog/${id}`} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Baca Selengkapnya &rarr;
              </Link>
            </article>
            ))
          ) : (
            <p className="text-center opacity-70">Tidak ada artikel ditemukan di halaman ini.</p>
          )}
        </section>

        {/* === BAGIAN PAGINATION BARU === */}
        <div className="flex items-center justify-between mt-12">
          <Link href={`/blog?page=${currentPage - 1}`} passHref legacyBehavior>
            <NeumorphicButton 
              as="a" 
              disabled={currentPage <= 1}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <ArrowLeft size={16} />
              Sebelumnya
            </NeumorphicButton>
          </Link>
          <span className="font-semibold text-sm opacity-80">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Link href={`/blog?page=${currentPage + 1}`} passHref legacyBehavior>
            <NeumorphicButton 
              as="a" 
              disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            >
              Selanjutnya
              <ArrowRight size={16} />
            </NeumorphicButton>
          </Link>
        </div>
        {/* === AKHIR BAGIAN PAGINATION === */}

        <div className="text-center mt-12">
            <Link href="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              &larr; Kembali ke Generator
            </Link>
        </div>
      </div>
    </div>
  );
}