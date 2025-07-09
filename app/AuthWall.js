// File: app/AuthWall.js

"use client";

import { signIn } from 'next-auth/react';
import { NeumorphicButton } from './components.js';

export default function AuthWall({ title, message }) {
  return (
    <div className="p-8 rounded-2xl w-full text-center neumorphic-card animate-fade-in">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="mb-6 opacity-70">{message}</p>
      {/* --- BLOK YANG DIPERBARUI --- */}
      <div className="space-y-4 max-w-xs mx-auto">
        <NeumorphicButton 
          onClick={() => signIn('google')} 
          className="font-bold w-full"
        >
          <img src="/google-icon.svg" alt="Google logo" className="w-5 h-5" />
          Lanjut dengan Google
        </NeumorphicButton>
       {/* --- PERUBAHAN DI SINI --- */}
        <NeumorphicButton 
          onClick={() => signIn('facebook')} 
          className="font-bold w-full"
        >
           <img src="/facebook-icon.svg" alt="Facebook logo" className="w-5 h-5" />
          Lanjut dengan Facebook
        </NeumorphicButton>
      </div>
      {/* --- AKHIR BLOK --- */}
    </div>
  );
}