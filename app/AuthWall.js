// File: app/AuthWall.js

"use client";

import { signIn } from 'next-auth/react';
import { NeumorphicButton } from './components.js';
import { LogIn } from 'lucide-react';

export default function AuthWall({ title, message }) {
  return (
    <div className="p-8 rounded-2xl w-full text-center neumorphic-card animate-fade-in">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="mb-6 opacity-70">{message}</p>
      <NeumorphicButton 
        onClick={() => signIn('google')} 
        className="font-bold w-full max-w-xs mx-auto"
      >
        <LogIn size={18}/> Lanjut dengan Google
      </NeumorphicButton>
    </div>
  );
}