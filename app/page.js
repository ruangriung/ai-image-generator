"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
    Sun, Moon, Settings, X, Wand2, RefreshCw, ChevronsRight, 
    ImageDown, Bookmark, Trash2, Search, Plus, Minus, History, Star, Upload,
    ChevronDown, ChevronUp, Sparkles, Image as ImageIcon, Video, Layers, DownloadCloud, Coins, Clock,
    Eye, EyeOff, Diamond, Copy, AudioLines
} from 'lucide-react';

// --- Reusable Components ---
const Spinner = () => ( <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

const NeumorphicButton = ({ children, onClick, className = '', as = 'button', loading, loadingText = "Processing...", active, ...props }) => {
  const Component = as;
  const activeStyle = active ? { boxShadow: 'var(--shadow-inset)' } : {};
  return (
    <Component onClick={onClick} disabled={loading} className={`p-3 rounded-xl transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 ${className} ${loading ? 'cursor-not-allowed' : ''}`}
      style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)', ...activeStyle }}
      onMouseDown={(e) => !loading && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-inset)')}
      onMouseUp={(e) => !loading && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-outset)')}
      onMouseLeave={(e) => !loading && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-outset)')}
      {...props}
    > {loading ? <><Spinner /> {loadingText}</> : children} </Component>
  );
};

// --- Toast Notification Component ---
const Toasts = ({toasts}) => {
    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end space-y-2">
            {toasts.map((toast) => {
                const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
                return (
                    <div key={toast.id} className={`p-4 rounded-xl text-white shadow-lg animate-fade-in-up ${colors[toast.type]}`}>
                        {toast.message}
                    </div>
                );
            })}
        </div>
    )
};


// --- Image Editor Modal ---
const ImageEditorModal = ({ image, onClose, onUsePromptAndSeed, onEnhanceFeature, onDownload }) => {
    const [zoom, setZoom] = useState(1);
    const [baseFilter, setBaseFilter] = useState('none');
    const [enhancements, setEnhancements] = useState({ sharpness: false, colorCorrection: false, noiseReduction: false });
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [watermark, setWatermark] = useState({ text: '', color: '#ffffff', size: 32, position: 'bottom-right' });
    const imageRef = useRef(null);
    const startPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => { setIsDragging(true); startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y }; };
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => { if (!isDragging) return; setPosition({ x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y }); };
    
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }, [isDragging]);
    
    const finalFilter = useMemo(() => {
        const activeFilters = [];
        if (baseFilter !== 'none') activeFilters.push(baseFilter);
        if (enhancements.sharpness) activeFilters.push('contrast(1.2) saturate(1.1)');
        if (enhancements.colorCorrection) activeFilters.push('saturate(1.3) contrast(1.05)');
        if (enhancements.noiseReduction) activeFilters.push('blur(0.3px)');
        return activeFilters.join(' ');
    }, [baseFilter, enhancements]);
    
    const handleEnhancementToggle = (key) => setEnhancements(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="p-4 rounded-2xl w-full max-w-6xl h-[90vh] flex gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}>
                <div className="flex-grow h-full overflow-hidden rounded-lg flex items-center justify-center relative neumorphic-card" style={{ boxShadow: 'var(--shadow-inset)' }}>
                    <img ref={imageRef} src={image.url} alt="Editing image" onMouseDown={handleMouseDown} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, filter: finalFilter, transition: 'filter 0.2s', cursor: isDragging ? 'grabbing' : 'grab', maxWidth: '100%', maxHeight: '100%' }} />
                </div>
                <div className="w-80 h-full flex flex-col gap-4">
                    <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Editor</h2><NeumorphicButton onClick={onClose} className="!p-2"><X size={20} /></NeumorphicButton></div>
                    <div className="flex flex-col gap-4 p-4 rounded-xl neumorphic-card flex-grow overflow-y-auto">
                        <div><label className="font-semibold text-sm">Zoom</label><div className="flex items-center gap-2 p-2 rounded-xl mt-1" style={{boxShadow: 'var(--shadow-outset)'}}><NeumorphicButton onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-full !p-2"><Minus size={16}/></NeumorphicButton><NeumorphicButton onClick={() => {setZoom(1); setPosition({x:0, y:0})}} className="w-full !p-2"><Search size={16}/></NeumorphicButton><NeumorphicButton onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="w-full !p-2"><Plus size={16}/></NeumorphicButton></div></div>
                        <div><label className="font-semibold text-sm">Filter Dasar</label><select onChange={(e) => setBaseFilter(e.target.value)} value={baseFilter} className="w-full p-3 mt-1 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="none">Normal</option><option value="grayscale(100%)">Grayscale</option><option value="sepia(100%)">Sepia</option><option value="invert(100%)">Invert</option><option value="hue-rotate(90deg)">Alien</option><option value="brightness(1.5)">Terang</option></select></div>
                        <div className="space-y-2">
                           <label className="font-semibold text-sm flex items-center gap-2"><Diamond size={16}/>AI Enhance Tools</label>
                           <NeumorphicButton active={enhancements.sharpness} onClick={() => handleEnhancementToggle('sharpness')} className="w-full text-sm !p-2">Tingkatkan Ketajaman</NeumorphicButton>
                           <NeumorphicButton active={enhancements.colorCorrection} onClick={() => handleEnhancementToggle('colorCorrection')} className="w-full text-sm !p-2">Koreksi Warna</NeumorphicButton>
                           <NeumorphicButton active={enhancements.noiseReduction} onClick={() => handleEnhancementToggle('noiseReduction')} className="w-full text-sm !p-2">Kurangi Noise</NeumorphicButton>
                           <NeumorphicButton onClick={() => onEnhanceFeature(image, 'face')} className="w-full text-sm !p-2">Sempurnakan Wajah</NeumorphicButton>
                           <NeumorphicButton onClick={() => onEnhanceFeature(image, 'background')} className="w-full text-sm !p-2">Sempurnakan Latar</NeumorphicButton>
                        </div>
                         <div className="space-y-2 pt-2 border-t border-[var(--shadow-dark)]">
                            <label className="font-semibold text-sm">Watermark / Teks</label>
                            <input type="text" value={watermark.text} onChange={(e) => setWatermark(w => ({...w, text: e.target.value}))} placeholder="Teks watermark..." className="w-full p-2 rounded-lg neumorphic-input text-sm" />
                            <div className="grid grid-cols-2 gap-2">
                                <div><label className="text-xs">Warna</label><input type="color" value={watermark.color} onChange={(e) => setWatermark(w => ({...w, color: e.target.value}))} className="w-full h-8 p-1 rounded-lg"/></div>
                                <div><label className="text-xs">Ukuran</label><input type="range" min="12" max="128" value={watermark.size} onChange={(e) => setWatermark(w => ({...w, size: Number(e.target.value)}))} className="w-full"/></div>
                            </div>
                         </div>
                        <div className="flex-grow"></div>
                        <div className="space-y-3">
                           <NeumorphicButton onClick={() => onUsePromptAndSeed(image.prompt, image.seed)} className="w-full text-sm !p-2"><Layers/>Gunakan Prompt & Seed</NeumorphicButton>
                           <NeumorphicButton onClick={() => onDownload(image, finalFilter, watermark)} className="w-full text-sm !p-2 font-bold"><ImageDown/>Unduh Gambar</NeumorphicButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function AIImageGenerator() {
  // --- STATE MANAGEMENT ---
  const [isMounted, setIsMounted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [quality, setQuality] = useState('hd');
  const [sizePreset, setSizePreset] = useState('1024x1024');
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [seed, setSeed] = useState('');
  const [batchSize, setBatchSize] = useState(1);
  const [artStyle, setArtStyle] = useState('cinematic');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [analyzedPrompt, setAnalyzedPrompt] = useState('');
  const [imageForAnalysis, setImageForAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [promptCreator, setPromptCreator] = useState({ subject: '', action: '', context: '', environment: '', lighting: '', details: '' });
  const [videoPromptCreator, setVideoPromptCreator] = useState({ scene: '', shotType: '', cameraAngle: '', cameraMovement: '', subjectAction: '', timeOfDay: '', videoStyle: '' });
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isTurboModalOpen, setIsTurboModalOpen] = useState(false);
  const [turboPassword, setTurboPassword] = useState('');
  const [turboCountdown, setTurboCountdown] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelRequiringKey, setModelRequiringKey] = useState(null);
  const [coins, setCoins] = useState(500);
  const [countdown, setCountdown] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [audioVoice, setAudioVoice] = useState('alloy');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  
  // --- DERIVED STATE ---
  const { width, height } = useMemo(() => {
    if (useCustomSize) return { width: customWidth, height: customHeight };
    const [w, h] = sizePreset.split('x').map(Number);
    return { width: w, height: h };
  }, [useCustomSize, customWidth, customHeight, sizePreset]);

  // --- EFFECTS ---
  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode') === 'true');
    try {
        const savedState = JSON.parse(localStorage.getItem('aiImageGeneratorState_v12') || '{}');
        if (savedState) {
            setPrompt(savedState.prompt || ''); setModel(savedState.model || 'flux'); setQuality(savedState.quality || 'hd'); setSizePreset(savedState.sizePreset || '1024x1024'); setApiKey(savedState.apiKey || ''); setGenerationHistory(savedState.generationHistory || []); setSavedPrompts(savedState.savedPrompts || []); setBatchSize(savedState.batchSize || 1); setSeed(savedState.seed || ''); setUseCustomSize(savedState.useCustomSize || false); setCustomWidth(savedState.customWidth || 1024); setCustomHeight(savedState.customHeight || 1024); setArtStyle(savedState.artStyle || 'cinematic');
        }
    } catch (e) { console.error("Gagal memuat state:", e); }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
        const stateToSave = { prompt, model, quality, sizePreset, apiKey, generationHistory, savedPrompts, batchSize, seed, useCustomSize, customWidth, customHeight, artStyle };
        localStorage.setItem('aiImageGeneratorState_v12', JSON.stringify(stateToSave));
        const lastReset = JSON.parse(localStorage.getItem('aiGeneratorCoinsData') || '{}').lastReset || new Date().getTime();
        localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ coins, lastReset }));
    } catch(e) { console.error("Gagal menyimpan state:", e); }
  }, [isMounted, prompt, model, quality, sizePreset, apiKey, generationHistory, savedPrompts, batchSize, seed, useCustomSize, customWidth, customHeight, artStyle, coins]);

  useEffect(() => {
    const interval = setInterval(() => {
        try {
            const savedCoinsData = JSON.parse(localStorage.getItem('aiGeneratorCoinsData') || '{}');
            const lastReset = savedCoinsData.lastReset || 0;
            const nextReset = lastReset + 24 * 60 * 60 * 1000;
            const now = new Date().getTime();
            const difference = nextReset - now;
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setCountdown("00:00:00");
                setCoins(500);
                localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ coins: 500, lastReset: now }));
            }
        } catch(e) { console.error("Gagal menghitung mundur koin:", e); }
        
        try {
            const turboDataString = localStorage.getItem('turboPasswordData');
            if (turboDataString) {
                const turboData = JSON.parse(turboDataString);
                if (turboData.password && turboData.expiry) {
                    const now = new Date().getTime();
                    const difference = turboData.expiry - now;
                     if (difference > 0) {
                        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                        const minutes = Math.floor((difference / 1000 / 60) % 60);
                        const seconds = Math.floor((difference / 1000) % 60);
                        setTurboCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                     } else {
                        setTurboCountdown("Kadaluarsa");
                     }
                }
            }
        } catch(e) { console.error("Gagal menghitung mundur turbo:", e); }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);
  
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const handleAdminReset = () => { /* ... */ };
  const generateTurboPassword = () => { /* ... */ };
  const handleModelChange = (e) => { /* ... */ };
  const handleApiKeySubmit = () => { /* ... */ };
  const handleEnhancePrompt = async () => { /* ... */ };

  const handleGenerate = async () => {
    setGeneratedAudio(null); 
    setGeneratedImages([]);
    if (coins <= 0) return showToast("Koin Anda habis. Tunggu reset harian.", "error");
    if (!prompt.trim()) return showToast('Prompt tidak boleh kosong.', 'error');
    setLoading(true);

    if(activeTab === 'audio'){
        await handleGenerateAudio();
    } else {
        await handleGenerateImage();
    }
    setLoading(false);
  };
  
  const handleGenerateImage = async () => {
    const finalPrompt = `${artStyle}, ${prompt}`;
    const imagePromises = Array.from({ length: batchSize }, () => {
        const currentSeed = seed || Math.floor(Math.random() * 1000000000);
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=${model}&width=${width}&height=${height}&quality=${quality}&seed=${currentSeed}&nologo=true&safe=false`;
        if (apiKey) url += `&apikey=${apiKey}`;
        return fetch(url).then(res => {
            if (!res.ok) throw new Error(`Gagal membuat gambar (status: ${res.status})`);
            return { url: res.url, seed: currentSeed, prompt: finalPrompt, date: new Date().toISOString() };
        });
    });
    try {
        const results = await Promise.all(imagePromises);
        setGeneratedImages(results);
        setGenerationHistory(prev => [...results, ...prev]);
        setCoins(c => Math.max(0, c - results.length));
        showToast(`Berhasil! Sisa koin: ${coins - results.length}`, 'success');
    } catch (err) { showToast(err.message, 'error'); console.error(err); } 
  };
  
  const handleGenerateAudio = async () => {
      setIsGeneratingAudio(true);
      try {
          const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-audio&voice=${audioVoice}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Gagal membuat audio (status: ${response.status})`);
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          setGeneratedAudio(audioUrl);
          setCoins(c => Math.max(0, c - 1));
          showToast(`Audio berhasil dibuat! Sisa koin: ${coins - 1}`, 'success');
      } catch (err) {
          showToast(err.message, 'error');
      } finally {
          setIsGeneratingAudio(false);
      }
  };

  const handleBuildImagePrompt = () => { /* ... */ };
  const handleBuildVideoPrompt = () => { /* ... */ };
  const handlePromptCreatorChange = (e, creatorType) => { /* ... */ };
  const handleAnalyzeImage = async () => { /* ... */ };
  const handleReset = () => { /* ... */ };
  const handleOpenEditor = (image) => { setEditingImage(image); setIsEditorOpen(true); };
  const handleDownload = async (image, filter, watermark) => { /* ... */ };
  const handleClearHistory = () => { /* ... */ };
  const usePromptAndSeed = (p, s) => { /* ... */ };
  const handleEnhanceFeature = async (image, feature) => { /* ... */ };

  if (!isMounted) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Spinner/></div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]`}>
        <style jsx global>{`
            :root { --bg-color: #e0e0e0; --text-color: #313131; --shadow-light: #ffffff; --shadow-dark: #bebebe; --shadow-outset: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light); --shadow-inset: inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light); }
            .dark { --bg-color: #3a3a3a; --text-color: #e0e0e0; --shadow-light: #464646; --shadow-dark: #2e2e2e; }
            .neumorphic-input, .neumorphic-select, .neumorphic-card { background: var(--bg-color); color: var(--text-color); }
            .neumorphic-card { box-shadow: var(--shadow-outset); transition: background 0.3s ease, color 0.3s ease; }
            .neumorphic-input, .neumorphic-select { box-shadow: var(--shadow-inset); border: none; }
            @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
      
        <Toasts toasts={toasts} />
        <canvas ref={canvasRef} className="hidden"></canvas>
        {isEditorOpen && <ImageEditorModal image={editingImage} onClose={() => setIsEditorOpen(false)} onUsePromptAndSeed={usePromptAndSeed} onEnhanceFeature={handleEnhanceFeature} onDownload={handleDownload} />}
        {isApiModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">API Key untuk {modelRequiringKey?.toUpperCase()}</h2><NeumorphicButton onClick={() => setIsApiModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm">Model ini memerlukan API key yang valid.</p><div className="relative w-full mb-4"><input type={showApiKey ? "text" : "password"} value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder="Masukkan API Key Anda" className="w-full p-3 rounded-lg neumorphic-input pr-12"/><button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsApiModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleApiKeySubmit} className="font-bold">Simpan</NeumorphicButton></div></div></div>}
        {isAdminModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Reset Koin Admin</h2><NeumorphicButton onClick={() => setIsAdminModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm">Masukkan password admin untuk mereset koin.</p><div className="relative w-full mb-4"><input type={showAdminPassword ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password Admin" className="w-full p-3 rounded-lg neumorphic-input pr-12"/><button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsAdminModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleAdminReset} className="font-bold">Reset</NeumorphicButton></div></div></div>}
        {isTurboModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Password Model Turbo</h2><NeumorphicButton onClick={() => setIsTurboModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm">Gunakan password ini untuk mengakses model Turbo.</p><div className="relative w-full mb-2"><input type="text" readOnly value={turboPassword} className="w-full p-3 rounded-lg neumorphic-input pr-12 font-mono"/><button type="button" onClick={() => {navigator.clipboard.writeText(turboPassword); showToast('Password disalin!', 'success')}} className="absolute inset-y-0 right-0 pr-3 flex items-center"><Copy size={20} /></button></div><p className="text-xs text-center mb-4">Berlaku selama: <span className="font-bold font-mono">{turboCountdown}</span></p><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => {setModel('turbo'); setIsTurboModalOpen(false);}} className="font-bold w-full">Gunakan Model Turbo</NeumorphicButton></div></div></div>}
        {isClearHistoryModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><h2 className="text-xl font-bold mb-4">Konfirmasi</h2><p className="mb-6">Apakah Anda yakin ingin menghapus semua riwayat dan prompt tersimpan?</p><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsClearHistoryModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleClearHistory} className="font-bold bg-red-500 text-white">Hapus</NeumorphicButton></div></div></div>}

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col gap-4 items-center text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">RuangRiung AI Image Generator</h1>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                     <div className="flex items-center gap-2 sm:gap-4 p-2 rounded-xl" style={{boxShadow: 'var(--shadow-outset)'}}>
                        <div className="flex items-center gap-2 border-r border-transparent sm:border-[var(--shadow-dark)] dark:sm:border-[var(--shadow-light)] pr-2 sm:pr-3">
                            <Coins size={20} className="text-yellow-500"/>
                            <span className="font-bold">{coins}</span>
                        </div>
                        <div className="flex items-center gap-2 border-r border-transparent sm:border-[var(--shadow-dark)] dark:sm:border-[var(--shadow-light)] pr-2 sm:pr-3">
                            <Clock size={20} className="opacity-70"/>
                            <span className="font-mono text-sm font-semibold">{countdown}</span>
                        </div>
                        <NeumorphicButton onClick={() => setIsAdminModalOpen(true)} className="!p-2"><RefreshCw size={16}/></NeumorphicButton>
                    </div>
                    <NeumorphicButton onClick={() => setDarkMode(!darkMode)} className="!p-3">{darkMode ? <Sun /> : <Moon />}</NeumorphicButton>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-2xl h-fit space-y-4 neumorphic-card">
                        <div className="flex gap-2"><NeumorphicButton onClick={() => setActiveTab('image')} active={activeTab === 'image'} className="w-full"><ImageIcon size={16}/>Gambar</NeumorphicButton><NeumorphicButton onClick={() => setActiveTab('video')} active={activeTab === 'video'} className="w-full"><Video size={16}/>Video</NeumorphicButton><NeumorphicButton onClick={() => setActiveTab('audio')} active={activeTab === 'audio'} className="w-full"><AudioLines size={16}/>Audio</NeumorphicButton></div>
                        <label className="font-semibold block text-xl">{activeTab === 'audio' ? 'Masukkan Teks' : 'Masukkan Prompt'}</label>
                        <div className="relative"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ketik di sini..." className="w-full p-3 rounded-lg neumorphic-input h-28 resize-none pr-10"/><button onClick={() => setPrompt('')} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={18}/></button></div>
                        {activeTab !== 'audio' && <NeumorphicButton onClick={() => setIsCreatorOpen(!isCreatorOpen)} className="w-full text-sm">{`Pembuat Prompt ${activeTab === 'image' ? 'Gambar' : 'Video'}`} {isCreatorOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</NeumorphicButton>}
                        {isCreatorOpen && activeTab !== 'audio' && (
                            <div className="p-4 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}>
                                {activeTab === 'image' ? (
                                    <>
                                        <div><label className="text-xs font-semibold block mb-1 flex items-center text-red-500 dark:text-red-400">Subjek (Wajib)<Star className="w-3 h-3 ml-1" fill="currentColor"/></label><input name="subject" value={promptCreator.subject} onChange={(e) => handlePromptCreatorChange(e, 'image')} placeholder="cth: seekor kucing astronot" className="w-full p-2 rounded-lg neumorphic-input text-sm" /></div>
                                        <div><label className="text-xs font-semibold block mb-1">Detail Tambahan</label><textarea name="details" value={promptCreator.details} onChange={(e) => handlePromptCreatorChange(e, 'image')} placeholder="cth: hyperrealistic, 4k" className="w-full p-2 rounded-lg neumorphic-input text-sm h-20 resize-none" /></div>
                                        <NeumorphicButton onClick={handleBuildImagePrompt} className="w-full text-sm !p-2">Buat Prompt Gambar</NeumorphicButton>
                                    </>
                                ) : (
                                    <>
                                        <div><label className="text-xs font-semibold block mb-1 flex items-center text-red-500 dark:text-red-400">Deskripsi Adegan (Wajib)<Star className="w-3 h-3 ml-1" fill="currentColor"/></label><textarea name="scene" value={videoPromptCreator.scene} onChange={(e) => handlePromptCreatorChange(e, 'video')} placeholder="cth: Hutan ajaib di malam hari" className="w-full p-2 rounded-lg neumorphic-input text-sm h-20 resize-none" /></div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><label className="text-xs font-semibold block mb-1">Aksi Subjek</label><input name="subjectAction" value={videoPromptCreator.subjectAction} onChange={(e) => handlePromptCreatorChange(e, 'video')} placeholder="cth: berlari, menari" className="w-full p-2 rounded-lg neumorphic-input text-sm"/></div>
                                            <div><label className="text-xs font-semibold block mb-1">Gaya Video</label><input name="videoStyle" value={videoPromptCreator.videoStyle} onChange={(e) => handlePromptCreatorChange(e, 'video')} placeholder="cth: rekaman drone, vhs" className="w-full p-2 rounded-lg neumorphic-input text-sm"/></div>
                                        </div>
                                        <NeumorphicButton onClick={handleBuildVideoPrompt} className="w-full text-sm !p-2">Buat Prompt Video</NeumorphicButton>
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === 'audio' && (
                            <div><label className="font-semibold block mb-2">Pilih Suara</label><select value={audioVoice} onChange={(e) => setAudioVoice(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="alloy">Alloy</option><option value="echo">Echo</option><option value="fable">Fable</option><option value="onyx">Onyx</option><option value="nova">Nova</option><option value="shimmer">Shimmer</option></select></div>
                        )}
                        <div className="flex flex-wrap gap-2"><NeumorphicButton onClick={handleEnhancePrompt} loading={isEnhancing} loadingText="Memproses..." className="flex-1 text-sm"><Wand2 size={16}/>Enhance</NeumorphicButton><NeumorphicButton onClick={() => {if (!prompt.trim()) return showToast('Prompt kosong tidak bisa disimpan', 'error'); setSavedPrompts(p=>[{prompt,date:new Date().toISOString()},...p]); showToast('Prompt disimpan!', 'success');}} className="flex-1 text-sm"><Bookmark size={16}/> Simpan</NeumorphicButton></div>
                        <NeumorphicButton onClick={handleGenerate} loading={loading} loadingText="Generating..." className="w-full font-bold text-lg"><Sparkles size={18}/>Generate</NeumorphicButton>
                    </div>
                    
                    <div className="p-6 rounded-2xl h-fit space-y-6 neumorphic-card">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Settings size={22}/> Pengaturan</h2>
                        {activeTab === 'image' && <div><label className="font-semibold block mb-2">Gaya Seni</label><select value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="photographic">Fotografi</option><option value="cinematic">Sinematik</option><option value="anime">Anime</option><option value="fantasy">Fantasi</option><option value="watercolor">Watercolor</option><option value="line_art">Line Art</option><option value="isometric">Isometric</option><option value="cyberpunk">Cyberpunk</option></select></div>}
                        {activeTab !== 'audio' && <>
                            <div><label className="font-semibold block mb-2">Model</label><select value={model} onChange={handleModelChange} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="flux">Flux</option><option value="turbo">Turbo</option><option value="dalle3">DALL-E 3 (Key)</option><option value="stability">Stability (Key)</option><option value="ideogram">Ideogram (Key)</option></select></div>
                            <div><label className="font-semibold block mb-2">Kualitas</label><select value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="standard">Standard</option><option value="hd">HD</option><option value="ultra">Ultra</option></select></div>
                            <div><div className="flex items-center justify-between mb-2"><label className="font-semibold">Ukuran</label><button onClick={() => setUseCustomSize(!useCustomSize)} className="text-sm font-medium">{useCustomSize ? 'Preset' : 'Kustom'}</button></div>{!useCustomSize ? <select value={sizePreset} onChange={(e) => setSizePreset(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="1024x1024">1024x1024</option><option value="1024x1792">1024x1792</option><option value="1792x1024">1792x1024</option></select> : <div className="space-y-3 p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}><div><label className="text-sm">Width: {customWidth}px</label><input type="range" min="256" max="2048" step="64" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-full"/></div><div><label className="text-sm">Height: {customHeight}px</label><input type="range" min="256" max="2048" step="64" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="w-full"/></div></div>}</div>
                            <div className="grid grid-cols-2 gap-4"><div><label className="font-semibold block mb-2">Batch</label><input type="number" min="1" max="10" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full p-3 rounded-lg neumorphic-input"/></div><div><label className="font-semibold block mb-2">Seed</label><input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Acak" className="w-full p-3 rounded-lg neumorphic-input"/></div></div>
                        </>}
                        <NeumorphicButton onClick={handleReset} className="w-full"><RefreshCw size={16}/> Reset Pengaturan</NeumorphicButton>
                    </div>

                    <div className="p-6 rounded-2xl h-fit space-y-4 neumorphic-card"><h3 className="font-bold text-lg">Buat Prompt dari Gambar</h3><input type="file" accept="image/*" onChange={(e) => setImageForAnalysis(e.target.files[0])} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--bg-color)] file:shadow-[var(--shadow-outset)]"/><NeumorphicButton onClick={handleAnalyzeImage} loading={isAnalyzing} loadingText="Menganalisis..." className="w-full"><Upload size={16}/>Analisis</NeumorphicButton>{analyzedPrompt && <div className="p-3 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}><p className="text-sm italic">{analyzedPrompt}</p><NeumorphicButton onClick={() => { setPrompt(analyzedPrompt); showToast("Prompt dari gambar digunakan!","success") }} className="text-xs !p-2 mt-2">Gunakan Prompt Ini</NeumorphicButton></div>}</div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                    <div className="p-6 rounded-2xl min-h-[50vh] flex flex-col justify-center items-center neumorphic-card">
                        <h2 className="text-2xl font-bold mb-4">Hasil Generasi</h2>
                        {loading && <div className="text-center"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--text-color)] mx-auto"></div><p className="mt-4">Membuat {activeTab}...</p></div>}
                        {!loading && generatedImages.length === 0 && !generatedAudio && <p className="text-gray-500">Hasil baru akan muncul di sini.</p>}
                        {!loading && generatedImages.length > 0 && <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">{generatedImages.map((img, i) => (<div key={i} className="rounded-xl p-2 space-y-2 cursor-pointer" style={{boxShadow: 'var(--shadow-outset)'}} onClick={() => handleOpenEditor(img)}><img src={img.url} className="w-full h-auto rounded-lg"/><p className="text-xs text-center opacity-60">Seed: {img.seed}</p></div>))}</div>}
                        {!loading && generatedAudio && <div className="w-full p-4 flex items-center gap-4"><audio controls src={generatedAudio} ref={audioRef} className="w-full"></audio><a href={generatedAudio} download="generated_audio.mp3"><NeumorphicButton className="!p-3"><ImageDown size={20}/></NeumorphicButton></a></div>}
                    </div>
                    <div className="p-6 rounded-2xl h-fit neumorphic-card">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-xl font-bold flex items-center gap-2"><History size={20}/> Riwayat & Prompt</h3>
                           <NeumorphicButton onClick={() => setIsClearHistoryModalOpen(true)} className="!p-2"><Trash2 size={16}/></NeumorphicButton>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 className="font-semibold mb-2">Riwayat Gambar</h4><div className="max-h-96 overflow-y-auto space-y-2 pr-2">{generationHistory.length===0?<p className="text-sm opacity-60">Kosong</p>:generationHistory.map((h,i)=>(<div key={i} className="flex gap-3 p-2 rounded-lg cursor-pointer" style={{boxShadow:'var(--shadow-inset)'}} onClick={()=>handleOpenEditor(h)}><img src={h.url} className="w-16 h-16 rounded-md object-cover"/><p className="text-xs line-clamp-3">{h.prompt}</p></div>))}</div></div><div><h4 className="font-semibold mb-2">Prompt Favorit</h4><div className="max-h-96 overflow-y-auto space-y-2 pr-2">{savedPrompts.length===0?<p className="text-sm opacity-60">Kosong</p>:savedPrompts.map((p,i)=>(<div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}><p className="text-sm flex-grow truncate">{p.prompt}</p><NeumorphicButton onClick={()=>setPrompt(p.prompt)} className="!p-1"><ChevronsRight size={14}/></NeumorphicButton><NeumorphicButton onClick={()=>setSavedPrompts(savedPrompts.filter(sp=>sp.prompt!==p.prompt))} className="!p-1"><Trash2 size={14}/></NeumorphicButton></div>))}</div></div></div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}