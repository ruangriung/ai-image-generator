// File: app/terms/page.js

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Ketentuan Layanan</h1>
          <p className="text-sm opacity-70 mt-2">Terakhir diperbarui: 9 Juli 2025</p>
        </header>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Penerimaan Ketentuan</h2>
            <p>Dengan mengakses dan menggunakan RuangRiung AI Generator ("Layanan"), Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan Layanan.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Penggunaan Layanan</h2>
            <p>Anda setuju untuk menggunakan Layanan hanya untuk tujuan yang sah dan sesuai dengan semua hukum yang berlaku. Anda bertanggung jawab penuh atas konten (prompt) yang Anda masukkan dan gambar yang Anda hasilkan.</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
              <li>Anda tidak boleh menggunakan Layanan untuk membuat konten yang melanggar hukum, berbahaya, mengancam, melecehkan, memfitnah, atau cabul.</li>
              <li>Penggunaan model "Turbo" dan model lain yang memerlukan kunci API pribadi adalah tanggung jawab Anda sepenuhnya. Kami tidak bertanggung jawab atas konten yang dihasilkan oleh model-model ini.</li>
              <li>Kami menyediakan "koin" gratis setiap hari untuk penggunaan wajar. Upaya untuk memanipulasi atau mengeksploitasi sistem koin dilarang.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Kepemilikan Intelektual</h2>
            <p>Anda memiliki hak atas gambar yang Anda hasilkan menggunakan Layanan, sesuai dengan ketentuan layanan dari penyedia model AI yang mendasarinya (misalnya, Pollinations.ai, OpenAI). Layanan itu sendiri, termasuk antarmuka, kode, dan merek "RuangRiung", adalah milik kami.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Batasan Tanggung Jawab</h2>
            <p>Layanan ini disediakan "sebagaimana adanya" tanpa jaminan apa pun. Kami tidak menjamin bahwa Layanan akan selalu tersedia, tidak terganggu, atau bebas dari kesalahan. Sejauh diizinkan oleh hukum, kami tidak akan bertanggung jawab atas kerusakan tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan Anda atas Layanan.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Penghentian</h2>
            <p>Kami berhak untuk menangguhkan atau menghentikan akses Anda ke Layanan kapan saja, tanpa pemberitahuan sebelumnya, jika Anda melanggar Ketentuan Layanan ini.</p>
          </section>

           <section>
            <h2 className="text-2xl font-semibold mb-3">6. Perubahan Ketentuan</h2>
            <p>Kami dapat mengubah Ketentuan ini dari waktu ke waktu. Jika kami melakukan perubahan, kami akan memberi tahu Anda dengan merevisi tanggal di bagian atas halaman ini. Penggunaan Layanan secara berkelanjutan setelah perubahan tersebut merupakan penerimaan Anda terhadap Ketentuan yang baru.</p>
          </section>
        </div>

        <div className="text-center mt-12">
            <Link href="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              &larr; Kembali ke Halaman Utama
            </Link>
        </div>
      </div>
    </div>
  );
}