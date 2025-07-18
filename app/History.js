// File: app/History.js

"use client";

import { History, Trash2, ChevronsRight } from 'lucide-react';
// --- PERUBAHAN: Impor AdBanner ---
import { NeumorphicButton, AdBanner } from './components.js';

export default function HistorySection({
  generationHistory,
  setGenerationHistory,
  savedPrompts,
  setSavedPrompts,
  setSelectedHistoryImage,
  setGeneratedImages,
  setIsClearHistoryModalOpen,
  showToast, // Menerima showToast sebagai prop
  setPrompt, // Menerima setPrompt sebagai prop
  setSeed // Menerima setSeed sebagai prop
}) {

  // Fungsi ini sekarang berada di dalam komponen History
  const handleUsePromptAndSeed = (p, s, imgObj) => {
    setPrompt(p);
    setSeed(String(s));
    setSelectedHistoryImage(null);
    setGeneratedImages(imgObj ? [imgObj] : []);
    showToast('Prompt & Seed dimuat.', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // --- PENAMBAHAN BARU: Bungkus dengan React Fragment ---
    <>
      <div className="p-6 rounded-2xl h-fit neumorphic-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History size={20} /> Riwayat & Favorit
          </h2>
          <NeumorphicButton 
            onClick={() => setIsClearHistoryModalOpen(true)} 
            className="!p-2" 
            title="Hapus Riwayat & Favorit">
            <Trash2 size={16} />
          </NeumorphicButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-lg">Riwayat Gambar</h3>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {generationHistory.length === 0 ? (
                <p className="text-sm opacity-60">Kosong</p>
              ) : (
                generationHistory.map((h) => (
                  <div key={h.date} className="flex items-center gap-2 p-2 rounded-lg transition-all hover:bg-[var(--shadow-dark)]/20" style={{ boxShadow: 'var(--shadow-inset)' }}>
                    <img
                      src={h.url}
                      alt={h.prompt.substring(0, 30)}
                      className="w-16 h-16 rounded-md object-cover cursor-pointer flex-shrink-0"
                      onClick={() => {
                        setSelectedHistoryImage(h);
                        setGeneratedImages([]);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                    <div className="flex-grow cursor-pointer" onClick={() => handleUsePromptAndSeed(h.prompt, h.seed, h)}>
                      <p className="text-xs line-clamp-3">{h.prompt}</p>
                    </div>
                    <NeumorphicButton
                      aria-label={`Hapus riwayat untuk prompt: ${h.prompt.substring(0, 30)}...`}
                      onClick={() => setGenerationHistory(prev => prev.filter(item => item.date !== h.date))}
                      className="!p-2 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </NeumorphicButton>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">Prompt Favorit</h3>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {savedPrompts.length === 0 ? (
                <p className="text-sm opacity-60">Kosong</p>
              ) : (
                savedPrompts.map((p) => (
                  <div key={p.date} className="flex items-center gap-2 p-2 rounded-lg transition-all hover:bg-[var(--shadow-dark)]/20" style={{ boxShadow: 'var(--shadow-inset)' }}>
                    <p className="text-sm flex-grow truncate">{p.prompt}</p>
                    <NeumorphicButton onClick={() => setPrompt(p.prompt)} className="!p-1.5">
                      <ChevronsRight size={14} />
                    </NeumorphicButton>
                    <NeumorphicButton
                      aria-label={`Hapus favorit: ${p.prompt.substring(0, 30)}...`}
                      onClick={() => setSavedPrompts(prev => prev.filter(sp => sp.date !== p.date))}
                      className="!p-1.5"
                    >
                      <Trash2 size={14} />
                    </NeumorphicButton>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* --- PENAMBAHAN BARU: Menampilkan AdBanner di bawah panel --- */}
      <div className="mt-8">
        <AdBanner slotId="6897039624" />
      </div>
    </>
  );
}