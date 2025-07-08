// File: app/Audio.js

"use client";

import { X, Sparkles, LogOut, User } from 'lucide-react'; // Tambahkan ikon User
import { signOut } from "next-auth/react";
import { NeumorphicButton } from './components.js';

export default function AudioSection({
  prompt,
  setPrompt,
  audioVoice,
  setAudioVoice,
  handleGenerate,
  loading,
  session // Terima prop session
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <label className="font-semibold block text-xl">Teks untuk Audio</label>
        
        {/* --- BLOK YANG DIMODIFIKASI --- */}
        <div className="flex items-center gap-3">
          {session?.user?.image && (
            <img
                src={session.user.image}
                alt={session.user.name || 'User Avatar'}
                className="w-8 h-8 rounded-full neumorphic-card p-0.5"
                title={`Login sebagai ${session.user.name}`}
            />
          )}
          <NeumorphicButton 
            onClick={() => signOut()} 
            className="!p-2"
            title="Logout"
          >
            <LogOut size={16} />
          </NeumorphicButton>
        </div>
        {/* --- AKHIR BLOK --- */}
      </div>

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