"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
    Sun, Moon, Settings, X, Wand2, RefreshCw, ChevronsRight, 
    ImageDown, Bookmark, Trash2, History, Star, Upload,
    ChevronDown, ChevronUp, Sparkles, Image as ImageIcon, Video, Layers, Coins, Clock,
    Eye, EyeOff, Copy, AudioLines, SlidersHorizontal, Camera, CloudSun, KeyRound, Check,
    MessageSquare, Download
} from 'lucide-react';

import { Spinner, NeumorphicButton, Toasts, ImageEditorModal, CollapsibleSection, ImageAnalysisModal } from './components.js';
import ChatbotAssistant from './ChatbotAssistant.js';

export default function AIImageGenerator() {
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
  const [isBuildingPrompt, setIsBuildingPrompt] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [promptCreator, setPromptCreator] = useState({ subject: '', details: '' });
  const [videoParams, setVideoParams] = useState({
      concept: '', visualStyle: 'cinematic', duration: 10, aspectRatio: '16:9',
      fps: 24, cameraMovement: 'static', cameraAngle: 'eye-level', lensType: 'standard',
      depthOfField: 'medium', filmGrain: 20, chromaticAberration: 10,
      colorGrading: 'neutral', timeOfDay: 'midday', weather: 'clear'
  });
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelRequiringKey, setModelRequiringKey] = useState(null);
  const [isTurboAuthModalOpen, setIsTurboAuthModalOpen] = useState(false);
  const [generatedTurboPassword, setGeneratedTurboPassword] = useState('');
  const [turboPasswordInput, setTurboPasswordInput] = useState('');
  const [turboCountdown, setTurboCountdown] = useState('');
  const [coins, setCoins] = useState(500);
  const [countdown, setCountdown] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [isMasterResetModalOpen, setIsMasterResetModalOpen] = useState(false);
  const [audioVoice, setAudioVoice] = useState('alloy');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [generatedVideoPrompt, setGeneratedVideoPrompt] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  const canvasRef = useRef(null);
  
  const { width, height } = useMemo(() => {
    if (useCustomSize) return { width: customWidth, height: customHeight };
    const [w, h] = sizePreset.split('x').map(Number);
    return { width: w, height: h };
  }, [useCustomSize, customWidth, customHeight, sizePreset]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (sessionStorage.getItem('pwaBannerClosed') !== 'true') {
        setIsBannerVisible(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    if(!isMounted) return;
    setDarkMode(localStorage.getItem('darkMode') === 'true');
    try {
        const savedState = JSON.parse(localStorage.getItem('aiImageGeneratorState_v18') || '{}');
        if (savedState) {
            setPrompt(savedState.prompt || ''); setModel(savedState.model || 'flux'); setQuality(savedState.quality || 'hd'); setSizePreset(savedState.sizePreset || '1024x1024'); setApiKey(savedState.apiKey || ''); setGenerationHistory(savedState.generationHistory || []); setSavedPrompts(savedState.savedPrompts || []); setBatchSize(savedState.batchSize || 1); setSeed(savedState.seed || ''); setUseCustomSize(savedState.useCustomSize || false); setCustomWidth(savedState.customWidth || 1024); setCustomHeight(savedState.customHeight || 1024); setArtStyle(savedState.artStyle || 'cinematic');
        }
        
        // Memuat state koin saat komponen mount
        const coinsDataString = localStorage.getItem('aiGeneratorCoinsData');
        if (coinsDataString) {
          const coinsData = JSON.parse(coinsDataString);
          setCoins(coinsData.coins ?? 500);
        }

    } catch (e) { console.error("Gagal memuat state:", e); }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
        const stateToSave = { prompt, model, quality, sizePreset, apiKey, generationHistory, savedPrompts, batchSize, seed, useCustomSize, customWidth, customHeight, artStyle };
        localStorage.setItem('aiImageGeneratorState_v18', JSON.stringify(stateToSave));
        const coinsData = JSON.parse(localStorage.getItem('aiGeneratorCoinsData') || '{}');
        localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ ...coinsData, coins }));
    } catch(e) { console.error("Gagal menyimpan state:", e); }
  }, [isMounted, prompt, model, quality, sizePreset, apiKey, generationHistory, savedPrompts, batchSize, seed, useCustomSize, customWidth, customHeight, artStyle, coins]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), duration);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const coinsDataString = localStorage.getItem('aiGeneratorCoinsData') || '{}';
        const coinsData = JSON.parse(coinsDataString);
        const lastReset = coinsData.lastReset || 0;
        const nextReset = lastReset + 24 * 60 * 60 * 1000;
        const now = new Date().getTime();
        
        if (nextReset - now < 0) {
          setCoins(500);
          localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ coins: 500, lastReset: now }));
        }
        
        const diff = nextReset - now > 0 ? nextReset - now : 0;
        setCountdown(`${String(Math.floor((diff/(1000*60*60))%24)).padStart(2,'0')}:${String(Math.floor((diff/1000/60)%60)).padStart(2,'0')}:${String(Math.floor((diff/1000)%60)).padStart(2,'0')}`);
        
        const turboDataString = localStorage.getItem('turboPasswordData');
        if(turboDataString){
            const turboData = JSON.parse(turboDataString);
            if(turboData.password && turboData.expiry){
                const turboDiff = turboData.expiry - now;
                if(turboDiff > 0){
                    setTurboCountdown(`${String(Math.floor((turboDiff/(1000*60*60))%24)).padStart(2,'0')}:${String(Math.floor((turboDiff/1000/60)%60)).padStart(2,'0')}:${String(Math.floor((diff/1000)%60)).padStart(2,'0')}`);
                } else { 
                    setTurboCountdown("Kadaluarsa"); 
                    if (model === 'turbo') {
                        setModel('flux');
                        showToast('Sesi Turbo telah berakhir.', 'info');
                    }
                }
            }
        } else {
            setTurboCountdown('');
        }
      } catch (e) { console.error("Gagal memproses timer:", e); }
    }, 1000);

    const handleScroll = () => {
        if (window.scrollY > 300) { setShowBackToTop(true); } else { setShowBackToTop(false); }
    };
    window.addEventListener('scroll', handleScroll);
    return () => { clearInterval(timer); window.removeEventListener('scroll', handleScroll); };
  }, [model, showToast]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    setInstallPrompt(null);
    setIsBannerVisible(false);
  };

  const handleBannerClose = () => {
    setIsBannerVisible(false);
    sessionStorage.setItem('pwaBannerClosed', 'true');
  };

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  
  const handleAdminReset = () => { if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) { setCoins(500); localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ coins: 500, lastReset: new Date().getTime() })); showToast('Koin berhasil direset ke 500!', 'success'); setIsAdminModalOpen(false); setAdminPassword(''); } else { showToast('Password admin salah.', 'error'); } };
  
  const handleGenerateModalPassword = () => {
      const randomChars = Array(5).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
      const newPassword = `ruangriung-${randomChars}`;
      setGeneratedTurboPassword(newPassword);
      setTurboPasswordInput('');
  };

  const handleActivateTurbo = () => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    try {
        localStorage.setItem('turboPasswordData', JSON.stringify({ password: generatedTurboPassword, expiry }));
        setModel('turbo');
        showToast('Otentikasi berhasil! Model Turbo aktif.', 'success');
        setIsTurboAuthModalOpen(false);
        setGeneratedTurboPassword('');
        setTurboPasswordInput('');
    } catch (e) {
        showToast('Gagal menyimpan dan mengaktifkan Turbo.', 'error');
    }
  };

  const handleModelChange = (e) => { 
    const selected = e.target.value; 
    if (['dalle3', 'stability', 'ideogram'].includes(selected) && !apiKey) { 
        setModelRequiringKey(selected); 
        setTempApiKey(''); 
        setIsApiModalOpen(true); 
    } else if (selected === 'turbo') {
        const turboDataString = localStorage.getItem('turboPasswordData');
        let isValid = false;
        if (turboDataString) {
          try {
            const turboData = JSON.parse(turboDataString);
            if(turboData.password && turboData.expiry > new Date().getTime()){
              isValid = true;
            }
          } catch(e) { /* ignore parse error */ }
        }
        
        if (isValid) {
            setModel('turbo');
            showToast('Model Turbo aktif dengan password tersimpan.', 'info');
        } else {
            setGeneratedTurboPassword('');
            setTurboPasswordInput('');
            setIsTurboAuthModalOpen(true);
        }
    } else { 
        setModel(selected); 
    } 
  };
  
  const handleApiKeySubmit = () => { if (tempApiKey.trim()) { setApiKey(tempApiKey); setModel(modelRequiringKey); showToast(`API Key tersimpan & model ${modelRequiringKey.toUpperCase()} dipilih.`, 'success'); setIsApiModalOpen(false); setTempApiKey(''); setModelRequiringKey(null); } else { showToast('API Key tidak boleh kosong.', 'error'); } };
  
  const handleEnhancePrompt = async () => { if (!prompt.trim()) { showToast('Prompt tidak boleh kosong.', 'error'); return; } setIsEnhancing(true); try { const res = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: 'Rewrite the user prompt to be more vivid and artistic for an AI image generator. Respond only with the enhanced prompt.' },{ role: 'user', content: prompt }] }) }); if (!res.ok) throw new Error(`API Error: ${res.statusText}`); const data = await res.json(); const enhanced = data.choices[0]?.message?.content; if (enhanced) { setPrompt(enhanced.trim()); showToast('Prompt berhasil disempurnakan!', 'success'); } else { throw new Error('Gagal memproses respons API.'); } } catch (err) { showToast(err.message, 'error'); } finally { setIsEnhancing(false); } };
  
  const handleGenerate = async () => { 
    if (coins <= 0) {
        showToast("Koin Anda habis.", "error"); 
        return; 
    }
    if (activeTab === 'video') { showToast('Gunakan tombol "Buat Prompt Video" di dalam Asisten.', 'info'); return; } 
    if (!prompt.trim()) { showToast('Prompt tidak boleh kosong.', 'error'); return; } 
    setLoading(true); 
    if (activeTab === 'image') await handleGenerateImage(); 
    else if (activeTab === 'audio') await handleGenerateAudio(); 
    setLoading(false); 
  };
  
  const handleGenerateImage = async () => { 
    setGeneratedImages([]); 
    const finalPrompt = `${artStyle}, ${prompt}`; 
    const promises = Array.from({ length: batchSize }, () => { 
        const currentSeed = seed || Math.floor(Math.random() * 1e9); 
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=${model}&width=${width}&height=${height}&quality=${quality}&seed=${currentSeed}&nologo=true&safe=false&referrer=ruangriung.my.id`; 
        if (apiKey) url += `&apikey=${apiKey}`; 
        return fetch(url).then(res => res.ok ? { url: res.url, seed: currentSeed, prompt: finalPrompt, date: new Date().toISOString() } : Promise.reject(new Error(`Gagal membuat gambar (status: ${res.status})`))); 
    }); 
    try { 
        const results = await Promise.all(promises); 
        setGeneratedImages(results); 
        setGenerationHistory(prev => [...results, ...prev]); 
        const cost = results.length;
        setCoins(c => Math.max(0, c - cost)); 
        showToast(`Berhasil! Sisa koin: ${coins - cost}`, 'success');
    } catch (err) { 
        showToast(err.message, 'error'); 
    } 
  };
  
  const handleGenerateAudio = async () => { 
    setGeneratedAudio(null); 
    try { 
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-audio&voice=${audioVoice}`); 
        if (!res.ok) throw new Error(`Gagal membuat audio (status: ${res.status})`); 
        const blob = await res.blob(); 
        setGeneratedAudio(URL.createObjectURL(blob)); 
        setCoins(c => Math.max(0, c - 1)); 
        showToast(`Audio berhasil dibuat! Sisa koin: ${coins - 1}`, 'success'); 
    } catch (err) { 
        showToast(err.message, 'error'); 
    } 
  };
  
  const handleBuildImagePrompt = async () => { if (!promptCreator.subject.trim()) { showToast('Subjek tidak boleh kosong.', 'error'); return; } setIsBuildingPrompt(true); try { const userInput = `Main subject: ${promptCreator.subject}. Additional details: ${promptCreator.details || 'None'}.`; const res = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [ { role: 'system', content: 'You are a prompt engineer who creates detailed, artistic prompts for image generation. Respond only with the final prompt.' }, { role: 'user', content: userInput }]}) }); if (!res.ok) throw new Error(`API Error: ${res.statusText}`); const data = await res.json(); const newPrompt = data.choices[0]?.message?.content; if (newPrompt) { setPrompt(newPrompt.trim()); showToast('Prompt gambar dikembangkan oleh AI!', 'success'); } else { throw new Error('Gagal memproses respons API.'); } } catch (err) { showToast(err.message, 'error'); } finally { setIsBuildingPrompt(false); } };
  
  const handleBuildVideoPrompt = async () => { if (!videoParams.concept.trim()) { showToast('Konsep utama video tidak boleh kosong.', 'error'); return; } setIsBuildingPrompt(true); setGeneratedVideoPrompt(''); const allParams = Object.entries(videoParams).map(([key, value]) => (value ? `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}` : null)).filter(Boolean).join('. '); try { const res = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [ { role: 'system', content: 'You are a professional cinematographer. Based on these parameters, write a complete, coherent, and inspiring video prompt for a text-to-video AI. Combine all elements into a natural paragraph.' }, { role: 'user', content: allParams }]}) }); if (!res.ok) throw new Error(`API Error: ${res.statusText}`); const data = await res.json(); const videoPrompt = data.choices[0]?.message?.content; if (videoPrompt) { setGeneratedVideoPrompt(videoPrompt.trim()); showToast('Prompt video profesional berhasil dibuat!', 'success'); } else { throw new Error('Gagal memproses respons API.'); } } catch (err) { showToast(err.message, 'error'); } finally { setIsBuildingPrompt(false); } };
  
  const handlePromptCreatorChange = (e, type) => { const { name, value } = e.target; if (type === 'image') setPromptCreator(p => ({ ...p, [name]: value })); };
  
  const handleVideoParamsChange = (e) => { const { name, value, type } = e.target; setVideoParams(p => ({ ...p, [name]: type === 'number' ? Number(value) : value })); };
    
  const handleMasterReset = () => {
    try {
      const coinData = localStorage.getItem('aiGeneratorCoinsData');
      const darkModePref = localStorage.getItem('darkMode');
      
      localStorage.clear();

      if (coinData) localStorage.setItem('aiGeneratorCoinsData', coinData);
      if (darkModePref) localStorage.setItem('darkMode', darkModePref);

      setPrompt(''); setModel('flux'); setQuality('hd'); setSizePreset('1024x1024'); setUseCustomSize(false); setCustomWidth(1024); setCustomHeight(1024); setSeed(''); setBatchSize(1); setArtStyle('cinematic'); setGeneratedImages([]); setLoading(false); setIsEnhancing(false); setIsBuildingPrompt(false); setApiKey(''); setGenerationHistory([]); setSavedPrompts([]); setIsEditorOpen(false); setEditingImage(null); setIsAnalysisModalOpen(false); setActiveTab('image'); setIsCreatorOpen(false); setPromptCreator({ subject: '', details: '' });
      setVideoParams({
          concept: '', visualStyle: 'cinematic', duration: 10, aspectRatio: '16:9',
          fps: 24, cameraMovement: 'static', cameraAngle: 'eye-level', lensType: 'standard',
          depthOfField: 'medium', filmGrain: 20, chromaticAberration: 10,
          colorGrading: 'neutral', timeOfDay: 'midday', weather: 'clear'
      });
      setGeneratedAudio(null);
      setGeneratedVideoPrompt('');

      showToast('Semua data aplikasi telah direset.', 'success');
      setIsMasterResetModalOpen(false);

    } catch (e) {
      console.error("Gagal mereset data:", e);
      showToast('Gagal mereset data.', 'error');
    }
  };

  const handleOpenEditor = (image) => { setEditingImage(image); setIsEditorOpen(true); };
  
  const handleDownload = (image, filter, watermark) => {
    const mainImage = new Image();
    mainImage.crossOrigin = 'anonymous';
    mainImage.src = image.url;

    mainImage.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = mainImage.width;
        canvas.height = mainImage.height;

        if (filter) ctx.filter = filter;
        ctx.drawImage(mainImage, 0, 0);
        ctx.filter = 'none';

        const finalizeDownload = () => {
            const link = document.createElement('a');
            link.download = `ruangriung-ai-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('Gambar diunduh...', 'success');
        };

        if (watermark && (watermark.text || watermark.imageUrl)) {
            ctx.globalAlpha = watermark.opacity;
            const x = (watermark.position.x / 100) * canvas.width;
            const y = (watermark.position.y / 100) * canvas.height;

            if (watermark.type === 'text' && watermark.text) {
                const fontSize = (watermark.size / 100) * (canvas.width * 0.2);
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = watermark.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(watermark.text, x, y);
                finalizeDownload();
            } else if (watermark.type === 'image' && watermark.imageUrl) {
                const wmImage = new Image();
                wmImage.crossOrigin = 'anonymous';
                wmImage.src = watermark.imageUrl;
                wmImage.onload = () => {
                    const wmWidth = (watermark.size / 100) * canvas.width;
                    const wmHeight = wmImage.height * (wmWidth / wmImage.width);
                    ctx.drawImage(wmImage, x - wmWidth / 2, y - wmHeight / 2, wmWidth, wmHeight);
                    finalizeDownload();
                };
                wmImage.onerror = () => { showToast('Gagal memuat gambar watermark.', 'error'); finalizeDownload(); };
            } else {
                finalizeDownload();
            }
        } else {
            finalizeDownload();
        }
    };
    mainImage.onerror = () => { showToast('Gagal memuat gambar utama untuk diunduh.', 'error'); };
  };
  
  const handleClearHistory = () => { setGenerationHistory([]); setSavedPrompts([]); setIsClearHistoryModalOpen(false); showToast('Semua riwayat telah dihapus.', 'success'); };
  const usePromptAndSeed = (p, s) => { setPrompt(p); setSeed(String(s)); setActiveTab('image'); setIsEditorOpen(false); showToast('Prompt & Seed dimuat.', 'success'); };
  const handleCreateVariation = (image) => { setPrompt(image.prompt); setSeed(''); setActiveTab('image'); setIsEditorOpen(false); setTimeout(() => { handleGenerateImage(); }, 100); showToast('Membuat variasi baru...', 'info'); };
  
  const visualStyleOptions = ["Cinematic", "Anime", "Photorealistic", "Watercolor", "Pixel Art", "Cyberpunk", "Retro", "Futuristic"];
  const shotTypeOptions = ["Static", "Slow Pan", "Dolly", "Tracking", "Crane", "Steadycam", "Handheld", "Drone"];
  const cameraAngleOptions = ["Eye Level", "Low Angle", "High Angle", "Dutch Angle", "Overhead", "Point of View"];
  const lensTypeOptions = ["Standard (50mm)", "Wide Angle (24mm)", "Telephoto (85mm+)", "Fisheye", "Anamorphic", "Macro"];
  const dofOptions = ["Shallow", "Medium", "Deep"];
  const timeOfDayOptions = ["Golden Hour", "Blue Hour", "Midday", "Night", "Sunrise", "Sunset", "Twilight"];
  const weatherOptions = ["Clear", "Cloudy", "Rainy", "Foggy", "Snowy", "Stormy"];
  
  if (!isMounted) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Spinner/></div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]`}>
        {isBannerVisible && (
            <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 flex items-center justify-center gap-4 z-50 shadow-lg animate-fade-in">
                <span className="text-sm md:text-base">Install aplikasi untuk akses lebih cepat!</span>
                <button onClick={handleInstallClick} className="bg-white text-blue-600 font-bold py-1 px-3 rounded-md flex items-center gap-2 text-sm hover:bg-gray-200 transition-colors">
                    <Download size={16} />
                    Install
                </button>
                <button onClick={handleBannerClose} className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 hover:text-white">
                    <X size={20} />
                </button>
            </div>
        )}

        <style jsx global>{`
            :root { --bg-color: #e0e0e0; --text-color: #313131; --shadow-light: #ffffff; --shadow-dark: #bebebe; --shadow-outset: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light); --shadow-inset: inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light); }
            .dark { --bg-color: #3a3a3a; --text-color: #e0e0e0; --shadow-light: #464646; --shadow-dark: #2e2e2e; }
            .neumorphic-input, .neumorphic-select, .neumorphic-card { background: var(--bg-color); color: var(--text-color); }
            .neumorphic-card { box-shadow: var(--shadow-outset); transition: background 0.3s ease, color 0.3s ease; }
            .neumorphic-input, .neumorphic-select { box-shadow: var(--shadow-inset); border: none; }
            @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
      
        <Toasts toasts={toasts} />
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {isEditorOpen && <ImageEditorModal image={editingImage} onClose={() => setIsEditorOpen(false)} onUsePromptAndSeed={usePromptAndSeed} onDownload={handleDownload} onCreateVariation={handleCreateVariation} showToast={showToast} />}
        {isAnalysisModalOpen && <ImageAnalysisModal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)} onPromptGenerated={(p) => { setPrompt(p); showToast("Prompt dari gambar berhasil digunakan!", "success"); setIsAnalysisModalOpen(false); }} showToast={showToast} />}
        
        {isAdminModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">Panel Admin</h2><NeumorphicButton onClick={() => setIsAdminModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm"> Masukkan password admin untuk mengakses fitur. atau hubungi Admin ruangriung di halaman <a style={{color:"#3b82f6"}} href="https://web.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener noreferrer">Facebook RuangRiung</a>.
            </p><div className="relative w-full mb-4"><input type={showAdminPassword ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password Admin" className="w-full p-3 rounded-lg neumorphic-input pr-12"/><button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="space-y-4"><NeumorphicButton onClick={handleAdminReset} className="font-bold w-full"><RefreshCw size={16}/> Reset Koin</NeumorphicButton></div></div></div>}
        
        {isClearHistoryModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><h2 className="text-xl font-bold mb-4">Konfirmasi</h2><p className="mb-6">Yakin ingin menghapus semua riwayat & favorit?</p><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsClearHistoryModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleClearHistory} className="font-bold bg-red-500 text-white">Hapus</NeumorphicButton></div></div></div>}
        {isApiModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">API Key untuk {modelRequiringKey?.toUpperCase()}</h2><NeumorphicButton onClick={() => setIsApiModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm">Model ini memerlukan API key yang valid.</p><div className="relative w-full mb-4"><input type={showApiKey ? "text" : "password"} value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder="Masukkan API Key Anda" className="w-full p-3 rounded-lg neumorphic-input pr-12"/><button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsApiModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleApiKeySubmit} className="font-bold">Simpan</NeumorphicButton></div></div></div>}
        
        {isTurboAuthModalOpen && 
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2"><KeyRound size={22}/> Akses Model Turbo</h2>
                        <NeumorphicButton onClick={() => {setModel('flux'); setIsTurboAuthModalOpen(false);}} className="!p-2"><X size={20} /></NeumorphicButton>
                    </div>

                    <div className="p-4 rounded-lg space-y-3" style={{boxShadow: 'var(--shadow-inset)'}}>
                        <div className="flex justify-between items-center">
                           <span className="font-semibold text-sm">Password Dibuat:</span>
                           <span className="font-mono text-lg font-bold text-indigo-500">{generatedTurboPassword || '---'}</span>
                        </div>
                        <NeumorphicButton onClick={handleGenerateModalPassword} className="w-full !p-2 text-sm"><RefreshCw size={14}/> Buat Password Baru</NeumorphicButton>
                    </div>

                    <div>
                        <label className="font-semibold text-sm mb-2 block">Verifikasi Password</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={turboPasswordInput} 
                                onChange={(e) => setTurboPasswordInput(e.target.value)} 
                                placeholder="Ketik atau tempel password di sini" 
                                className="w-full p-3 rounded-lg neumorphic-input pr-24"
                                disabled={!generatedTurboPassword}
                            />
                            <NeumorphicButton onClick={() => setTurboPasswordInput(generatedTurboPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 !p-2 text-xs" disabled={!generatedTurboPassword}>
                                Autofill
                            </NeumorphicButton>
                        </div>
                    </div>

                    <div className="text-xs p-3 rounded-lg space-y-2" style={{boxShadow:'var(--shadow-inset)', opacity: 0.8}}>
                         <p>Model Turbo tidak memiliki filter keamanan. Anda bertanggung jawab penuh atas konten yang dihasilkan.</p>
                         <p>Password hanya berlaku selama 24 jam.</p>
                    </div>

                    <NeumorphicButton 
                        onClick={handleActivateTurbo} 
                        className="w-full font-bold !p-3" 
                        disabled={!generatedTurboPassword || turboPasswordInput !== generatedTurboPassword}
                    >
                        <Check size={18}/> Aktifkan Turbo
                    </NeumorphicButton>
                </div>
            </div>
        }

        {isMasterResetModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><h2 className="text-xl font-bold mb-4">Konfirmasi Reset Data</h2><p className="mb-2 text-sm">Anda yakin ingin menghapus semua data aplikasi dari browser ini? Tindakan ini tidak dapat diurungkan.</p><div className="text-sm p-3 my-4 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}>Data yang akan dihapus:<ul className="list-disc list-inside mt-2 space-y-1"><li>Riwayat Generasi Gambar</li><li>Prompt Favorit</li><li>Kunci API yang Tersimpan</li><li>Password Turbo yang Tersimpan</li><li>Semua Pengaturan Pengguna</li></ul></div><div className="flex justify-end gap-4 mt-6"><NeumorphicButton onClick={() => setIsMasterResetModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleMasterReset} className="font-bold bg-red-500 text-white">Ya, Hapus Semua</NeumorphicButton></div></div></div>}
        
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 pt-20">
                <header className="flex flex-col gap-4 items-center text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2 md:gap-3">
                      <Wand2 className="text-yellow-500 h-8 w-8 md:h-9 md:w-9 flex-shrink-0" />
                      <span>RuangRiung AI Generator</span>
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                        <div className="flex items-center gap-2 sm:gap-4 p-2 rounded-xl" style={{boxShadow: 'var(--shadow-outset)'}}>
                            <div className="flex items-center gap-2 border-r border-transparent sm:border-[var(--shadow-dark)] dark:sm:border-[var(--shadow-light)] pr-2 sm:pr-3"><Coins size={20} className="text-yellow-500"/><span className="font-bold">{coins}</span></div>
                            <div className="flex items-center gap-2 pr-2 sm:pr-3"><Clock size={20} className="opacity-70"/><span className="font-mono text-sm font-semibold">{countdown}</span></div>
                            <NeumorphicButton aria-label="Buka pengaturan" onClick={() => setIsAdminModalOpen(true)} className="!p-2"><Settings size={16}/></NeumorphicButton>
                        </div>
                        <NeumorphicButton aria-label={darkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap"} onClick={() => setDarkMode(!darkMode)} className="!p-3">{darkMode ? <Sun /> : <Moon />}</NeumorphicButton>
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-2xl h-fit space-y-4 neumorphic-card">
                            <div className="flex gap-2">
                                <NeumorphicButton onClick={() => setActiveTab('image')} active={activeTab === 'image'} className="w-full"><ImageIcon size={16}/>Gambar</NeumorphicButton>
                                <NeumorphicButton onClick={() => setActiveTab('video')} active={activeTab === 'video'} className="w-full"><Video size={16}/>Video</NeumorphicButton>
                                <NeumorphicButton onClick={() => setActiveTab('audio')} active={activeTab === 'audio'} className="w-full"><AudioLines size={16}/>Audio</NeumorphicButton>
                            </div>
                            
                            {activeTab === 'image' && <div className='space-y-4'>
                                <label htmlFor="prompt-textarea" className="font-semibold block text-xl">Prompt Gambar</label>
                                <div className="relative">
                                    <textarea id="prompt-textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ketik ide gambarmu di sini..." className="w-full p-3 rounded-lg neumorphic-input h-28 resize-none pr-10"/>
                                    <button aria-label="Hapus prompt" onClick={() => setPrompt('')} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={18}/></button>
                                </div>
                                <NeumorphicButton onClick={() => setIsCreatorOpen(!isCreatorOpen)} className="w-full text-sm">{`Asisten Prompt Gambar`} {isCreatorOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</NeumorphicButton>
                                {isCreatorOpen && <div className="p-4 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}><div><label className="text-xs font-semibold block mb-1 flex items-center text-red-500 dark:text-red-400">Subjek (Wajib)<Star className="w-3 h-3 ml-1" fill="currentColor"/></label><input name="subject" value={promptCreator.subject} onChange={(e) => handlePromptCreatorChange(e, 'image')} placeholder="cth: seekor kucing astronot" className="w-full p-2 rounded-lg neumorphic-input text-sm" /></div><div><label className="text-xs font-semibold block mb-1">Detail Tambahan</label><textarea name="details" value={promptCreator.details} onChange={(e) => handlePromptCreatorChange(e, 'image')} placeholder="cth: hyperrealistic, 4k" className="w-full p-2 rounded-lg neumorphic-input text-sm h-20 resize-none" /></div><NeumorphicButton onClick={handleBuildImagePrompt} loading={isBuildingPrompt} loadingText="Membangun..." className="w-full text-sm !p-2">Kembangkan dengan AI</NeumorphicButton></div>}
                                
                                <div className="flex flex-wrap gap-2">
                                    <NeumorphicButton onClick={handleEnhancePrompt} loading={isEnhancing} loadingText="Memproses..." className="flex-1 text-sm"><Wand2 size={16}/>Sempurnakan</NeumorphicButton>
                                    <NeumorphicButton onClick={() => { if (!prompt.trim()) { showToast('Prompt kosong tidak bisa disimpan', 'error'); return; } if (savedPrompts.some(p => p.prompt === prompt.trim())) { showToast('Prompt ini sudah ada di favorit.', 'info'); return; } setSavedPrompts(p => [{prompt: prompt.trim(), date: new Date().toISOString()}, ...p]); showToast('Prompt disimpan!', 'success'); }} className="flex-1 text-sm"><Bookmark size={16}/> Simpan</NeumorphicButton>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <NeumorphicButton
                                        onClick={() => window.rrAssistantInstance?.toggleChat()}
                                        className="w-full text-sm"
                                    >
                                        <MessageSquare size={16} />
                                        RR Assistant
                                    </NeumorphicButton>
                                </div>
                                
                                <NeumorphicButton onClick={handleGenerate} loading={loading} loadingText="Membuat Gambar..." className="w-full font-bold text-lg"><Sparkles size={18}/>Generate</NeumorphicButton>
                            </div>}

                            {activeTab === 'video' && <div className="space-y-4"><label className="font-semibold block text-xl">Asisten Prompt Video</label><div><label className="text-sm font-semibold">Konsep Utama Video</label><textarea name="concept" value={videoParams.concept} onChange={handleVideoParamsChange} placeholder="Cth: Detektif cyberpunk di gang neon..." className="w-full p-3 mt-1 rounded-lg neumorphic-input h-28 resize-none"/></div><CollapsibleSection title="Basic Settings" icon={<SlidersHorizontal size={18}/>}><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-semibold">Gaya Visual</label><select name="visualStyle" value={videoParams.visualStyle} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{visualStyleOptions.map(o=><option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}</select></div><div><label className="text-sm font-semibold">Durasi (s)</label><input type="number" name="duration" value={videoParams.duration} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm"/></div><div><label className="text-sm font-semibold">Aspek Rasio</label><select name="aspectRatio" value={videoParams.aspectRatio} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{["16:9", "9:16", "1:1", "4:3", "21:9"].map(o=><option key={o} value={o}>{o}</option>)}</select></div><div><label className="text-sm font-semibold">Frame Rate</label><select name="fps" value={videoParams.fps} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{[24, 30, 60, 120].map(o=><option key={o} value={o}>{o} fps</option>)}</select></div></div></CollapsibleSection><CollapsibleSection title="Cinematography" icon={<Camera size={18}/>}><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-semibold">Gerakan Kamera</label><select name="cameraMovement" value={videoParams.cameraMovement} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{shotTypeOptions.map(o=><option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}</select></div><div><label className="text-sm font-semibold">Sudut Kamera</label><select name="cameraAngle" value={videoParams.cameraAngle} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{cameraAngleOptions.map(o=><option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}</select></div><div><label className="text-sm font-semibold">Tipe Lensa</label><select name="lensType" value={videoParams.lensType} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{lensTypeOptions.map(o=><option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}</select></div><div><label className="text-sm font-semibold">Depth of Field</label><select name="depthOfField" value={videoParams.depthOfField} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{dofOptions.map(o=><option key={o} value={o.toLowerCase()}>{o}</option>)}</select></div></div></CollapsibleSection><CollapsibleSection title="Visual Effects" icon={<Sparkles size={18}/>}><div><label className="text-sm font-semibold">Film Grain ({videoParams.filmGrain}%)</label><input type="range" name="filmGrain" value={videoParams.filmGrain} onChange={handleVideoParamsChange} min="0" max="100" className="w-full"/></div><div><label className="text-sm font-semibold">Chromatic Aberration ({videoParams.chromaticAberration}%)</label><input type="range" name="chromaticAberration" value={videoParams.chromaticAberration} onChange={handleVideoParamsChange} min="0" max="100" className="w-full"/></div></CollapsibleSection><CollapsibleSection title="Mood & Atmosphere" icon={<CloudSun size={18}/>}><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-semibold">Waktu</label><select name="timeOfDay" value={videoParams.timeOfDay} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{timeOfDayOptions.map(o=><option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}</select></div><div><label className="text-sm font-semibold">Cuaca</label><select name="weather" value={videoParams.weather} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">{weatherOptions.map(o=><option key={o} value={o.toLowerCase()}>{o}</option>)}</select></div></div></CollapsibleSection><NeumorphicButton onClick={handleBuildVideoPrompt} loading={isBuildingPrompt} loadingText="Membangun..." className="w-full !mt-6 font-bold text-lg"><Sparkles size={18}/>Buat Prompt Video</NeumorphicButton></div>}
                            {activeTab === 'audio' && <div className="space-y-4"><label className="font-semibold block text-xl">Teks untuk Audio</label><div className="relative"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ketik kalimat untuk diubah jadi suara..." className="w-full p-3 rounded-lg neumorphic-input h-28 resize-none pr-10"/><button onClick={() => setPrompt('')} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={18}/></button></div><div><label className="font-semibold block mb-2">Pilih Suara</label><select value={audioVoice} onChange={(e) => setAudioVoice(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="alloy">Alloy</option><option value="echo">Echo</option><option value="fable">Fable</option><option value="onyx">Onyx</option><option value="nova">Nova</option><option value="shimmer">Shimmer</option></select></div><NeumorphicButton onClick={handleGenerate} loading={loading} loadingText="Membuat Audio..." className="w-full font-bold text-lg"><Sparkles size={18}/>Generate</NeumorphicButton></div>}
                        </div>
                        {activeTab === 'image' && <><div className="p-6 rounded-2xl h-fit space-y-6 neumorphic-card">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Settings size={22}/> Pengaturan</h2>
                            <div>
                                <label htmlFor="art-style-select" className="font-semibold block mb-2">Gaya Seni</label>
                                <select id="art-style-select" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]">
                                    <option value="photographic">Fotografi</option>
                                    <option value="cinematic">Sinematik</option>
                                    <option value="anime">Anime</option>
                                    <option value="fantasy">Fantasi</option>
                                    <option value="watercolor">Watercolor</option>
                                    <option value="line_art">Line Art</option>
                                    <option value="isometric">Isometric</option>
                                    <option value="cyberpunk">Cyberpunk</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="model-select" className="font-semibold block mb-2">Model</label>
                                <select id="model-select" value={model} onChange={handleModelChange} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]">
                                    <option value="flux">Flux</option>
                                    <option value="turbo">Turbo (Password)</option>
                                    <option value="dalle3">DALL-E 3 (Key)</option>
                                    <option value="stability">Stability (Key)</option>
                                    <option value="ideogram">Ideogram (Key)</option>
                                </select>
                                {model === 'turbo' && turboCountdown && (
                                    <div className="text-xs text-center mt-2 p-2 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}>
                                        {turboCountdown !== "Kadaluarsa" ? (
                                            <span>Sisa waktu Turbo: <span className="font-mono font-bold text-green-500">{turboCountdown}</span></span>
                                        ) : (
                                            <span>Sesi Turbo: <span className="font-mono font-bold text-red-500">{turboCountdown}</span></span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="quality-select" className="font-semibold block mb-2">Kualitas</label>
                                <select id="quality-select" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]">
                                    <option value="standard">Standard</option>
                                    <option value="hd">HD</option>
                                    <option value="ultra">Ultra</option>
                                </select>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="size-preset-select" className="font-semibold">Ukuran</label>
                                    <button onClick={() => setUseCustomSize(!useCustomSize)} className="text-sm font-medium">{useCustomSize ? 'Preset' : 'Kustom'}</button>
                                </div>
                                {!useCustomSize ? <select id="size-preset-select" value={sizePreset} onChange={(e) => setSizePreset(e.target.value)} className="w-full p-3 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="1024x1024">1024x1024</option><option value="1024x1792">1024x1792</option><option value="1792x1024">1792x1024</option></select> : <div className="space-y-3 p-3 rounded-lg" style={{boxShadow: 'var(--shadow-inset)'}}><div><label className="text-sm">Width: {customWidth}px</label><input type="range" min="256" max="2048" step="64" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} className="w-full"/></div><div><label className="text-sm">Height: {customHeight}px</label><input type="range" min="256" max="2048" step="64" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} className="w-full"/></div></div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="batch-input" className="font-semibold block mb-2">Batch</label>
                                    <input id="batch-input" type="number" min="1" max="10" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full p-3 rounded-lg neumorphic-input"/>
                                </div>
                                <div>
                                    <label htmlFor="seed-input" className="font-semibold block mb-2">Seed</label>
                                    <input id="seed-input" type="text" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Acak" className="w-full p-3 rounded-lg neumorphic-input"/>
                                </div>
                            </div>
                            <NeumorphicButton onClick={() => setIsMasterResetModalOpen(true)} className="w-full text-red-500 font-semibold"><Trash2 size={16}/> Reset Semua Data</NeumorphicButton>
                        </div>
                        <div className="p-6 rounded-2xl h-fit space-y-4 neumorphic-card">
                            <h3 className="font-bold text-lg">Buat Prompt dari Gambar</h3>
                            <NeumorphicButton onClick={() => setIsAnalysisModalOpen(true)} className="w-full"><Upload size={16} /> Analisis Gambar</NeumorphicButton>
                        </div></>
                        }
                    </div>
                    <div className="lg:col-span-8 space-y-8">
                        <div className="p-6 rounded-2xl min-h-[50vh] flex flex-col justify-center items-center neumorphic-card">
                            <h2 className="text-2xl font-bold mb-4">{activeTab === 'image' ? 'Hasil Generasi Gambar' : (activeTab === 'video' ? 'Hasil Prompt Video' : 'Hasil Generasi Audio')}</h2>
                            {loading && <div className="text-center"><Spinner /><p className="mt-4">{activeTab === 'image' ? 'Membuat Gambar...' : (activeTab === 'video' ? 'Membuat Prompt...' : 'Membuat Audio...')}</p></div>}
                            {!loading && activeTab === 'image' && generatedImages.length === 0 && <p className="text-gray-500">Hasil gambar akan muncul di sini.</p>}
                            {!loading && activeTab === 'image' && generatedImages.length > 0 && <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">{generatedImages.map((img, i) => (<div key={i} className="rounded-xl p-2 space-y-2 group relative" style={{boxShadow: 'var(--shadow-outset)'}}><img src={img.url} className="w-full h-auto rounded-lg"/><div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"><button onClick={() => handleOpenEditor(img)} className="text-white font-bold py-2 px-4 rounded-lg bg-white/20 backdrop-blur-sm">Lihat & Edit</button></div><p className="text-xs text-center opacity-60">Seed: {img.seed}</p></div>))}</div>}
                            {!loading && activeTab === 'video' && !generatedVideoPrompt && <p className="text-gray-500">Hasil prompt video akan muncul di sini.</p>}
                            {!loading && activeTab === 'video' && generatedVideoPrompt && <div className="w-full p-4 rounded-lg text-left relative" style={{boxShadow:'var(--shadow-inset)'}}><button onClick={()=>{navigator.clipboard.writeText(generatedVideoPrompt); showToast('Prompt disalin!', 'success')}} className="absolute top-2 right-2 p-1.5 opacity-60 hover:opacity-100"><Copy size={16}/></button><p className="whitespace-pre-wrap pr-8">{generatedVideoPrompt}</p></div>}
                            {!loading && activeTab === 'audio' && !generatedAudio && <p className="text-gray-500">Hasil audio akan muncul di sini.</p>}
                            {!loading && activeTab === 'audio' && generatedAudio && <div className="w-full p-4 flex items-center gap-4"><audio controls src={generatedAudio} className="w-full"></audio><a href={generatedAudio} download="generated_audio.mp3"><NeumorphicButton className="!p-3"><ImageDown size={20}/></NeumorphicButton></a></div>}
                        </div>
                        <div className="p-6 rounded-2xl h-fit neumorphic-card">
                            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex items-center gap-2"><History size={20}/> Riwayat & Favorit</h3><NeumorphicButton onClick={() => setIsClearHistoryModalOpen(true)} className="!p-2"><Trash2 size={16}/></NeumorphicButton></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><h4 className="font-semibold mb-2">Riwayat Gambar</h4><div className="max-h-96 overflow-y-auto space-y-2 pr-2">{generationHistory.length === 0 ? <p className="text-sm opacity-60">Kosong</p> : generationHistory.map((h) => (<div key={h.date} className="flex items-center gap-2 p-2 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}><img src={h.url} className="w-16 h-16 rounded-md object-cover cursor-pointer flex-shrink-0" onClick={() => handleOpenEditor(h)}/><p className="text-xs line-clamp-3 flex-grow cursor-pointer" onClick={() => handleOpenEditor(h)}>{h.prompt}</p><NeumorphicButton aria-label={`Hapus riwayat untuk prompt: ${h.prompt.substring(0, 30)}...`} onClick={() => setGenerationHistory(prev => prev.filter(item => item.date !== h.date))} className="!p-2 flex-shrink-0"><Trash2 size={14}/></NeumorphicButton></div>))}</div></div>
                                <div><h4 className="font-semibold mb-2">Prompt Favorit</h4><div className="max-h-96 overflow-y-auto space-y-2 pr-2">{savedPrompts.length === 0 ? <p className="text-sm opacity-60">Kosong</p> : savedPrompts.map((p) => (<div key={p.date} className="flex items-center gap-2 p-2 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}><p className="text-sm flex-grow truncate">{p.prompt}</p><NeumorphicButton onClick={() => setPrompt(p.prompt)} className="!p-1.5"><ChevronsRight size={14}/></NeumorphicButton><NeumorphicButton aria-label={`Hapus favorit: ${p.prompt.substring(0, 30)}...`} onClick={() => setSavedPrompts(prev => prev.filter(sp => sp.date !== p.date))} className="!p-1.5"><Trash2 size={14}/></NeumorphicButton></div>))}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="text-center p-4 mt-8 border-t border-gray-500/20 text-sm opacity-70">
                <p>&copy; {new Date().getFullYear()} RuangRiung AI Image Generator - Developed with ❤️ by{' '}
                  <a
                    href="https://ariftirtana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Arif Tirtana
                  </a>
                </p>
            </footer>
        </div>
        {showBackToTop && (
            <NeumorphicButton
                onClick={scrollToTop}
                className="!p-3 fixed bottom-5 right-5 z-50 !rounded-full animate-fade-in"
                title="Back to Top"
            >
                <ChevronUp size={24} />
            </NeumorphicButton>
        )}

      <ChatbotAssistant />
    </div>
  );
}
