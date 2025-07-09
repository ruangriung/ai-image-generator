// File: app/AuthDisplay.js

"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { NeumorphicButton } from './components.js';
import { LogOut } from 'lucide-react';

export default function AuthDisplay() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-[44px] flex items-center justify-center">
        <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="space-y-3">
        <NeumorphicButton onClick={() => signIn('google')} className="w-full font-semibold">
          <img src="/google-icon.svg" alt="Google logo" className="w-5 h-5" />
          Login dengan Google
        </NeumorphicButton>
        <NeumorphicButton 
          onClick={() => signIn('facebook')} 
          className="w-full font-semibold"
        >
          {/* --- PERUBAHAN DI SINI --- */}
          <img src="/facebook-icon.svg" alt="Facebook logo" className="w-5 h-5" />
          Login dengan Facebook
        </NeumorphicButton>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex items-center justify-between p-2 rounded-lg" style={{ boxShadow: 'var(--shadow-inset)' }}>
        <div className="flex items-center gap-2">
          <img
            src={session.user.image}
            alt={session.user.name || 'User Avatar'}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-semibold truncate">{session.user.name}</span>
        </div>
        <NeumorphicButton onClick={() => signOut()} className="!p-2" title="Logout">
          <LogOut size={16} />
        </NeumorphicButton>
      </div>
    );
  }

  return null;
}