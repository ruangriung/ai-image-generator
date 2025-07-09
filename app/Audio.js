// File: app/Audio.js

"use client";

// Hapus signOut, LogOut, dan User dari impor
import { X, Sparkles } from 'lucide-react';
import { NeumorphicButton } from './components.js';

// Hapus prop 'session'
export default function AudioSection({
  prompt,
  setPrompt,
  audioVoice,
  setAudioVoice,
  handleGenerate,
  loading
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* --- BLOK HEADER YANG DIHAPUS/DISEDERHANKAN --- */}
      <label className="font-semibold block text-xl">Teks untuk Audio</label>
      {/* Kode untuk avatar dan tombol logout di sini sudah dihapus */}
      {/* --- AKHIR PERUBAHAN --- */}

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ketik kalimat untuk diubah jadi suara..."
          className="w-full p-3 rounded-lg neumorphic-input h-28 resize-none pr-10"
        />
        <button
          onClick={() => setPrompt('')}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Bersihkan teks"
        >
          <X size={18} />
        </button>
      </div>
      <div>
        <label htmlFor="audio-voice-select" className="font-semibold block mb-2">Pilih Suara</label>
        <select
          id="audio-voice-select"
          value={audioVoice}
          onChange={(e) => setAudioVoice(e.target.value)}
          className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"
        >
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="fable">Fable</option>
          <option value="onyx">Onyx</option>
          <option value="nova">Nova</option>
          <option value="shimmer">Shimmer</option>
        </select>
      </div>
      <NeumorphicButton
        onClick={handleGenerate}
        loading={loading}
        loadingText="Membuat..."
        className="w-full font-bold text-lg"
      >
        <Sparkles size={18} />
        Generate
      </NeumorphicButton>
    </div>
  );
}