// File: app/EventModal.js

"use client";

import { useState, useEffect } from 'react';
import { X, Gift, Trophy, Calendar, ScrollText, Share2 } from 'lucide-react';
import { NeumorphicButton } from './components.js'; //

export default function EventModal({ darkMode }) { // Tambahkan `darkMode` sebagai prop
  const [isOpen, setIsOpen] = useState(false); //

// useEffect(() => { //
//   const timer = setTimeout(() => {
//     setIsOpen(true); //
//   }, 5000); //
//
//   return () => clearTimeout(timer); //
// }, []); //

  const handleClose = () => { //
    setIsOpen(false); //
  }; //

  if (!isOpen) { //
    return null; //
  }

  // Pilih logo berdasarkan mode gelap
  const logoSrc = darkMode ? '/assets/logo-dark.webp' : '/assets/logo-light.webp';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div
        className="p-6 sm:p-8 rounded-2xl w-full max-w-3xl flex flex-col gap-4 neumorphic-card overflow-hidden"
        style={{ background: 'var(--bg-color)', maxHeight: '90vh' }}
      >
        {/* Header Modal */}
        <div className="flex-shrink-0 flex justify-between items-center pb-4 border-b border-gray-500/20">
          <h2 className="text-2xl font-bold text-indigo-400 flex items-center gap-3">
            <Gift size={28} />
            SELAMAT ULANG TAHUN RUANGRIUNG!
          </h2>
          <NeumorphicButton onClick={handleClose} className="!p-2"><X size={20} /></NeumorphicButton>
        </div>

        {/* Konten Scrollable */}
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6 text-sm sm:text-base">
          {/* Banner RuangRiung - sekarang dinamis */}
          <img
            src={logoSrc}
            alt="Logo RuangRiung"
            className="w-[830px] h-[156px] object-contain mx-auto mb-4"
          />
          <p className="text-center font-semibold">
            Mari rayakan 1 TAHUN RUANGRIUNG dengan cara yang kreatif, unik, dan penuh imajinasi!
          </p>
          <div className="text-center p-4 rounded-lg" style={{ boxShadow: 'var(--shadow-inset)'}}>
             <h3 className="font-bold text-lg text-yellow-500">TANTANGAN KARYA AI ART</h3>
             <p className="mt-2">Buatlah gambar AI dari kalimat: <strong className="text-indigo-400">1 TAHUN RUANGRIUNG</strong> dengan memadukan dua gaya seni yang berbeda!</p>
             <p className="text-xs opacity-70 mt-1">Contoh: Cyberpunk + Wayang, Glitch + Baroque, dll.</p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><Calendar size={18} /> Jadwal Event</h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Pengumpulan Karya:</strong> Rabu, 9 Juli – Sabtu, 12 Juli 2025 (ditutup 20.00 WIB)</li>
                <li><strong>Pengumuman Pemenang:</strong> Minggu, 13 Juli 2025 (pukul 19.00 WIB)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><ScrollText size={18} /> Syarat & Ketentuan</h4>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Posting karya di grup <a href="https://web.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Ruangriung AI Image</a> dan di kolom komentar postingan ini.</li>
                <li>Tuliskan 2 gaya seni yang dikombinasikan pada caption. <span className="text-xs opacity-70">(Contoh: Style art: Paper Collage + Psychedelic Colors)</span></li>
                <li>Karya wajib dihasilkan melalui <a href="https://ruangriung.my.id" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">ruangriung.my.id</a> atau <a href="https://rrai.my.id" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">rrai.my.id</a>.</li>
                <li>Simpan Screenshot (SS) prompt sebagai syarat klaim hadiah.</li>
                <li>Share postingan event dan lampirkan SS ke postingan karya Anda.</li>
                <li>Ukuran gambar: 1:1 (persegi) atau 9:16 (potret).</li>
                <li>Maksimal 2 karya per peserta.</li>
                <li>Gunakan tagar: <strong>#1tahunruangriung2025</strong></li>
                <li>Tulisan dalam gambar harus hasil generate murni, tanpa cacat.</li>
                <li>Tidak boleh mengandung unsur SARA, politik, tokoh publik, atau konten dewasa.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><Trophy size={18} /> Hadiah Pemenang</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}><strong>Juara 1:</strong> Rp150.000</div>
                    <div className="p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}><strong>Juara 2:</strong> Rp100.000</div>
                    <div className="p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}><strong>Juara 3:</strong> Rp75.000</div>
                    <div className="p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}><strong>Juara Harapan (4–6):</strong> @Rp25.000</div>
               </div>
               <p className="text-xs opacity-70 mt-2 text-center">Keputusan Juri tidak dapat diganggu gugat.</p>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex-shrink-0 text-center pt-4 mt-4 space-y-4 border-t border-gray-500/20">
          <p className="font-bold">Mari berkarya dan tunjukkan kreativitas tanpa batas!</p>
          
          <NeumorphicButton
            as="a"
            href="https://web.facebook.com/groups/1182261482811767/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs mx-auto !font-bold !text-white"
            style={{background: '#1877F2', boxShadow: '2px 2px 5px #1464c9, -2px -2px 5px #1c8aff'}}
          >
            <Share2 size={18} />
            Gabung Grup Facebook
          </NeumorphicButton>
          
          <p className="text-sm opacity-80">RUANGRIUNG adalah ruang untuk imajinasi, eksplorasi, dan ekspresi.</p>
        </div>
      </div>
    </div>
  );
}