"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sun, Moon, Copy, Settings, X, Wand2, RefreshCw, ChevronsRight } from 'lucide-react';

// Helper component for Neumorphic Buttons
const NeumorphicButton = ({ children, onClick, className = '', as = 'button', ...props }) => {
  const Component = as;
  return (
    <Component
      onClick={onClick}
      className={`p-3 rounded-xl transition-all duration-200 focus:outline-none ${className}`}
      style={{
        background: 'var(--bg-color)',
        boxShadow: 'var(--shadow-outset)',
      }}
      onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-inset)'}
      onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-outset)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-outset)'}
      {...props}
    >
      {children}
    </Component>
  );
};

// Main App Component
export default function AIImageGenerator() {
  // --- STATE MANAGEMENT ---
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [quality, setQuality] = useState('hd');
  const [sizePreset, setSizePreset] = useState('1024x1024');
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [seed, setSeed] = useState('');
  const [batchSize, setBatchSize] = useState(1);
  
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [modelRequiringKey, setModelRequiringKey] = useState(null);
  
  const [analyzedPrompt, setAnalyzedPrompt] = useState('');
  const [imageForAnalysis, setImageForAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);

  // --- DERIVED STATE ---
  const { width, height } = useMemo(() => {
    if (useCustomSize) {
      return { width: customWidth, height: customHeight };
    }
    const [w, h] = sizePreset.split('x').map(Number);
    return { width: w, height: h };
  }, [useCustomSize, customWidth, customHeight, sizePreset]);

  // --- EFFECTS ---

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('aiImageGeneratorState');
      if (savedState) {
        const state = JSON.parse(savedState);
        setPrompt(state.prompt || '');
        setModel(state.model || 'flux');
        setQuality(state.quality || 'hd');
        setSizePreset(state.sizePreset || '1024x1024');
        setCustomWidth(state.customWidth || 1024);
        setCustomHeight(state.customHeight || 1024);
        setUseCustomSize(state.useCustomSize || false);
        setEnhancePrompt(state.enhancePrompt ?? true);
        setBatchSize(state.batchSize || 1);
        setSeed(state.seed || '');
        setApiKey(state.apiKey || '');
      }
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        prompt, model, quality, sizePreset, customWidth, customHeight, 
        useCustomSize, enhancePrompt, batchSize, seed, apiKey,
      };
      localStorage.setItem('aiImageGeneratorState', JSON.stringify(stateToSave));
    } catch (e) {
        console.error("Failed to save state to localStorage", e);
    }
  }, [prompt, model, quality, sizePreset, customWidth, customHeight, useCustomSize, enhancePrompt, batchSize, seed, apiKey]);

  // Handle dark mode toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // --- HANDLERS ---
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    if (newModel === 'dalle3' || newModel === 'stability') {
      setModelRequiringKey(newModel);
      setTempApiKey(apiKey);
      setIsModalOpen(true);
    } else {
      setModel(newModel);
    }
  };

  const handleApiKeySubmit = () => {
    setApiKey(tempApiKey);
    setModel(modelRequiringKey);
    setIsModalOpen(false);
    setModelRequiringKey(null);
  };
  
  const handleModalClose = () => {
      setIsModalOpen(false);
      setModelRequiringKey(null);
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Prompt tidak boleh kosong.');
      return;
    }
    if ((model === 'dalle3' || model === 'stability') && !apiKey) {
      setError(`API Key diperlukan untuk model ${model}. Silakan pilih model lagi untuk memasukkan kunci.`);
      setModel('flux');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    
    const imagePromises = Array.from({ length: batchSize }, (_, i) => {
        const currentSeed = seed || Math.floor(Math.random() * 1000000000);
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        url += `?model=${model}&width=${width}&height=${height}&quality=${quality}`;
        url += `&seed=${currentSeed}&enhance=${enhancePrompt}&nologo=true&safe=false`;

        if ((model === 'dalle3' || model === 'stability') && apiKey) {
            url += `&apikey=${apiKey}`;
        }
        
        return fetch(url).then(res => {
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                     throw new Error(`API Key tidak valid atau ditolak untuk model ${model}. Kembali ke model default.`);
                }
                throw new Error(`Gagal membuat gambar (status: ${res.status})`);
            }
            return { url: res.url, seed: currentSeed };
        });
    });

    try {
        const results = await Promise.all(imagePromises);
        setGeneratedImages(results);
    } catch (err) {
        console.error(err);
        setError(err.message);
        if (err.message.includes('API Key tidak valid')) {
            setModel('flux');
        }
    } finally {
        setLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
      if (!imageForAnalysis) {
          setError("Silakan pilih file gambar untuk dianalisis.");
          return;
      }
      setIsAnalyzing(true);
      setError(null);
      setAnalyzedPrompt('');

      const reader = new FileReader();
      reader.readAsDataURL(imageForAnalysis);
      reader.onload = async () => {
          try {
              const base64Image = reader.result.split(',')[1];
              const imageFormat = imageForAnalysis.type.split('/')[1] || 'jpeg';
              
              const payload = {
                  model: "openai",
                  messages: [{
                      role: "user",
                      content: [
                          { type: "text", text: "Describe this image in detail for an AI image generation prompt." },
                          { type: "image_url", image_url: { url: `data:image/${imageFormat};base64,${base64Image}` } }
                      ]
                  }],
                  max_tokens: 500
              };

              const response = await fetch("https://text.pollinations.ai/openai", {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });

              if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Gagal menganalisis gambar: ${response.status} ${errorText}`);
              }

              const result = await response.json();
              const description = result?.choices?.[0]?.message?.content;
              if (description) {
                  setAnalyzedPrompt(description);
              } else {
                  throw new Error("Tidak ada deskripsi yang diterima dari API.");
              }
          } catch (err) {
              console.error(err);
              setError(err.message);
          } finally {
              setIsAnalyzing(false);
          }
      };
      reader.onerror = (error) => {
          console.error("File reading error:", error);
          setError("Gagal membaca file gambar.");
          setIsAnalyzing(false);
      };
  };

  const handleReset = () => {
    setPrompt(''); setModel('flux'); setQuality('hd'); setSizePreset('1024x1024');
    setCustomWidth(1024); setCustomHeight(1024); setUseCustomSize(false);
    setEnhancePrompt(true); setBatchSize(1); setSeed(''); setGeneratedImages([]);
    setError(null); setAnalyzedPrompt(''); setImageForAnalysis(null);
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert("Prompt disalin ke clipboard!");
    }).catch(err => console.error('Gagal menyalin teks: ', err));
  };

  return (
    <div className={`min-h-screen text-neu-text transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <style jsx global>{`
        :root {
          --bg-color: #e0e0e0; --text-color: #313131;
          --shadow-light: #ffffff; --shadow-dark: #bebebe;
          --shadow-outset: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
          --shadow-inset: inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light);
        }
        .dark {
          --bg-color: #3a3a3a; --text-color: #e0e0e0;
          --shadow-light: #464646; --shadow-dark: #2e2e2e;
        }
        .neumorphic-input, .neumorphic-select {
          background: var(--bg-color); box-shadow: var(--shadow-inset);
          border: none; color: var(--text-color);
        }
        .neumorphic-input:focus, .neumorphic-select:focus { outline: none; }
      `}</style>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Masukkan API Key untuk {modelRequiringKey?.toUpperCase()}</h2>
                <NeumorphicButton onClick={handleModalClose} className="!p-2"><X size={20} /></NeumorphicButton>
            </div>
            <p className="mb-4 text-sm">Model <b>{modelRequiringKey}</b> memerlukan API key dari penyedia layanan masing-masing untuk berfungsi.</p>
            <input type="password" value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder="Masukkan API Key Anda di sini" className="w-full p-3 rounded-lg neumorphic-input mb-4"/>
            <div className="flex justify-end gap-4">
              <NeumorphicButton onClick={handleModalClose}>Batal</NeumorphicButton>
              <NeumorphicButton onClick={handleApiKeySubmit} className="font-bold">Simpan & Gunakan</NeumorphicButton>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">AI Image Generator</h1>
          <NeumorphicButton onClick={() => setDarkMode(!darkMode)} className="!p-3">
            {darkMode ? <Sun /> : <Moon />}
          </NeumorphicButton>
        </header>

        {/* --- MAIN LAYOUT GRID (12 Columns on Large Screen) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- CONTROL PANEL (LEFT - 4 Columns on Large Screen) --- */}
          <div className="lg:col-span-4 space-y-6 p-6 rounded-2xl h-fit" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
            <h2 className="text-2xl font-bold flex items-center gap-2"><Settings size={24}/> Pengaturan</h2>
            
            <div>
              <label className="font-semibold block mb-2">Prompt</label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="cth: seekor kucing astronot di bulan, 4k" className="w-full p-3 rounded-lg neumorphic-input h-32 resize-none"/>
            </div>
            
            <div>
              <label className="font-semibold block mb-2">Model</label>
              <select value={model} onChange={handleModelChange} className="w-full p-3 rounded-lg neumorphic-select">
                <option value="flux">Flux</option> <option value="turbo">Turbo</option>
                <option value="dalle3">DALL-E 3 (Perlu API Key)</option> <option value="stability">Stability (Perlu API Key)</option>
              </select>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold">Ukuran Gambar</label>
                    <button onClick={() => setUseCustomSize(!useCustomSize)} className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity">
                        {useCustomSize ? 'Gunakan Preset' : 'Ukuran Kustom'}
                    </button>
                </div>
                {!useCustomSize ? (
                    <select value={sizePreset} onChange={(e) => setSizePreset(e.target.value)} className="w-full p-3 rounded-lg neumorphic-select">
                        <option value="1024x1024">1024x1024 (Persegi)</option> <option value="1024x1792">1024x1792 (Potret)</option> <option value="1792x1024">1792x1024 (Lanskap)</option>
                    </select>
                ) : (
                    <div className="space-y-3 p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}>
                        <div>
                            <label className="text-sm">Width: {customWidth}px</label>
                            <input type="range" min="256" max="2048" step="64" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-full"/>
                        </div>
                        <div>
                            <label className="text-sm">Height: {customHeight}px</label>
                            <input type="range" min="256" max="2048" step="64" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="w-full"/>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold block mb-2">Kualitas</label>
                    <select value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 rounded-lg neumorphic-select">
                        <option value="standard">Standard</option> <option value="hd">HD</option> <option value="ultra">Ultra</option>
                    </select>
                </div>
                <div>
                    <label className="font-semibold block mb-2">Batch</label>
                    <input type="number" min="1" max="10" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full p-3 rounded-lg neumorphic-input" />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                    <label className="font-semibold block mb-2">Seed</label>
                    <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Acak" className="w-full p-3 rounded-lg neumorphic-input" />
                </div>
                <NeumorphicButton onClick={() => setEnhancePrompt(!enhancePrompt)} className={`w-full flex items-center justify-center gap-2 ${enhancePrompt ? 'font-bold' : ''}`} style={enhancePrompt ? {boxShadow: 'var(--shadow-inset)'} : {}}>
                    <Wand2 size={16}/> Enhance
                </NeumorphicButton>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-[var(--shadow-dark)]">
                <h3 className="font-bold text-lg">Analisis Gambar jadi Prompt</h3>
                <input type="file" accept="image/*" onChange={(e) => setImageForAnalysis(e.target.files[0])} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-color)] file:text-[var(--text-color)] file:shadow-[var(--shadow-outset)] hover:file:opacity-80"/>
                <NeumorphicButton onClick={handleAnalyzeImage} disabled={!imageForAnalysis || isAnalyzing} className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isAnalyzing ? "Menganalisis..." : <><ChevronsRight size={16}/> Analisis & Buat Prompt</>}
                </NeumorphicButton>
                {analyzedPrompt && (
                    <div className="p-3 rounded-lg space-y-2" style={{boxShadow: 'var(--shadow-inset)'}}>
                        <p className="text-sm italic">{analyzedPrompt}</p>
                        <div className="flex gap-2">
                           <NeumorphicButton onClick={() => { setPrompt(analyzedPrompt); }} className="text-xs !p-2">Gunakan</NeumorphicButton>
                           <NeumorphicButton onClick={() => copyToClipboard(analyzedPrompt)} className="text-xs !p-2"><Copy size={14}/></NeumorphicButton>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-[var(--shadow-dark)] flex flex-col space-y-3">
              <NeumorphicButton onClick={handleGenerate} disabled={loading} className="w-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Generating...' : 'Generate Image'}
              </NeumorphicButton>
              <NeumorphicButton onClick={handleReset} className="w-full flex items-center justify-center gap-2">
                <RefreshCw size={16}/> Reset
              </NeumorphicButton>
            </div>
          </div>

          {/* --- IMAGE DISPLAY (RIGHT - 8 Columns on Large Screen) --- */}
          <div className="lg:col-span-8 p-6 rounded-2xl min-h-[70vh] flex flex-col justify-center items-center" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
            {loading && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--text-color)]"></div>
                <p>Sedang membuat gambar...</p>
              </div>
            )}

            {error && (
              <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <h3 className="font-bold">Terjadi Kesalahan</h3>
                <p>{error}</p>
              </div>
            )}
            
            {!loading && !error && generatedImages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <h2 className="text-2xl font-bold">Selamat Datang!</h2>
                    <p>Gambar yang Anda buat akan muncul di sini.</p>
                </div>
            )}

            {!loading && generatedImages.length > 0 && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {generatedImages.map((img, index) => (
                        <div key={index} className="rounded-xl p-2 space-y-2" style={{boxShadow: 'var(--shadow-outset)'}}>
                            <img src={img.url} alt={`Generated image from prompt: ${prompt}`} className="w-full h-auto rounded-lg object-contain" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1024x1024/e0e0e0/777?text=Gagal+Muat"; }}/>
                            <p className="text-xs text-center opacity-60">Seed: {img.seed}</p>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}