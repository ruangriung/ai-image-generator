// File: app/Lab.js

"use client";

import { useState } from 'react';
import {
    FlaskConical, KeyRound, Eye, EyeOff, Sparkles, Upload,
    Minus, Plus, Grid, Bot, Video
} from 'lucide-react';
import { CollapsibleSection, NeumorphicButton } from './components.js';

// Komponen utama untuk seluruh fungsionalitas Lab
export default function Lab({ isAuthenticated, onAuthSuccess, showToast }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // State untuk fitur-fitur di dalam Lab
    const [upscaleFactor, setUpscaleFactor] = useState(2);
    const [faceRestore, setFaceRestore] = useState(false);
    
    const handleLogin = () => {
        if (password === process.env.NEXT_PUBLIC_LAB_ACCESS_PASSWORD) {
            onAuthSuccess(); // Panggil fungsi dari parent untuk mengubah state
        } else {
            showToast('Kata sandi salah.', 'error');
        }
    };

    // Jika belum terautentikasi, tampilkan form login
    if (!isAuthenticated) {
        return (
            <div className="animate-fade-in">
                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-red-600">
  <FlaskConical className="w-5 h-5" aria-hidden="true" />
  <span aria-label="Lab Eksperimental - Fitur dalam pengembangan">
    Lab Eksperimental
    <span 
      className="text-xs text-gray-400 uppercase ml-2"
      aria-label="Status: Dalam Pengembangan"
    >
      (Dalam Pengembangan)
    </span>
  </span>
</h3>
                <div className="p-4 rounded-lg space-y-4" style={{ boxShadow: 'var(--shadow-inset)' }}>
                    <p className="text-sm opacity-80">Fitur di dalam Lab bersifat premium dan eksperimental. Masukkan kata sandi untuk melanjutkan.</p>
                    <div>
                        <label htmlFor="lab-password-input" className="font-semibold text-sm mb-2 block">Kata Sandi Akses</label>
                        <div className="relative">
                            <input
                                id="lab-password-input"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="Masukkan kata sandi..."
                                className="w-full p-3 rounded-lg neumorphic-input pr-12"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <NeumorphicButton onClick={handleLogin} className="w-full font-bold">
                        <KeyRound size={16} /> Buka Akses
                    </NeumorphicButton>
                </div>
            </div>
        );
    }

    // Jika sudah terautentikasi, tampilkan semua fitur Lab
    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold block text-xl">Lab Eksperimental</h3>
            <p className="text-sm p-3 rounded-lg" style={{boxShadow:'var(--shadow-inset)', opacity: 0.8}}>
                Selamat datang di Lab! Fitur di sini masih dalam tahap pengembangan dan mungkin belum berfungsi sepenuhnya.
            </p>

            <CollapsibleSection title="Generate Video (Premium)" icon={<Video size={16} />} defaultOpen={true}>
                <div className="p-3 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}>
                    <p className="text-sm opacity-70">Buat video pendek dari prompt teks atau gambar. Fitur ini masih dalam tahap pengembangan.</p>
                    <textarea placeholder="Prompt untuk video..." className="w-full p-2 text-sm rounded-lg neumorphic-input" disabled />
                    <NeumorphicButton disabled className="w-full text-sm !p-2">
                        <Upload size={14}/> Unggah Gambar Awal (Opsional)
                    </NeumorphicButton>
                    <NeumorphicButton disabled className="w-full font-bold">Generate Video</NeumorphicButton>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="AI Upscaler & Face Restore" icon={<Sparkles size={16} />}>
                <div className="p-3 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}>
                    <p className="text-sm opacity-70">Tingkatkan resolusi gambar dan perbaiki wajah yang rusak.</p>
                    <NeumorphicButton disabled className="w-full text-sm !p-2">
                        <Upload size={14}/> Unggah Gambar
                    </NeumorphicButton>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">Faktor Upscale:</label>
                        <div className="flex items-center gap-2">
                            <NeumorphicButton onClick={() => setUpscaleFactor(f => Math.max(2, f-1))} disabled className="!p-1"><Minus size={14}/></NeumorphicButton>
                            <span className="font-bold">{upscaleFactor}x</span>
                            <NeumorphicButton onClick={() => setUpscaleFactor(f => Math.min(8, f+1))} disabled className="!p-1"><Plus size={14}/></NeumorphicButton>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">Perbaiki Wajah (GFPGAN)</label>
                        <button onClick={() => setFaceRestore(!faceRestore)} className={`w-12 h-6 rounded-full p-1 transition-colors ${faceRestore ? 'bg-green-500' : 'bg-gray-400'}`} disabled>
                            <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${faceRestore ? 'translate-x-6' : ''}`}></span>
                        </button>
                    </div>
                    <NeumorphicButton disabled className="w-full font-bold">Tingkatkan Kualitas</NeumorphicButton>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Prompt Matrix" icon={<Grid size={16} />}>
                <div className="p-3 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}>
                    <p className="text-sm opacity-70">Uji variasi prompt dalam format tabel. Pisahkan nilai dengan koma.</p>
                    <textarea placeholder="Prompt dasar, cth: a photo of a {x} in the style of {y}" className="w-full p-2 text-sm rounded-lg neumorphic-input" disabled />
                    <input type="text" placeholder="Sumbu X, cth: cat, dog, bird" className="w-full p-2 text-sm rounded-lg neumorphic-input" disabled />
                    <input type="text" placeholder="Sumbu Y, cth: greg rutkowski, artgerm" className="w-full p-2 text-sm rounded-lg neumorphic-input" disabled />
                    <NeumorphicButton disabled className="w-full font-bold">Buat Matrix</NeumorphicButton>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Character/Style Training (LoRa)" icon={<Bot size={16} />}>
                <div className="p-3 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}>
                    <p className="text-sm opacity-70">Latih AI dengan gaya atau karakter Anda sendiri. Unggah 10-20 gambar dengan subjek yang konsisten.</p>
                    <NeumorphicButton disabled className="w-full text-sm !p-2">
                        <Upload size={14}/> Unggah Gambar Latihan
                    </NeumorphicButton>
                    <NeumorphicButton disabled className="w-full font-bold">Mulai Training</NeumorphicButton>
                </div>
            </CollapsibleSection>
        </div>
    );
}