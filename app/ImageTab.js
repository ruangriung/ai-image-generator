// File: app/ImageTab.js

"use client";

import { useState } from 'react';
import { Settings, Wand2, Bookmark, RefreshCw, ChevronsRight, Sparkles, Dices, Eraser, Maximize2, ChevronUp, ChevronDown } from 'lucide-react';
import { CollapsibleSection, NeumorphicButton, Spinner } from './components.js';
import AdvancedSettings from './AdvancedSettings.js';
import ImagePromptAssistant from './ImagePromptAssistant.js';
import AssistantToggleButton from './AssistantToggleButton.js';

export default function ImageTab({
  prompt, setPrompt,
  handleGenerate, loading,
  isEnhancing, handleEnhancePrompt,
  savedPrompts, setSavedPrompts,
  showToast,
  // Props untuk AdvancedSettings
  artStyle, setArtStyle, model, handleModelChange,
  quality, setQuality, sizePreset, setSizePreset,
  useCustomSize, setUseCustomSize, customWidth, setCustomWidth,
  customHeight, setCustomHeight, batchSize, setBatchSize,
  seed, setSeed, turboCountdown,
  // Props untuk Saran
  aiSuggestions, fetchAiSuggestions, isFetchingSuggestions, handleRandomPrompt,
  // Props untuk Modal
  setIsPromptModalOpen
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleClearPrompt = () => {
    setPrompt('');
    showToast('Prompt dibersihkan!', 'success');
  };
  
  const handleSavePrompt = () => {
    if (!prompt.trim()) {
      showToast('Prompt kosong tidak bisa disimpan', 'error');
      return;
    }
    if (savedPrompts.some(p => p.prompt === prompt.trim())) {
      showToast('Prompt ini sudah ada di favorit.', 'info');
      return;
    }
    setSavedPrompts(p => [{ prompt: prompt.trim(), date: new Date().toISOString() }, ...p]);
    showToast('Prompt disimpan!', 'success');
  };

  return (
    <div className='space-y-4 animate-fade-in'>
      <label htmlFor="prompt-textarea" className="font-semibold block text-xl">Prompt Gambar</label>
      <div className="relative">
        <textarea
          id="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ketik ide gambarmu di sini..."
          className="w-full p-3 rounded-lg neumorphic-input resize-none pr-10 h-28"
        />
        {prompt && (
          <button
            aria-label="Bersihkan prompt"
            onClick={handleClearPrompt}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Bersihkan Prompt"
          >
            <Eraser size={18} />
          </button>
        )}
        <button
            aria-label="Perluas prompt di modal"
            onClick={() => setIsPromptModalOpen(true)}
            className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
            title="Edit di Jendela Baru"
        >
            <Maximize2 size={18} />
        </button>
      </div>

      <CollapsibleSection title="Butuh Inspirasi?" icon={<Wand2 size={16} />}>
        <div className="space-y-2">
          <NeumorphicButton onClick={fetchAiSuggestions} disabled={isFetchingSuggestions} className="w-full text-sm !p-2">
            {isFetchingSuggestions ? <Spinner /> : <RefreshCw size={14} />}
            {isFetchingSuggestions ? 'Memuat...' : 'Muat Saran Baru'}
          </NeumorphicButton>
          {aiSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => setPrompt(suggestion)}
              className="text-xs p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-500/10 neumorphic-input"
            >
              {suggestion}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <NeumorphicButton onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full text-sm relative !p-3">
        <span className="flex items-center justify-center gap-2">
          <Settings size={16} />
          Pengaturan Lanjutan
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </NeumorphicButton>

      {isSettingsOpen && (
        <AdvancedSettings
          artStyle={artStyle} setArtStyle={setArtStyle}
          model={model} handleModelChange={handleModelChange}
          quality={quality} setQuality={setQuality}
          sizePreset={sizePreset} setSizePreset={setSizePreset}
          useCustomSize={useCustomSize} setUseCustomSize={setUseCustomSize}
          customWidth={customWidth} setCustomWidth={setCustomWidth}
          customHeight={customHeight} setCustomHeight={setCustomHeight}
          batchSize={batchSize} setBatchSize={setBatchSize}
          seed={seed} setSeed={setSeed}
          turboCountdown={turboCountdown}
        />
      )}

      <ImagePromptAssistant setPrompt={setPrompt} showToast={showToast} />

      <div className="flex flex-wrap gap-2">
        <NeumorphicButton onClick={handleRandomPrompt} className="flex-1 text-sm"><Dices size={16} />Acak</NeumorphicButton>
        <NeumorphicButton onClick={handleEnhancePrompt} loading={isEnhancing} loadingText="Memproses..." className="flex-1 text-sm"><Wand2 size={16} />Sempurnakan</NeumorphicButton>
        <NeumorphicButton onClick={handleSavePrompt} className="flex-1 text-sm"><Bookmark size={16} /> Simpan</NeumorphicButton>
      </div>
      <div className="pt-2 space-y-2">
        <AssistantToggleButton />
      </div>
      <NeumorphicButton onClick={handleGenerate} loading={loading} loadingText="Membuat..." className="w-full font-bold text-lg"><Sparkles size={18} />Generate</NeumorphicButton>
    </div>
  );
}