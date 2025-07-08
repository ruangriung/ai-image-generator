// File: app/AssistantToggleButton.js

"use client";

import { MessageSquare } from 'lucide-react';
import { NeumorphicButton } from './components.js';

export default function AssistantToggleButton() {
  const handleToggle = () => {
    if (window.rrAssistantInstance && typeof window.rrAssistantInstance.toggleChat === 'function') {
      window.rrAssistantInstance.toggleChat();
    } else {
      console.warn('RR Assistant is not available.');
    }
  };

  return (
    <NeumorphicButton onClick={handleToggle} className="w-full text-sm">
      <MessageSquare size={16} /> RR Assistant
    </NeumorphicButton>
  );
}