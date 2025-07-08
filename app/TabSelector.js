// File: app/TabSelector.js

"use client";

import { ImageIcon, Video, AudioLines, FlaskConical } from 'lucide-react';
import { NeumorphicButton } from './components.js';

export default function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <NeumorphicButton onClick={() => setActiveTab('image')} active={activeTab === 'image'} className="w-full">
          <ImageIcon size={16} />Gambar
        </NeumorphicButton>
        <NeumorphicButton onClick={() => setActiveTab('video')} active={activeTab === 'video'} className="w-full">
          <Video size={16} />Video
        </NeumorphicButton>
        <NeumorphicButton onClick={() => setActiveTab('audio')} active={activeTab === 'audio'} className="w-full">
          <AudioLines size={16} />Audio
        </NeumorphicButton>
      </div>
      <NeumorphicButton onClick={() => setActiveTab('lab')} active={activeTab === 'lab'} className="w-full">
        <FlaskConical size={16} />Lab
      </NeumorphicButton>
    </div>
  );
}