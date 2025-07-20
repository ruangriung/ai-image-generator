// File: app/blog/[slug]/page.js
import { getPostData, getAllPostIds } from '../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(p => ({ slug: p.params.slug }));
}

export default async function Post({ params }) {
  const postData = await getPostData(params.slug);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
        <article 
          className="p-6 sm:p-8 rounded-2xl neumorphic-card border border-[var(--shadow-dark)]/50"
        >
          <header className="mb-8 text-center border-b border-gray-500/20 pb-6">
            <h1 className="text-4xl font-bold mb-3">{postData.title}</h1>
            <div className="text-sm opacity-70">
                <span>
                  {`${new Date(postData.date).toLocaleDateString('id-ID', { dateStyle: 'long' })} - pukul ${new Date(postData.date).toLocaleTimeString('id-ID', { timeStyle: 'short' })}`}
                </span>
                <span className="mx-2">•</span>
                <span>Oleh {postData.author}</span>
              </div>
          </header>

          <div
            className="prose-styles"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />

        </article>
        
        <div className="text-center mt-12">
          <Link href="/blog" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            &larr; Kembali ke Daftar Artikel
          </Link>
        </div>
      </div>
    </div>
  );
}