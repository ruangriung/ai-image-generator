// File: app/ImagePromptAssistant.js

"use client";

import { useState } from 'react';
import { Wand2, ChevronDown, ChevronUp, Copy, ChevronsRight } from 'lucide-react';
import { CollapsibleSection, NeumorphicButton, Spinner } from './components.js';

export default function ImagePromptAssistant({ setPrompt, showToast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [promptCreator, setPromptCreator] = useState({ subject: '', details: '' });
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState('');
  const [isBuildingPrompt, setIsBuildingPrompt] = useState(false);

  const handlePromptCreatorChange = (e) => {
    const { name, value } = e.target;
    setPromptCreator(p => ({ ...p, [name]: value }));
  };

  const handleBuildImagePrompt = async () => {
    if (!promptCreator.subject.trim()) {
      showToast('Subjek tidak boleh kosong.', 'error');
      return;
    }
    setIsBuildingPrompt(true);
    setGeneratedImagePrompt('');
    try {
      const userInput = `Main subject: ${promptCreator.subject}. Additional details: ${promptCreator.details || 'None'}.`;
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          seed: Math.floor(Math.random() * 1000000),
          messages: [{
            role: 'system',
            content: 'You are a prompt engineer who creates detailed, artistic prompts for image generation. Respond only with the final prompt.'
          }, {
            role: 'user',
            content: userInput
          }]
        })
      });
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data = await res.json();
      const newPrompt = data.choices[0]?.message?.content;
      if (newPrompt) {
        setGeneratedImagePrompt(newPrompt.trim());
        showToast('Prompt gambar dikembangkan oleh AI!', 'success');
      } else {
        throw new Error('Gagal memproses respons API.');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsBuildingPrompt(false);
    }
  };

  const handleUseGeneratedPrompt = () => {
    if (generatedImagePrompt) {
      setPrompt(generatedImagePrompt);
      setGeneratedImagePrompt('');
      showToast('Prompt siap digunakan!', 'success');
      setIsOpen(false);
    }
  };

  return (
    <>
      <NeumorphicButton onClick={() => setIsOpen(!isOpen)} className="w-full text-sm relative !p-3">
        <span className="flex items-center justify-center gap-2">
          <Wand2 size={16} /> Asisten Prompt Gambar
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </NeumorphicButton>
      {isOpen && (
        <div className="p-4 rounded-lg space-y-4 animate-fade-in" style={{ boxShadow: 'var(--shadow-inset)' }}>
          <div>
            <label className="text-xs font-semibold block mb-1">Subjek Utama</label>
            <input
              id="prompt-creator-subject"
              name="subject"
              value={promptCreator.subject}
              onChange={handlePromptCreatorChange}
              placeholder="cth: seekor kucing astronot"
              className="w-full p-2 rounded-lg neumorphic-input text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Detail Tambahan</label>
            <textarea
              id="details-textarea"
              name="details"
              value={promptCreator.details}
              onChange={handlePromptCreatorChange}
              placeholder="cth: hyperrealistic, 4k"
              className="w-full p-2 rounded-lg neumorphic-input text-sm h-20 resize-none"
            />
          </div>
          <NeumorphicButton
            onClick={handleBuildImagePrompt}
            loading={isBuildingPrompt}
            loadingText="Membangun..."
            className="w-full text-sm !p-2"
          >
            Kembangkan dengan AI
          </NeumorphicButton>
          {generatedImagePrompt && (
            <div className="mt-4 pt-4 border-t border-[var(--shadow-dark)]/50 space-y-3 animate-fade-in">
              <h4 className="text-md font-semibold">Hasil Prompt dari AI:</h4>
              <div className="w-full p-3 rounded-lg text-sm" style={{ boxShadow: 'var(--shadow-inset)' }}>
                <p className="whitespace-pre-wrap">{generatedImagePrompt}</p>
              </div>
              <div className="flex gap-2">
                <NeumorphicButton onClick={() => { navigator.clipboard.writeText(generatedImagePrompt); showToast('Prompt disalin!', 'success') }} className="flex-1 !p-2 text-xs">
                  <Copy size={14} /> Salin
                </NeumorphicButton>
                <NeumorphicButton onClick={handleUseGeneratedPrompt} className="flex-1 !p-2 text-xs font-semibold">
                  <ChevronsRight size={14} /> Gunakan Prompt
                </NeumorphicButton>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}