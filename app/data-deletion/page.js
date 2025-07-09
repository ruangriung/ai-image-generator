// File: app/data-deletion/page.js

import Link from 'next/link';

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Instruksi Penghapusan Data</h1>
          <p className="text-sm opacity-70 mt-2">Panduan untuk mengelola dan menghapus data Anda.</p>
        </header>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Data Lokal di Browser Anda</h2>
            <p>Sebagian besar data aplikasi, seperti riwayat prompt, prompt favorit, dan kunci API yang tersimpan, disimpan secara lokal di browser Anda. Kami tidak memiliki akses ke data ini.</p>
            <p className="mt-2">Anda dapat menghapus semua data ini dengan mudah melalui dua cara:</p>
            <ul className="list-decimal list-inside space-y-2 mt-4 pl-4">
              <li>
                <strong>Menggunakan Fitur Aplikasi:</strong> Di halaman utama, gulir ke bagian paling bawah dan klik tombol <strong className="text-red-500">"Reset Semua Data Aplikasi"</strong>. Tindakan ini akan menghapus semua data yang disimpan oleh aplikasi di browser Anda secara permanen.
              </li>
              <li>
                <strong>Melalui Pengaturan Browser:</strong> Anda juga dapat menghapus data situs secara manual dari menu pengaturan browser Anda (biasanya di bawah "Privasi & Keamanan" &gt; "Data Situs" atau "Cookie"). Cari data untuk domain <strong className="font-mono">{`ruangriung.my.id`}</strong> dan hapus.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Data Akun Terkait Autentikasi</h2>
            <p>Saat Anda login menggunakan Google atau Facebook, kami hanya menyimpan informasi dasar yang diperlukan untuk autentikasi (nama, email, gambar profil). Kami tidak menyimpan kata sandi Anda.</p>
            <p className="mt-2">Untuk menghapus data akun ini dari server kami, silakan ikuti langkah-langkah berikut:</p>
            <ol className="list-decimal list-inside space-y-2 mt-4 pl-4">
                <li>
                    Buka halaman <Link href="/contact" className="text-indigo-400 hover:underline">Kontak Kami</Link>.
                </li>
                <li>
                    Pastikan Anda login dengan akun yang ingin Anda hapus datanya.
                </li>
                <li>
                    Kirim pesan dengan subjek atau isi yang jelas menyatakan: <strong className="font-mono">"Permintaan Penghapusan Data Akun"</strong>.
                </li>
                <li>
                    Tim kami akan memproses permintaan Anda dan menghapus data akun Anda dari database kami dalam waktu 7 hari kerja. Kami akan mengirimkan email konfirmasi setelah proses selesai.
                </li>
            </ol>
             <p className="mt-4 text-sm opacity-80">
                <strong>Catatan:</strong> Menghapus akses aplikasi dari pengaturan akun Google atau Facebook Anda juga akan mencabut kemampuan kami untuk mengakses data Anda di masa mendatang, tetapi tidak secara otomatis menghapus data yang sudah ada di sistem kami. Untuk penghapusan penuh, silakan ikuti langkah-langkah di atas.
            </p>
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