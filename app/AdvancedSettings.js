// File: app/AdvancedSettings.js

"use client";

import { artStyles } from './artStyles.js';

export default function AdvancedSettings({
  artStyle, setArtStyle,
  model, handleModelChange,
  availableModels, // Prop ini sekarang berisi daftar model gabungan
  quality, setQuality,
  sizePreset, setSizePreset,
  useCustomSize, setUseCustomSize,
  customWidth, setCustomWidth,
  customHeight, setCustomHeight,
  batchSize, setBatchSize,
  seed, setSeed,
  turboCountdown
}) {
  // Fungsi untuk memberi label yang lebih deskriptif pada model kustom
  const getModelLabel = (modelName) => {
    const labels = {
      flux: "Flux",
      gptimage: "GPT Image",
      turbo: "Turbo",
      dalle3: "DALL-E 3 (Perlu Key)",
      stability: "Stability (Perlu Key)",
      ideogram: "Ideogram (Perlu Key)"
    };
    return labels[modelName] || (modelName.charAt(0).toUpperCase() + modelName.slice(1));
  };

  return (
    <div className="p-4 rounded-lg space-y-4 animate-fade-in" style={{ boxShadow: 'var(--shadow-inset)' }}>
      <div>
        <label htmlFor="art-style-select" className="font-semibold block mb-2 text-sm">Gaya Seni</label>
        <select id="art-style-select" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]">
          <option value="">-- Pilih Gaya (Opsional) --</option>
          {artStyles.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="model-select" className="font-semibold block mb-2 text-sm">Model</label>
        <select 
          id="model-select" 
          value={model} 
          onChange={handleModelChange} 
          className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"
        >
          {availableModels && availableModels.length > 0 ? (
            availableModels.map(modelName => (
              <option key={modelName} value={modelName}>
                {getModelLabel(modelName)}
              </option>
            ))
          ) : (
            <option value="" disabled>Memuat model...</option>
          )}
        </select>
        {model === 'turbo' && turboCountdown && (
          <div className="text-xs text-center mt-2 p-2 rounded-lg" style={{ boxShadow: 'var(--shadow-inset)' }}>
            {turboCountdown !== "Kadaluarsa" ? (
              <span>Sisa waktu Turbo: <span className="font-mono font-bold text-green-500">{turboCountdown}</span></span>
            ) : (
              <span className="text-red-500">Sesi Turbo Kadaluarsa</span>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="quality-select" className="font-semibold block mb-2 text-sm">Kualitas</label>
        <select id="quality-select" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]">
          <option value="standard">Standard</option>
          <option value="hd">HD</option>
          <option value="ultra">Ultra</option>
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="size-preset-select" className="font-semibold text-sm">Ukuran</label>
          <button
            onClick={() => setUseCustomSize(!useCustomSize)}
            className="text-sm font-medium"
            aria-pressed={useCustomSize}
            title={useCustomSize ? 'Gunakan preset ukuran' : 'Gunakan ukuran kustom'}
          >
            {useCustomSize ? 'Ganti ke Preset' : 'Ganti ke Kustom'}
          </button>
        </div>
        {!useCustomSize ? (
          <select id="size-preset-select" value={sizePreset} onChange={(e) => setSizePreset(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]">
            <option value="1024x1024">Persegi (1024x1024)</option>
            <option value="1024x1792">Potret (1024x1792)</option>
            <option value="1792x1024">Lanskap (1792x1024)</option>
          </select>
        ) : (
          <div className="space-y-3 p-3 rounded-lg" style={{ boxShadow: 'var(--shadow-inset)' }}>
            <div>
              <label htmlFor="custom-width-input" className="text-sm">Lebar: {customWidth}px</label>
              <input id="custom-width-input" type="range" min="256" max="2048" step="64" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-full" aria-label="Lebar gambar kustom" />
            </div>
            <div>
              <label htmlFor="custom-height-input" className="text-sm">Tinggi: {customHeight}px</label>
              <input id="custom-height-input" type="range" min="256" max="2048" step="64" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="w-full" aria-label="Tinggi gambar kustom" />
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="batch-input" className="font-semibold block mb-2 text-sm">Batch</label>
          <input id="batch-input" type="number" min="1" max="10" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full p-3 rounded-lg neumorphic-input" />
        </div>
        <div>
          <label htmlFor="seed-input" className="font-semibold block mb-2 text-sm">Seed</label>
          <input id="seed-input" type="text" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Acak" className="w-full p-3 rounded-lg neumorphic-input" />
        </div>
      </div>
    </div>
  );
}