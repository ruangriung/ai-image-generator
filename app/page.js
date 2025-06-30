"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Sun, Moon, Settings, X, Wand2, RefreshCw, ChevronsRight,
    ImageDown, Bookmark, Trash2, History, Star, Upload,
    ChevronDown, ChevronUp, Sparkles, Image as ImageIcon, Video, Layers, Coins, Clock,
    Eye, EyeOff, Copy, AudioLines, SlidersHorizontal, Camera, CloudSun, KeyRound, Check,
    MessageSquare, Download, Dices, Maximize2
} from 'lucide-react';

import { 
    Spinner, NeumorphicButton, Toasts, 
    GeneratedContentDisplay, // Komponen yang dimodifikasi
    CollapsibleSection, ImageAnalysisModal, PromptEditModal 
} from './components.js';
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
  const [artStyle, setArtStyle] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isBuildingPrompt, setIsBuildingPrompt] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  
  const [editingImage, setEditingImage] = useState(null); 

  const [toasts, setToasts] = useState([]);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  const canvasRef = useRef(null);

  const { width, height } = useMemo(() => {
    if (useCustomSize) return { width: customWidth, height: customHeight };
    const [w, h] = sizePreset.split('x').map(Number);
    return { width: w, height: h };
  }, [useCustomSize, customWidth, customHeight, sizePreset]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), duration);
  }, []);

  const fetchAiSuggestions = useCallback(async () => {
    setIsFetchingSuggestions(true);
    try {
        const res = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                seed: Math.floor(Math.random() * 1000000), 
                messages: [{
                    role: 'system',
                    content: 'You are a creative prompt generator. Generate 3 diverse, creative, and detailed prompts for an AI image generator. Each prompt must be on a new line. Do not number them.'
                }, {
                    role: 'user',
                    content: 'Give me 3 creative prompts.'
                }]
            })
        });
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        const data = await res.json();
        const suggestionsText = data.choices[0]?.message?.content;
        if (suggestionsText) {
            const suggestions = suggestionsText.split('\n').filter(p => p.trim() !== '');
            setAiSuggestions(suggestions);
        } else {
            throw new Error('No suggestions in response');
        }
    } catch (err) {
        showToast('Gagal memuat saran prompt AI.', 'error');
        setAiSuggestions([
            "A majestic lion wearing a crown in a futuristic city",
            "A serene japanese garden with a koi pond and cherry blossoms",
            "An astronaut playing a guitar on the moon, with Earth in the background",
        ]);
    } finally {
        setIsFetchingSuggestions(false);
    }
  }, [showToast]);

  const handleRandomPrompt = () => {
    if (aiSuggestions.length === 0) {
      showToast('Saran prompt sedang dimuat, coba lagi sesaat.', 'info');
      if (!isFetchingSuggestions) {
          fetchAiSuggestions();
      }
      return;
    }
    const randomIndex = Math.floor(Math.random() * aiSuggestions.length);
    setPrompt(aiSuggestions[randomIndex]);
    showToast('Prompt acak telah dimuat!', 'success');
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
        setDarkMode(localStorage.getItem('darkMode') === 'true');
        try {
            const savedState = JSON.parse(localStorage.getItem('aiImageGeneratorState_v18') || '{}');
            if (savedState) {
                setPrompt(savedState.prompt || ''); setModel(savedState.model || 'flux'); setQuality(savedState.quality || 'hd'); setSizePreset(savedState.sizePreset || '1024x1024'); setApiKey(savedState.apiKey || ''); setGenerationHistory(savedState.generationHistory || []); setSavedPrompts(savedState.savedPrompts || []); setBatchSize(savedState.batchSize || 1); setSeed(savedState.seed || ''); setUseCustomSize(savedState.useCustomSize || false); setCustomWidth(savedState.customWidth || 1024); setCustomHeight(savedState.customHeight || 1024); setArtStyle(savedState.artStyle || '');
            }
            const coinsDataString = localStorage.getItem('aiGeneratorCoinsData');
            if (coinsDataString) {
              const coinsData = JSON.parse(coinsDataString);
              setCoins(coinsData.coins ?? 500);
            }
        } catch (e) { console.error("Gagal memuat state:", e); }

        fetchAiSuggestions();
        
        const handler = (e) => {
          e.preventDefault();
          setInstallPrompt(e);
          if (sessionStorage.getItem('pwaBannerClosed') !== 'true') {
            setIsBannerVisible(true);
          }
        };
        window.addEventListener('beforeinstallprompt', handler);

        const handleScroll = () => {
            if (window.scrollY > 300) { setShowBackToTop(true); } else { setShowBackToTop(false); }
        };
        window.addEventListener('scroll', handleScroll);

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

        return () => {
          window.removeEventListener('beforeinstallprompt', handler);
          window.removeEventListener('scroll', handleScroll);
          clearInterval(timer);
        };
    }
  }, [isMounted, fetchAiSuggestions, showToast]);

  useEffect(() => {
    if (!isMounted) return;
    try {
        const stateToSave = { prompt, model, quality, sizePreset, apiKey, generationHistory, savedPrompts, batchSize, seed, useCustomSize, customWidth, customHeight, artStyle };
        localStorage.setItem('aiImageGeneratorState_v18', JSON.stringify(stateToSave));
        const coinsData = JSON.parse(localStorage.getItem('aiGeneratorCoinsData') || '{}');
        localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ ...coinsData, coins }));
    } catch(e) { console.error("Gagal menyimpan state:", e); }
  }, [isMounted, prompt, model, quality, sizePreset, apiKey, generationHistory, savedPrompts, batchSize, seed, useCustomSize, customWidth, customHeight, artStyle, coins]);

  useEffect(() => {
    if(isMounted) {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    }
  }, [darkMode, isMounted]);

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
    setEditingImage(null); // Tutup editor saat generate baru
    if (activeTab === 'image') await handleGenerateImage(); 
    else if (activeTab === 'audio') await handleGenerateAudio(); 
    setLoading(false); 
  };
  
  const handleGenerateImage = async () => { 
    setGeneratedImages([]); 
    const finalPrompt = `${artStyle} ${prompt}`; 
    const promises = Array.from({ length: batchSize }, () => { 
        const currentSeed = seed || Math.floor(Math.random() * 1e9); 
        
        let url;
        if (model === 'gptimage') {
            const aspectRatio = width / height;
            let gptSize;
            if (aspectRatio > 1) gptSize = '1792x1024';
            else if (aspectRatio < 1) gptSize = '1024x1792';
            else gptSize = '1024x1024';
            url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=${model}&size=${gptSize}&quality=${quality}&seed=${currentSeed}&nologo=true&safe=false&referrer=ruangriung.my.id`;
        } else {
            url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=${model}&width=${width}&height=${height}&quality=${quality}&seed=${currentSeed}&nologo=true&safe=false&referrer=ruangriung.my.id`; 
        }

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
  
  const handleBuildImagePrompt = async () => { if (!promptCreator.subject.trim()) { showToast('Subjek tidak boleh kosong.', 'error'); return; } setIsBuildingPrompt(true); setGeneratedImagePrompt(''); setGeneratedVideoPrompt(''); try { const userInput = `Main subject: ${promptCreator.subject}. Additional details: ${promptCreator.details || 'None'}.`; const res = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [ { role: 'system', content: 'You are a prompt engineer who creates detailed, artistic prompts for image generation. Respond only with the final prompt.' }, { role: 'user', content: userInput }]}) }); if (!res.ok) throw new Error(`API Error: ${res.statusText}`); const data = await res.json(); const newPrompt = data.choices[0]?.message?.content; if (newPrompt) { setGeneratedImagePrompt(newPrompt.trim()); showToast('Prompt gambar dikembangkan oleh AI!', 'success'); } else { throw new Error('Gagal memproses respons API.'); } } catch (err) { showToast(err.message, 'error'); } finally { setIsBuildingPrompt(false); } };
  
  const handleBuildVideoPrompt = async () => { if (!videoParams.concept.trim()) { showToast('Konsep utama video tidak boleh kosong.', 'error'); return; } setIsBuildingPrompt(true); setGeneratedVideoPrompt(''); setGeneratedImagePrompt(''); const allParams = Object.entries(videoParams).map(([key, value]) => (value ? `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}` : null)).filter(Boolean).join('. '); try { const res = await fetch('https://text.pollinations.ai/openai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [ { role: 'system', content: 'You are a professional cinematographer. Based on these parameters, write a complete, coherent, and inspiring video prompt for a text-to-video AI. Combine all elements into a natural paragraph.' }, { role: 'user', content: allParams }]}) }); if (!res.ok) throw new Error(`API Error: ${res.statusText}`); const data = await res.json(); const videoPrompt = data.choices[0]?.message?.content; if (videoPrompt) { setGeneratedVideoPrompt(videoPrompt.trim()); showToast('Prompt video profesional berhasil dibuat!', 'success'); } else { throw new Error('Gagal memproses respons API.'); } } catch (err) { showToast(err.message, 'error'); } finally { setIsBuildingPrompt(false); } };
  
  const handlePromptCreatorChange = (e, type) => { const { name, value } = e.target; if (type === 'image') setPromptCreator(p => ({ ...p, [name]: value })); };
  
  const handleVideoParamsChange = (e) => { const { name, value, type } = e.target; setVideoParams(p => ({ ...p, [name]: type === 'number' ? Number(value) : value })); };

  const handleUseGeneratedPrompt = () => {
    if (generatedImagePrompt) {
        setPrompt(generatedImagePrompt);
        setGeneratedImagePrompt('');
        showToast('Prompt siap digunakan!', 'success');
        setIsCreatorOpen(false);
    }
  };
    
  const handleMasterReset = () => {
    try {
      const coinData = localStorage.getItem('aiGeneratorCoinsData');
      const darkModePref = localStorage.getItem('darkMode');
      
      localStorage.clear();

      if (coinData) localStorage.setItem('aiGeneratorCoinsData', coinData);
      if (darkModePref) localStorage.setItem('darkMode', darkModePref);

      setPrompt(''); setModel('flux'); setQuality('hd'); setSizePreset('1024x1024'); setUseCustomSize(false); setCustomWidth(1024); setCustomHeight(1024); setSeed(''); setBatchSize(1); setArtStyle(''); setGeneratedImages([]); setLoading(false); setIsEnhancing(false); setIsBuildingPrompt(false); setApiKey(''); setGenerationHistory([]); setSavedPrompts([]); setEditingImage(null); setIsAnalysisModalOpen(false); setActiveTab('image'); setIsCreatorOpen(false); setPromptCreator({ subject: '', details: '' });
      setVideoParams({
          concept: '', visualStyle: 'cinematic', duration: 10, aspectRatio: '16:9',
          fps: 24, cameraMovement: 'static', cameraAngle: 'eye-level', lensType: 'standard',
          depthOfField: 'medium', filmGrain: 20, chromaticAberration: 10,
          colorGrading: 'neutral', timeOfDay: 'midday', weather: 'clear'
      });
      setGeneratedAudio(null);
      setGeneratedVideoPrompt('');
      setGeneratedImagePrompt('');

      showToast('Semua data aplikasi telah direset.', 'success');
      setIsMasterResetModalOpen(false);

    } catch (e) {
      console.error("Gagal mereset data:", e);
      showToast('Gagal mereset data.', 'error');
    }
  };

  const handleClearHistory = () => { setGenerationHistory([]); setSavedPrompts([]); setIsClearHistoryModalOpen(false); showToast('Semua riwayat telah dihapus.', 'success'); };
  
  const handleUsePromptAndSeed = (p, s) => {
    setPrompt(p);
    setSeed(String(s));
    setActiveTab('image');
    setEditingImage(null);
    showToast('Prompt & Seed dimuat.', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateVariation = (basePrompt) => {
    showToast('Membuat variasi baru...', 'info');
    setPrompt(basePrompt);
    setSeed('');
    setActiveTab('image');
    setEditingImage(null);
    setTimeout(() => {
        handleGenerate();
    }, 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  if (!isMounted) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Spinner/></div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]`}>
        {isBannerVisible && (
            <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 flex items-center justify-center gap-4 z-50 shadow-lg animate-fade-in">
                <span className="text-sm md:text-base">Install aplikasi untuk akses lebih cepat!</span>
                <button onClick={handleInstallClick} className="bg-white text-blue-600 font-bold py-1 px-3 rounded-md flex items-center gap-2 text-sm hover:bg-gray-200 transition-colors">
                    <Download size={16} /> Install
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
        
        <ImageAnalysisModal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)} onPromptGenerated={(p) => { setGeneratedImagePrompt(p); showToast("Prompt dari gambar berhasil dibuat!", "success"); setIsAnalysisModalOpen(false); setIsCreatorOpen(true);}} showToast={showToast} />
        <PromptEditModal isOpen={isPromptModalOpen} onClose={() => setIsPromptModalOpen(false)} value={prompt} onSave={(newPrompt) => setPrompt(newPrompt)} />
        {isAdminModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">Panel Admin</h2><NeumorphicButton onClick={() => setIsAdminModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm"> Masukkan password admin untuk mengakses fitur. atau hubungi Admin ruangriung di halaman <a style={{color:"#3b82f6"}} href="https://web.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener noreferrer">Facebook RuangRiung</a>.</p><div className="relative w-full mb-4"><input type={showAdminPassword ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password Admin" className="w-full p-3 rounded-lg neumorphic-input pr-12"/><button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="space-y-4"><NeumorphicButton onClick={handleAdminReset} className="font-bold w-full"><RefreshCw size={16}/> Reset Koin</NeumorphicButton></div></div></div>}
        {isClearHistoryModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><h2 className="text-xl font-bold mb-4">Konfirmasi</h2><p className="mb-6">Yakin ingin menghapus semua riwayat & favorit?</p><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsClearHistoryModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleClearHistory} className="font-bold bg-red-500 text-white">Hapus</NeumorphicButton></div></div></div>}
        {isApiModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">API Key untuk {modelRequiringKey?.toUpperCase()}</h2><NeumorphicButton onClick={() => setIsApiModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton></div><p className="mb-4 text-sm">Model ini memerlukan API key yang valid.</p><div className="relative w-full mb-4"><input type={showApiKey ? "text" : "password"} value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder="Masukkan API Key Anda" className="w-full p-3 rounded-lg neumorphic-input pr-12"/><button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}</button></div><div className="flex justify-end gap-4"><NeumorphicButton onClick={() => setIsApiModalOpen(false)}>Batal</NeumorphicButton><NeumorphicButton onClick={handleApiKeySubmit} className="font-bold">Simpan</NeumorphicButton></div></div></div>}
        {isTurboAuthModalOpen && <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"><div className="p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}><div className="flex justify-between items-center"><h2 className="text-xl font-bold flex items-center gap-2"><KeyRound size={22}/> Akses Model Turbo</h2><NeumorphicButton onClick={() => {setModel('flux'); setIsTurboAuthModalOpen(false);}} className="!p-2"><X size={20} /></NeumorphicButton></div><div className="p-4 rounded-lg space-y-3" style={{boxShadow: 'var(--shadow-inset)'}}><div className="flex justify-between items-center"><span className="font-semibold text-sm">Password Dibuat:</span><span className="font-mono text-lg font-bold text-indigo-500">{generatedTurboPassword || '---'}</span></div><NeumorphicButton onClick={handleGenerateModalPassword} className="w-full !p-2 text-sm"><RefreshCw size={14}/> Buat Password Baru</NeumorphicButton></div><div><label className="font-semibold text-sm mb-2 block">Verifikasi Password</label><div className="relative"><input type="text" value={turboPasswordInput} onChange={(e) => setTurboPasswordInput(e.target.value)} placeholder="Ketik atau tempel password di sini" className="w-full p-3 rounded-lg neumorphic-input pr-24" disabled={!generatedTurboPassword}/><NeumorphicButton onClick={() => setTurboPasswordInput(generatedTurboPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 !p-2 text-xs" disabled={!generatedTurboPassword}>Autofill</NeumorphicButton></div></div><div className="text-xs p-3 rounded-lg space-y-2" style={{boxShadow:'var(--shadow-inset)', opacity: 0.8}}><p>Model Turbo tidak memiliki filter keamanan. Anda bertanggung jawab penuh atas konten yang dihasilkan.</p><p>Password hanya berlaku selama 24 jam.</p></div><NeumorphicButton onClick={handleActivateTurbo} className="w-full font-bold !p-3" disabled={!generatedTurboPassword || turboPasswordInput !== generatedTurboPassword}><Check size={18}/> Aktifkan Turbo</NeumorphicButton></div></div>}
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
                       {/* GenerationControls UI */}
                       <div className="p-6 rounded-2xl h-fit space-y-4 neumorphic-card">
                            <div className="flex gap-2">
                                <NeumorphicButton onClick={() => setActiveTab('image')} active={activeTab === 'image'} className="w-full"><ImageIcon size={16}/>Gambar</NeumorphicButton>
                                <NeumorphicButton onClick={() => { setActiveTab('video'); setGeneratedVideoPrompt(''); setGeneratedImagePrompt(''); }} active={activeTab === 'video'} className="w-full"><Video size={16}/>Video</NeumorphicButton>
                                <NeumorphicButton onClick={() => setActiveTab('audio')} active={activeTab === 'audio'} className="w-full"><AudioLines size={16}/>Audio</NeumorphicButton>
                            </div>
                            
                            {activeTab === 'image' && <div className='space-y-4'>
                                <label htmlFor="prompt-textarea" className="font-semibold block text-xl">Prompt Gambar</label>
                                <div className="relative">
                                    <textarea id="prompt-textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ketik ide gambarmu di sini..." className="w-full p-3 rounded-lg neumorphic-input resize-none pr-10 h-28"/>
                                    <button aria-label="Perluas prompt di modal" onClick={() => setIsPromptModalOpen(true)} className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"><Maximize2 size={18} /></button>
                                </div>
                                <CollapsibleSection title="Butuh Inspirasi?" icon={<Wand2 size={16}/>}>
                                  <div className="space-y-2">
                                      <button onClick={fetchAiSuggestions} disabled={isFetchingSuggestions} className="w-full text-sm p-2 rounded-lg flex items-center justify-center gap-2" style={{boxShadow: 'var(--shadow-outset)'}}>{isFetchingSuggestions ? <Spinner/> : <RefreshCw size={14}/>}{isFetchingSuggestions ? 'Memuat...' : 'Muat Saran Baru'}</button>
                                      {aiSuggestions.map((suggestion, index) => (<div key={index} onClick={() => setPrompt(suggestion)} className="text-xs p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-500/10 neumorphic-input">{suggestion}</div>))}
                                  </div>
                                </CollapsibleSection>
                                <div className="space-y-2">
                                  <NeumorphicButton onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-full text-sm relative !p-3"><span className="flex items-center justify-center gap-2"><Settings size={16} />Pengaturan</span><span className="absolute right-3 top-1/2 -translate-y-1/2">{isSettingsOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</span></NeumorphicButton>
                                  {isSettingsOpen && (
                                    <div className="p-4 rounded-lg space-y-4" style={{boxShadow: 'var(--shadow-inset)'}}>
                                        {/* ... (Konten pengaturan lengkap) ... */}
                                    </div>
                                  )}
                                </div>
                                <NeumorphicButton onClick={handleGenerate} loading={loading} loadingText="Membuat Gambar..." className="w-full font-bold text-lg"><Sparkles size={18}/>Generate</NeumorphicButton>
                            </div>}
                            {activeTab === 'video' && <div className='space-y-4'> {/* ... Konten tab video ... */} </div>}
                            {activeTab === 'audio' && <div className='space-y-4'> {/* ... Konten tab audio ... */} </div>}
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-8">
                        <GeneratedContentDisplay
                            activeTab={activeTab}
                            loading={loading}
                            generatedImages={generatedImages}
                            generatedVideoPrompt={generatedVideoPrompt}
                            generatedAudio={generatedAudio}
                            editingImage={editingImage}
                            setEditingImage={setEditingImage}
                            onUsePromptAndSeed={handleUsePromptAndSeed}
                            onCreateVariation={handleCreateVariation}
                            onDownload={handleDownload}
                            showToast={showToast}
                        />

                        <div className="p-6 rounded-2xl h-fit neumorphic-card">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2"><History size={20}/> Riwayat & Favorit</h3>
                                <NeumorphicButton onClick={() => setIsClearHistoryModalOpen(true)} className="!p-2" title="Hapus Riwayat & Favorit"><Trash2 size={16}/></NeumorphicButton>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><h4 className="font-semibold mb-2">Riwayat Gambar</h4><div className="max-h-96 overflow-y-auto space-y-2 pr-2">{generationHistory.length === 0 ? <p className="text-sm opacity-60">Kosong</p> : generationHistory.map((h) => (<div key={h.date} className="flex items-center gap-2 p-2 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}><img src={h.url} className="w-16 h-16 rounded-md object-cover cursor-pointer flex-shrink-0" onClick={() => setEditingImage(h)}/><p className="text-xs line-clamp-3 flex-grow cursor-pointer" onClick={() => setEditingImage(h)}>{h.prompt}</p><NeumorphicButton aria-label={`Hapus riwayat untuk prompt: ${h.prompt.substring(0, 30)}...`} onClick={() => setGenerationHistory(prev => prev.filter(item => item.date !== h.date))} className="!p-2 flex-shrink-0"><Trash2 size={14}/></NeumorphicButton></div>))}</div></div>
                                <div><h4 className="font-semibold mb-2">Prompt Favorit</h4><div className="max-h-96 overflow-y-auto space-y-2 pr-2">{savedPrompts.length === 0 ? <p className="text-sm opacity-60">Kosong</p> : savedPrompts.map((p) => (<div key={p.date} className="flex items-center gap-2 p-2 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}><p className="text-sm flex-grow truncate">{p.prompt}</p><NeumorphicButton onClick={() => setPrompt(p.prompt)} className="!p-1.5"><ChevronsRight size={14}/></NeumorphicButton><NeumorphicButton aria-label={`Hapus favorit: ${p.prompt.substring(0, 30)}...`} onClick={() => setSavedPrompts(prev => prev.filter(sp => sp.date !== p.date))} className="!p-1.5"><Trash2 size={14}/></NeumorphicButton></div>))}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center mt-8">
                 <NeumorphicButton
                    onClick={() => setIsMasterResetModalOpen(true)}
                    className="w-full max-w-md !text-red-500 !font-semibold"
                >
                    <Trash2 size={16}/> Reset Semua Data Aplikasi
                </NeumorphicButton>
            </div>

            <footer className="text-center p-4 mt-8 border-t border-gray-500/20 text-sm opacity-70">
                <p>&copy; {new Date().getFullYear()} RuangRiung AI Image Generator - Developed with ❤️ by{' '}
                  <a href="https://ariftirtana.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Arif Tirtana</a>
                </p>
            </footer>
        </div>
        {showBackToTop && (
            <NeumorphicButton onClick={scrollToTop} className="!p-3 fixed bottom-5 right-5 z-50 !rounded-full animate-fade-in" title="Back to Top">
                <ChevronUp size={24} />
            </NeumorphicButton>
        )}

      <ChatbotAssistant />
    </div>
  );
}
