// File: app/privacy/page.js

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Kebijakan Privasi</h1>
          <p className="text-sm opacity-70 mt-2">Terakhir diperbarui: 9 Juli 2025</p>
        </header>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Pendahuluan</h2>
            <p>Selamat datang di RuangRiung AI Generator. Kami menghargai privasi Anda dan berkomitmen untuk melindunginya. Kebijakan Privasi ini menjelaskan jenis informasi yang kami kumpulkan dari Anda atau yang Anda berikan saat mengunjungi situs web kami, dan praktik kami untuk mengumpulkan, menggunakan, memelihara, melindungi, dan mengungkapkan informasi tersebut.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan beberapa jenis informasi, termasuk:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
              <li><strong>Informasi yang Anda Berikan:</strong> Saat Anda mendaftar atau login menggunakan Google atau Facebook, kami menerima informasi profil dasar Anda seperti nama, alamat email, dan gambar profil.</li>
              <li><strong>Data Penggunaan Lokal:</strong> Kami menyimpan data aplikasi Anda (seperti riwayat prompt, prompt favorit, dan kunci API) secara lokal di browser Anda menggunakan Local Storage. Data ini tidak diunggah ke server kami.</li>
              <li><strong>Informasi Kontak:</strong> Jika Anda menghubungi kami melalui formulir kontak, kami mengumpulkan nama, email, dan isi pesan Anda untuk tujuan merespons pertanyaan Anda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
              <li>Menyediakan, mengoperasikan, dan memelihara layanan kami.</li>
              <li>Memersonalisasi pengalaman Anda, seperti menampilkan nama dan foto profil Anda.</li>
              <li>Memungkinkan Anda mengakses fitur yang memerlukan autentikasi, seperti tab Video dan Audio.</li>
              <li>Merespons pertanyaan dan memberikan dukungan pelanggan.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Penyimpanan dan Keamanan Data</h2>
            <p>Data fungsional aplikasi seperti riwayat generasi, favorit, dan kunci API disimpan di perangkat Anda sendiri (browser Local Storage). Kami tidak memiliki akses ke data ini. Anda memiliki kontrol penuh dan dapat menghapusnya kapan saja melalui fitur "Reset Semua Data Aplikasi" atau dengan membersihkan data situs dari pengaturan browser Anda.</p>
            <p className="mt-2">Informasi profil yang diterima dari Google/Facebook hanya digunakan untuk keperluan autentikasi dan tidak dibagikan kepada pihak ketiga.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Penghapusan Data</h2>
            <p>Anda dapat meminta penghapusan data akun Anda yang terkait dengan autentikasi Google/Facebook dari sistem kami. Silakan kunjungi halaman <Link href="/data-deletion" className="text-indigo-400 hover:underline">Instruksi Penghapusan Data</Link> kami untuk panduan lengkap.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Perubahan pada Kebijakan Privasi Kami</h2>
            <p>Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan.</p>
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