// File: app/useAppState.js

"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Ini adalah Custom Hook kita!
export function useAppState() {
  // ... (semua state Anda tetap sama)
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
  const [apiKey, setApiKey] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [selectedHistoryImage, setSelectedHistoryImage] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('image');
  const [videoParams, setVideoParams] = useState({
      concept: '', visualStyle: 'cinematic', duration: 10, aspectRatio: '16:9',
      fps: 24, cameraMovement: 'static', cameraAngle: 'eye-level', lensType: 'standard',
      depthOfField: 'medium', filmGrain: 20, chromaticAberration: 10,
      colorGrading: 'neutral', timeOfDay: 'midday', weather: 'clear',
      narration: '', 
      videoModel: 'default'
  });
  const [tempApiKey, setTempApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelRequiringKey, setModelRequiringKey] = useState(null);
  const [isTurboAuthModalOpen, setIsTurboAuthModalOpen] = useState(false);
  const [generatedTurboPassword, setGeneratedTurboPassword] = useState('');
  const [turboPasswordInput, setTurboPasswordInput] = useState('');
  const [turboCountdown, setTurboCountdown] = useState('');
  const [coins, setCoins] = useState(500);
  const [countdown, setCountdown] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [audioVoice, setAudioVoice] = useState('alloy');
  const [generatedAudioData, setGeneratedAudioData] = useState(null);
  const [generatedVideoPrompt, setGeneratedVideoPrompt] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isLabAuthenticated, setIsLabAuthenticated] = useState(false);
  
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isClearHistoryModalOpen, setIsClearHistoryModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isMasterResetModalOpen, setIsMasterResetModalOpen] = useState(false);
  
  const canvasRef = useRef(null);

  const { width, height } = useMemo(() => {
    if (useCustomSize) return { width: customWidth, height: customHeight };
    const [w, h] = sizePreset.split('x').map(Number);
    return { width: w, height: h };
  }, [useCustomSize, customWidth, customHeight, sizePreset]);

  // ... (fungsi showToast dan lainnya tetap sama)
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), duration);
  }, []);

  const handleDownloadAudio = useCallback(() => {
    if (!generatedAudioData || !generatedAudioData.url) {
      showToast('Tidak ada audio untuk diunduh.', 'error');
      return;
    }
    const link = document.createElement('a');
    link.href = generatedAudioData.url;
    link.download = `ruangriung-audio-${generatedAudioData.voice}-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audio berhasil diunduh!', 'success');
  }, [generatedAudioData, showToast]);

  const handleDownloadVideoPromptJson = useCallback(() => {
    if (!generatedVideoPrompt) {
      showToast('Tidak ada prompt video untuk diunduh.', 'error');
      return;
    }

    const dataToDownload = {
      generator: 'RuangRiung AI Video Prompt Assistant',
      createdAt: new Date().toISOString(),
      prompt: generatedVideoPrompt,
      parameters: videoParams,
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruangriung-video-prompt-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File JSON berhasil diunduh!', 'success');
  }, [generatedVideoPrompt, videoParams, showToast]);

  const fetchAiSuggestions = useCallback(async () => {
    setIsFetchingSuggestions(true);
    try {
        const res = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai',
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

  const handleRandomPrompt = useCallback(() => {
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
  }, [aiSuggestions, isFetchingSuggestions, showToast, fetchAiSuggestions]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
        setDarkMode(localStorage.getItem('darkMode') === 'true');
        if (sessionStorage.getItem('labAuthenticated') === 'true') {
            setIsLabAuthenticated(true);
        }
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
                    if(turboData.password && turboData.expiry > now){
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

  const handleModelChange = useCallback((e) => {
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
  }, [apiKey, showToast]);

  const handleApiKeySubmit = useCallback(() => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      setModel(modelRequiringKey);
      showToast(`API Key tersimpan & model ${modelRequiringKey.toUpperCase()} dipilih.`, 'success');
      setIsApiModalOpen(false);
      setTempApiKey('');
      setModelRequiringKey(null);
    } else {
      showToast('API Key tidak boleh kosong.', 'error');
    }
  }, [tempApiKey, modelRequiringKey, showToast]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt.trim()) {
        showToast('Prompt tidak boleh kosong.', 'error');
        return;
    }
    setIsEnhancing(true);
    try {
        const res = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai',
                messages: [{
                    role: 'system',
                    content: 'Rewrite the user prompt to be more vivid and artistic for an AI image generator. Respond only with the enhanced prompt.'
                },{
                    role: 'user',
                    content: prompt
                }]
            })
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        const data = await res.json();
        const enhanced = data.choices[0]?.message?.content;
        if (enhanced) {
            setPrompt(enhanced.trim());
            showToast('Prompt berhasil disempurnakan!', 'success');
        } else {
            throw new Error('Gagal memproses respons API.');
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        setIsEnhancing(false);
    }
  }, [prompt, showToast]);

  const handleGenerateImage = useCallback(async () => {
    const finalPrompt = `${artStyle} ${prompt}`;
    // --- BLOK YANG DIPERBAIKI ---
    const promises = Array.from({ length: batchSize }, (_, i) => {
        // Jika ada seed, kita tambahkan index batch (i) untuk membuat variasi kecil.
        // Jika tidak ada seed, setiap gambar akan mendapat seed acak yang benar-benar baru.
        const currentSeed = seed ? (parseInt(seed, 10) + i) : Math.floor(Math.random() * 1e9);
        
        let url;
        if (model === 'gptimage') {
            const aspectRatio = width / height;
            let gptSize;
            if (aspectRatio > 1) {
                gptSize = '1792x1024';
            } else if (aspectRatio < 1) {
                gptSize = '1024x1792';
            } else {
                gptSize = '1024x1024';
            }
            url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=${model}&size=${gptSize}&quality=${quality}&seed=${currentSeed}&nologo=true&safe=false&referrer=ruangriung.my.id`;
        } else {
            url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?model=${model}&width=${width}&height=${height}&quality=${quality}&seed=${currentSeed}&nologo=true&safe=false&referrer=ruangriung.my.id`;
        }

        if (apiKey) url += `&apikey=${apiKey}`;
        return fetch(url).then(res => res.ok ? { url: res.url, seed: currentSeed, prompt: finalPrompt, date: new Date().toISOString() } : Promise.reject(new Error(`Gagal membuat gambar (status: ${res.status})`)));
    });
    // --- AKHIR BLOK PERBAIKAN ---
    try {
        const results = await Promise.all(promises);
        setGeneratedImages(results);
        setGenerationHistory(prev => [...results, ...prev]);
        const cost = results.length;
        setCoins(c => Math.max(0, c - cost));
        showToast(`Berhasil! Sisa koin: ${coins - cost}`, 'success');
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        setLoading(false);
    }
  }, [artStyle, prompt, batchSize, seed, model, width, height, quality, apiKey, showToast, coins]);

  const handleGenerateAudio = useCallback(async () => {
    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const randomCacheBuster = `&r=${Math.random()}`;
        const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai-audio&voice=${audioVoice}&referrer=rrai.my.id${randomCacheBuster}`;
        
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Gagal membuat audio (status: ${res.status})`);
        }
        
        const blob = await res.blob();
        if (blob.type !== 'audio/mpeg') {
            throw new Error('Respons yang diterima bukan file audio.');
        }

        if (generatedAudioData && generatedAudioData.url) {
          URL.revokeObjectURL(generatedAudioData.url);
        }

        setGeneratedAudioData({
          url: URL.createObjectURL(blob),
          prompt: prompt,
          voice: audioVoice,
          date: new Date().toISOString(),
        });

        setCoins(c => Math.max(0, c - 1));
        showToast(`Audio berhasil dibuat! Sisa koin: ${coins - 1}`, 'success');
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        setLoading(false);
    }
  }, [prompt, audioVoice, showToast, coins, generatedAudioData]);
  
  // --- FUNGSI YANG DIPERBAIKI ---
  const handleBuildVideoPrompt = useCallback(async () => {
      if (!videoParams.concept.trim()) {
          showToast('Konsep utama video tidak boleh kosong.', 'error');
          return;
      }
      setLoading(true);
      setGeneratedVideoPrompt('');
      const allParams = Object.entries(videoParams).map(([key, value]) => (value ? `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}` : null)).filter(Boolean).join('. ');
      try {
          const res = await fetch('/api/proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  model: 'openai',
                  seed: Math.floor(Math.random() * 1000000),
                  messages: [ {
                      role: 'system',
                      content: 'You are a professional cinematographer. Based on these parameters, write a complete, coherent, and inspiring video prompt for a text-to-video AI. Combine all elements into a natural paragraph.'
                  }, {
                      role: 'user',
                      content: allParams
                  }]
              })
          });
          if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
          const data = await res.json();
          const videoPrompt = data.choices[0]?.message?.content;
          
          // --- LOGIKA VALIDASI BARU ---
          const trimmedPrompt = videoPrompt ? videoPrompt.trim() : '';
          
          if (trimmedPrompt) {
              setGeneratedVideoPrompt(trimmedPrompt);
              setCoins(c => Math.max(0, c - 1));
              showToast('Prompt video profesional berhasil dibuat!', 'success');
          } else {
              // Jika respons kosong, tampilkan error dan jangan potong koin
              console.error("API returned an empty or whitespace-only response for video prompt.");
              throw new Error('AI tidak memberikan hasil. Coba ubah parameter Anda.');
          }
          // --- AKHIR LOGIKA VALIDASI ---

      } catch (err) {
          showToast(err.message, 'error');
      } finally {
          setLoading(false);
      }
  }, [videoParams, showToast, coins]);
  
  const handleGenerate = useCallback(async () => {
    if (activeTab !== 'lab' && coins <= 0) {
        showToast("Koin Anda habis.", "error");
        return;
    }

    if (activeTab === 'lab' && !isLabAuthenticated) {
        showToast("Anda harus memasukkan kata sandi untuk menggunakan fitur Lab.", "error");
        return;
    }
    
    if (activeTab === 'image' && !prompt.trim()) {
        showToast('Prompt tidak boleh kosong.', 'error');
        return;
    }
    if (activeTab === 'audio' && !prompt.trim()) {
        showToast('Prompt tidak boleh kosong.', 'error');
        return;
    }
    if (activeTab === 'video' && !videoParams.concept.trim()) {
        showToast('Konsep utama video tidak boleh kosong.', 'error');
        return;
    }
    
    setLoading(true);
    setGeneratedAudioData(null);
    setGeneratedVideoPrompt('');
    setGeneratedImages([]);

    if (activeTab === 'image') await handleGenerateImage();
    else if (activeTab === 'audio') await handleGenerateAudio();
    else if (activeTab === 'video') await handleBuildVideoPrompt();
    else {
      setLoading(false);
    }
  }, [activeTab, coins, isLabAuthenticated, prompt, videoParams.concept, handleGenerateImage, handleGenerateAudio, handleBuildVideoPrompt, showToast]);

  const handleDownload = useCallback(async (image, filter, watermark) => {
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
    
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
    
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.filter = filter !== 'none' ? filter : 'none';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
    
        if (watermark && (watermark.text || watermark.imageUrl)) {
          ctx.save();
          ctx.globalAlpha = watermark.opacity || 0.7;
          const posX = (watermark.position?.x ?? 50) / 100 * canvas.width;
          const posY = (watermark.position?.y ?? 50) / 100 * canvas.height;
    
          if (watermark.type === 'text' && watermark.text) {
            ctx.font = `bold ${Math.round((watermark.size || 8) / 100 * canvas.height)}px sans-serif`;
            ctx.fillStyle = watermark.color || '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 4;
            ctx.fillText(watermark.text, posX, posY);
          } else if (watermark.type === 'image' && watermark.imageUrl) {
            const wmImg = new window.Image();
            wmImg.crossOrigin = 'anonymous';
    
            await new Promise((resolve, reject) => {
              wmImg.onload = resolve;
              wmImg.onerror = reject;
              wmImg.src = watermark.imageUrl;
            });
    
            const wmWidth = (watermark.size || 8) * 2 * (canvas.width / 100);
            const wmHeight = wmImg.naturalHeight / wmImg.naturalWidth * wmWidth;
            ctx.drawImage(wmImg, posX - wmWidth / 2, posY - wmHeight / 2, wmWidth, wmHeight);
          }
          ctx.restore();
        }
    
        const link = document.createElement('a');
        link.download = `ruangriung-ai-${image.seed || Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        URL.revokeObjectURL(objectURL);
      };
    
      img.onerror = () => {
        showToast('Gagal memuat gambar untuk diunduh.', 'error');
        URL.revokeObjectURL(objectURL);
      }
      img.src = objectURL;
    
    } catch (e) {
      showToast('Gagal mengunduh gambar. Coba lagi.', 'error');
      console.error(e);
    }
  }, [showToast]);

  const handleUsePromptAndSeed = useCallback((p, s, imgObj) => {
    setPrompt(p);
    setSeed(String(s));
    setActiveTab('image');
    setSelectedHistoryImage(null);
    setGeneratedImages(imgObj ? [imgObj] : []);
    showToast('Prompt & Seed dimuat.', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showToast]);

  const handleCreateVariation = useCallback((basePrompt) => {
    showToast('Membuat variasi baru...', 'info');
    setPrompt(basePrompt);
    setSeed('');
    setActiveTab('image');
    setSelectedHistoryImage(null);
    setTimeout(() => handleGenerate(), 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showToast, handleGenerate]);

  const handleAdminReset = useCallback(() => {
    if (adminPassword === "passwordRahasia") {
      setCoins(500);
      localStorage.setItem('aiGeneratorCoinsData', JSON.stringify({ coins: 500, lastReset: new Date().getTime() }));
      showToast('Koin berhasil direset ke 500!', 'success');
      setIsAdminModalOpen(false);
      setAdminPassword('');
    } else {
      showToast('Password admin salah.', 'error');
    }
  }, [adminPassword, showToast]);

  const handleGenerateModalPassword = useCallback(() => {
    const randomChars = Array(5).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    const newPassword = `ruangriung-${randomChars}`;
    setGeneratedTurboPassword(newPassword);
    setTurboPasswordInput('');
  }, []);

  const handleActivateTurbo = useCallback(() => {
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
  }, [generatedTurboPassword, showToast]);

  const handleClearHistory = useCallback(() => {
    setGenerationHistory([]);
    setSavedPrompts([]);
    setIsClearHistoryModalOpen(false);
    showToast('Semua riwayat telah dihapus.', 'success');
  }, [showToast]);

  const handleLabAuthSuccess = useCallback(() => setIsLabAuthenticated(true), []);

  const handleMasterReset = useCallback(() => {
    try {
      const coinData = localStorage.getItem('aiGeneratorCoinsData');
      const darkModePref = localStorage.getItem('darkMode');
      
      localStorage.clear();
      sessionStorage.clear();
      
      if (coinData) localStorage.setItem('aiGeneratorCoinsData', coinData);
      if (darkModePref) localStorage.setItem('darkMode', darkModePref);
      
      setPrompt(''); setModel('flux'); setQuality('hd'); setSizePreset('1024x1024'); setUseCustomSize(false); setCustomWidth(1024); setCustomHeight(1024); setSeed(''); setBatchSize(1); setArtStyle(''); setGeneratedImages([]); setLoading(false); setIsEnhancing(false); setApiKey(''); setGenerationHistory([]); setSavedPrompts([]); setSelectedHistoryImage(null); setIsAnalysisModalOpen(false); setActiveTab('image');
      setVideoParams({
          concept: '', visualStyle: 'cinematic', duration: 10, aspectRatio: '16:9',
          fps: 24, cameraMovement: 'static', cameraAngle: 'eye-level', lensType: 'standard',
          depthOfField: 'medium', filmGrain: 20, chromaticAberration: 10,
          colorGrading: 'neutral', timeOfDay: 'midday', weather: 'clear'
      });
      setGeneratedAudioData(null);
      setGeneratedVideoPrompt('');
      setIsLabAuthenticated(false);

      showToast('Semua data aplikasi telah direset.', 'success');
      setIsMasterResetModalOpen(false);
      
    } catch (e) {
      console.error("Gagal mereset data:", e);
      showToast('Gagal mereset data.', 'error');
    }
  }, [showToast]);

  const handleInstallClick = useCallback(async () => {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    setInstallPrompt(null);
    setIsBannerVisible(false);
  }, [installPrompt]);

  const handleBannerClose = useCallback(() => {
    setIsBannerVisible(false);
    sessionStorage.setItem('pwaBannerClosed', 'true');
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  return {
    isMounted, prompt, setPrompt, model, setModel, quality, setQuality, sizePreset, setSizePreset,
    useCustomSize, setUseCustomSize, customWidth, setCustomWidth, customHeight, setCustomHeight,
    seed, setSeed, batchSize, setBatchSize, artStyle, setArtStyle, generatedImages, setGeneratedImages,
    loading, setLoading, isEnhancing, setIsEnhancing, apiKey, setApiKey, darkMode, setDarkMode,
    generationHistory, setGenerationHistory, savedPrompts, setSavedPrompts, selectedHistoryImage, setSelectedHistoryImage,
    toasts, activeTab, setActiveTab, videoParams, setVideoParams, tempApiKey, setTempApiKey, showApiKey, setShowApiKey,
    modelRequiringKey, setModelRequiringKey, isTurboAuthModalOpen, setIsTurboAuthModalOpen, generatedTurboPassword, setGeneratedTurboPassword,
    turboPasswordInput, setTurboPasswordInput, turboCountdown, setTurboCountdown, coins, setCoins, countdown, setCountdown,
    adminPassword, setAdminPassword, showAdminPassword, setShowAdminPassword, audioVoice, setAudioVoice,
    generatedAudioData, generatedVideoPrompt, showBackToTop, setShowBackToTop,
    installPrompt, setInstallPrompt, isBannerVisible, setIsBannerVisible, aiSuggestions, isFetchingSuggestions,
    isLabAuthenticated, setIsLabAuthenticated, isAnalysisModalOpen, setIsAnalysisModalOpen, isPromptModalOpen, setIsPromptModalOpen,
    isAdminModalOpen, setIsAdminModalOpen, isClearHistoryModalOpen, setIsClearHistoryModalOpen, isApiModalOpen, setIsApiModalOpen,
    isMasterResetModalOpen, setIsMasterResetModalOpen, canvasRef, showToast, fetchAiSuggestions, handleRandomPrompt,
    handleModelChange, handleApiKeySubmit, handleEnhancePrompt, handleGenerate,
    handleAdminReset, handleGenerateModalPassword, handleActivateTurbo, handleClearHistory,
    handleUsePromptAndSeed, handleCreateVariation, handleDownload,
    handleLabAuthSuccess, handleMasterReset, handleInstallClick, handleBannerClose, scrollToTop,
    handleDownloadAudio, handleDownloadVideoPromptJson
  };
}