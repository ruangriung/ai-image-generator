// File: app/contact/page.js

"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NeumorphicButton, Spinner, Toasts } from '../components.js';
import Link from 'next/link';
// Hapus LogIn dari impor jika sudah tidak ada tombol lain yang menggunakannya
import { LogOut, Send, User, Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (session) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || session.user.name,
        email: prev.email || session.user.email,
      }));
    }
  }, [session]);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengirim pesan.');
      }

      showToast('Pesan berhasil dikirim! Terima kasih.', 'success');
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="p-8 rounded-2xl w-full max-w-sm neumorphic-card">
          <h1 className="text-2xl font-bold mb-4">Eits, Tahan Dulu! ✋</h1>
          <p className="mb-6 opacity-70">Kamu perlu masuk dulu nih, biar bisa kirim pesan ke kami.</p>
          <NeumorphicButton onClick={() => signIn('google')} className="font-bold w-full">
            {/* --- BLOK YANG DIUBAH --- */}
            <img src="/google-icon.svg" alt="Google logo" className="w-5 h-5" />
            Lanjut dengan Google
            {/* --- AKHIR BLOK --- */}
          </NeumorphicButton>
        </div>
        <div className="text-center mt-8">
            <Link href="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              &larr; Kembali ke Generator
            </Link>
        </div>
      </div>
    );
  }

  return (
    // ... sisa kode tidak berubah ...
    <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Toasts toasts={toasts} />
      <div className="max-w-2xl w-full">
        <header className="flex justify-between items-center mb-8">
          <div className="w-24"></div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Hubungi Kami</h1>
            <p className="opacity-70 mt-2">Punya pertanyaan atau masukan?</p>
          </div>
          <div className="flex items-center justify-end gap-3 w-24">
              <img 
                  src={session.user.image} 
                  alt={session.user.name} 
                  className="w-10 h-10 rounded-full neumorphic-card p-1"
                  title={`Login sebagai ${session.user.name}`}
              />
              <NeumorphicButton onClick={() => signOut()} className="!p-2" title="Logout">
                  <LogOut size={18} />
              </NeumorphicButton>
          </div>
        </header>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl neumorphic-card space-y-6">
          <div>
            <label htmlFor="name" className="font-semibold mb-2 flex items-center gap-2">
              <User size={16} className="opacity-70" /> Nama
            </label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-3 rounded-lg neumorphic-input"/>
          </div>
          <div>
            <label htmlFor="email" className="font-semibold mb-2 flex items-center gap-2">
              <Mail size={16} className="opacity-70" /> Email
            </label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full p-3 rounded-lg neumorphic-input"/>
          </div>
          <div>
            <label htmlFor="message" className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare size={16} className="opacity-70" /> Pesan
            </label>
            <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows="5" required className="w-full p-3 rounded-lg neumorphic-input resize-none"></textarea>
          </div>
          <NeumorphicButton type="submit" loading={isSending} loadingText="Mengirim..." className="w-full font-bold text-lg flex items-center justify-center gap-2">
            <Send size={18} /> Kirim Pesan
          </NeumorphicButton>
        </form>
        <div className="text-center mt-8">
            <Link href="/" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              &larr; Kembali ke Generator
            </Link>
        </div>
      </div>
    </div>
  );
}