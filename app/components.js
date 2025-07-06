// File: app/components.js

"use client";

// Hapus atau komentari impor 'next/image' karena kita tidak akan menggunakannya lagi
// import Image from 'next/image'; 

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { 
    Search, Minus, Plus, X, Layers, ImageDown, 
    Repeat, Sparkles, ChevronUp, ChevronDown, ZoomIn, ImageIcon as FileImage, Upload, Wand2, Text, Image as ImageIconLucide, Move, Grid3x3, Copy
} from 'lucide-react';

// ... (Komponen lain seperti CollapsibleSection, Spinner, dll tidak perlu diubah) ...
export const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-gray-500/20 pt-2 mt-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-2 text-left">
                <h4 className="font-semibold flex items-center gap-2">{icon} {title}</h4>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && <div className="py-2 space-y-4">{children}</div>}
        </div>
    );
};

export const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const NeumorphicButton = ({ children, onClick, className = '', as = 'button', loading, loadingText = "Processing...", active, ...props }) => {
  const Component = as;
  const activeStyle = active ? { boxShadow: 'var(--shadow-inset)' } : {};
  return (
    <Component
      onClick={onClick}
      disabled={loading || props.disabled}
      className={`p-3 rounded-xl transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 ${className} ${loading || props.disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)', ...activeStyle }}
      onMouseDown={(e) => !loading && !props.disabled && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-inset)')}
      onMouseUp={(e) => !loading && !props.disabled && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-outset)')}
      onMouseLeave={(e) => !loading && !props.disabled && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-outset)')}
      {...props}
    >
      {loading ? <><Spinner /> {loadingText}</> : children}
    </Component>
  );
};

export const Toasts = ({ toasts }) => {
  return (
    <div className="fixed bottom-5 left-5 z-[100] flex flex-col items-start space-y-2">
      {toasts.map((toast) => {
        const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
        return (
          <div key={toast.id} className={`p-4 rounded-xl text-white shadow-lg animate-fade-in-up ${colors[toast.type]}`}>
            {toast.message}
          </div>
        );
      })}
    </div>
  );
};

const compressImage = (file, maxWidth = 800, quality = 0.7) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = event => { const img = document.createElement('img'); img.src = event.target.result; img.onload = () => { const canvas = document.createElement('canvas'); let { width, height } = img; if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } else { if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; } } canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height); resolve(canvas.toDataURL('image/jpeg', quality)); }; img.onerror = reject; }; reader.onerror = reject; });

export const ImageAnalysisModal = ({ isOpen, onClose, onPromptGenerated, showToast }) => {
    const [previewSrc, setPreviewSrc] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
             if (file.size > 2 * 1024 * 1024) { 
                showToast('Ukuran file tidak boleh melebihi 2MB.', 'error');
                return;
            }
            try {
                const compressedImageSrc = await compressImage(file);
                setPreviewSrc(compressedImageSrc);
                setAnalysisResult('');
            } catch (error) { showToast('Gagal memproses gambar.', 'error'); console.error(error); }
        }
    };

    const handleAnalyze = async () => {
        if (!previewSrc) { showToast('Silakan unggah gambar terlebih dahulu.', 'error'); return; }
        setIsAnalyzing(true); setAnalysisResult('');
        try {
            const response = await fetch('/api/analyze-image', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: previewSrc })
            });
            if (!response.ok || !response.body) { const errorData = await response.json(); throw new Error(errorData.error || 'Analisis gagal.'); }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.substring(6).trim();
                        if (dataStr === "[DONE]") continue;
                        try {
                            const jsonData = JSON.parse(dataStr);
                            const textChunk = jsonData?.choices?.[0]?.delta?.content;
                            if (textChunk) { setAnalysisResult(prev => prev + textChunk); }
                        } catch (e) { console.error("Error parsing stream chunk:", e); }
                    }
                }
            }
        } catch (error) { showToast(error.message, 'error'); setAnalysisResult('Gagal menganalisis gambar. Silakan coba lagi.'); } 
        finally { setIsAnalyzing(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="p-6 rounded-2xl w-full max-w-2xl flex flex-col gap-4 neumorphic-card" style={{ background: 'var(--bg-color)', maxHeight: '90vh' }}>
                <div className="flex-shrink-0 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FileImage size={22}/> Analisis Gambar untuk Prompt</h2>
                    <NeumorphicButton onClick={onClose} className="!p-2"><X size={20} /></NeumorphicButton>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg flex flex-col items-center justify-center gap-3" style={{boxShadow:'var(--shadow-inset)'}}>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                            {previewSrc ? (<img src={previewSrc} alt="Pratinjau Gambar" className="max-h-48 w-auto rounded-lg" />) : (<div className="text-center opacity-70"><FileImage size={48} className="mx-auto"/> <p>Pilih gambar</p></div>)}
                            <NeumorphicButton onClick={() => fileInputRef.current.click()} className="w-full text-sm !p-2"><Upload size={16}/> {previewSrc ? 'Ganti Gambar' : 'Unggah Gambar'}</NeumorphicButton>
                        </div>
                        <div className="p-4 rounded-lg flex flex-col" style={{boxShadow:'var(--shadow-inset)'}}>
                            <h4 className="font-semibold mb-2">Hasil Analisis</h4>
                            <div className="flex-grow min-h-[100px] text-sm overflow-y-auto pr-2">
                                {isAnalyzing && <div className="flex items-center gap-2"><Spinner/> Menganalisis...</div>}
                                {analysisResult && <p className="whitespace-pre-wrap">{analysisResult}</p>}
                                {!isAnalyzing && !analysisResult && <p className="opacity-60">Deskripsi gambar akan muncul di sini.</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 flex gap-4 pt-4 border-t border-[var(--shadow-dark)]/20">
                    <NeumorphicButton onClick={handleAnalyze} loading={isAnalyzing} loadingText="Menganalisis..." className="w-full font-bold" disabled={!previewSrc}><Sparkles size={18}/> Analisis</NeumorphicButton>
                    <NeumorphicButton onClick={() => onPromptGenerated(analysisResult)} className="w-full font-bold" disabled={!analysisResult || isAnalyzing}><Wand2 size={18}/> Gunakan Prompt Ini</NeumorphicButton>
                </div>
            </div>
        </div>
    );
};

export const PromptEditModal = ({ isOpen, onClose, value, onSave }) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef(null);

    useEffect(() => {
        setText(value);
    }, [value]);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [isOpen, text]);

    const handleSave = () => {
        onSave(text);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="p-6 rounded-2xl w-full max-w-lg flex flex-col gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Edit Prompt</h2>
                    <NeumorphicButton onClick={onClose} className="!p-2"><X size={20} /></NeumorphicButton>
                </div>
                <div className="relative w-full">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-3 rounded-lg neumorphic-input resize-none overflow-hidden min-h-[150px]"
                        placeholder="Ketik ide gambarmu di sini..."
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <NeumorphicButton onClick={onClose}>Batal</NeumorphicButton>
                    <NeumorphicButton onClick={handleSave} className="font-bold">Simpan</NeumorphicButton>
                </div>
            </div>
        </div>
    );
};

export const GeneratedContentDisplay = ({
    loading, generatedImages, generatedVideoPrompt, generatedAudio,
    onUsePromptAndSeed, onCreateVariation, onDownload, showToast,
    selectedHistoryImage
}) => {
    const imagesToShow = (generatedImages && generatedImages.length > 0)
        ? generatedImages
        : (selectedHistoryImage ? [selectedHistoryImage] : []);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [zoomModalImg, setZoomModalImg] = useState(null);
    const startDragPos = useRef({ x: 0, y: 0 });
    const [baseFilter, setBaseFilter] = useState('none');
    const [watermark, setWatermark] = useState({
        type: 'text', text: '', color: '#ffffff', size: 8, opacity: 0.7,
        position: { x: 50, y: 50 }, imageUrl: null, imageFile: null,
    });
    const [pendingWatermark, setPendingWatermark] = useState({
        type: 'text', text: '', color: '#ffffff', size: 8, opacity: 0.7,
        position: { x: 50, y: 50 }, imageUrl: null, imageFile: null,
    });
    const imageContainerRef = useRef(null);
    const watermarkRef = useRef(null);
    const [isDraggingWatermark, setIsDraggingWatermark] = useState(false);

    useEffect(() => {
        setZoomLevel(1);
        setImagePosition({ x: 0, y: 0 });
    }, [selectedIndex]);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 5));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

    const handleOpenZoomModal = (imgUrl) => {
        setZoomModalImg(imgUrl);
        setIsZoomModalOpen(true);
    };
    const handleCloseZoomModal = () => {
        setIsZoomModalOpen(false);
        setZoomModalImg(null);
    };

    const handleMouseDown = (e) => {
        if (e.target.closest('.watermark-control') || e.target.closest('.zoom-control')) return;
        e.preventDefault();
        setIsDragging(true);
        startDragPos.current = { x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y };
    };
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        setImagePosition({ x: e.clientX - startDragPos.current.x, y: e.clientY - startDragPos.current.y });
    }, [isDragging]);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const setWatermarkPosition = (x, y) => {
        setWatermark(w => ({ ...w, position: { x, y } }));
    };
    const handleWatermarkMouseDown = (e) => { e.stopPropagation(); setIsDraggingWatermark(true); };
    const handleWatermarkMove = useCallback((clientX, clientY) => {
        if (!watermarkRef.current || !imageContainerRef.current) return;
        const containerRect = imageContainerRef.current.getBoundingClientRect();
        let newX = ((clientX - containerRect.left) / containerRect.width) * 100;
        let newY = ((clientY - containerRect.top) / containerRect.height) * 100;
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));
        setWatermark(w => ({ ...w, position: { x: newX, y: newY } }));
    }, []);
    const handleWatermarkMouseMove = useCallback((e) => {
        if (isDraggingWatermark) handleWatermarkMove(e.clientX, e.clientY);
    }, [isDraggingWatermark, handleWatermarkMove]);
    const handleWatermarkMouseUp = useCallback(() => setIsDraggingWatermark(false), []);
    useEffect(() => {
        window.addEventListener('mousemove', handleWatermarkMouseMove);
        window.addEventListener('mouseup', handleWatermarkMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleWatermarkMouseMove);
            window.removeEventListener('mouseup', handleWatermarkMouseUp);
        };
    }, [handleWatermarkMouseMove, handleWatermarkMouseUp]);

    const finalFilter = useMemo(() => {
        if (baseFilter !== 'none') return baseFilter;
        return 'none';
    }, [baseFilter]);

    const ZoomModal = useCallback(({ imgUrl, onClose }) => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" style={{animation:'fade-in 0.2s'}}>
            <button onClick={onClose} className="absolute top-6 right-8 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 z-10"><X size={28}/></button>
            <div className="flex flex-col items-center w-full h-full justify-center">
                <img src={imgUrl} alt="Zoomed" className="max-h-[90vh] max-w-[95vw] rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 object-contain" style={{background:'#222'}} />
            </div>
        </div>
    ), []);

    if (loading) {
        return (
            <div className="w-full flex justify-center">
                <div className="flex flex-col items-center justify-center min-h-[300px] py-16 bg-[var(--bg-color)] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg max-w-3xl w-full">
                    <Spinner />
                    <p className="mt-6 text-xl font-semibold opacity-80">Membuat Gambar...</p>
                </div>
            </div>
        );
    }
    if (imagesToShow.length === 0) {
        return (
            <div className="w-full flex justify-center">
                <div className="rounded-2xl p-8 text-center text-gray-400 bg-[var(--bg-color)] border border-gray-200 dark:border-gray-800 neumorphic-card shadow-lg max-w-3xl w-full">
                    Hasil gambar akan muncul di sini.
                </div>
            </div>
        );
    }
    
    // --- Single Image ---
    if (imagesToShow.length === 1) {
        const img = imagesToShow[0];
        const handleApplyWatermark = () => {
            setWatermark({ ...pendingWatermark });
            showToast('Watermark diterapkan!', 'success');
        };
        const handleRemoveWatermark = () => {
            setWatermark({ type: 'text', text: '', color: '#ffffff', size: 8, opacity: 0.7, position: { x: 50, y: 50 }, imageUrl: null, imageFile: null });
            setPendingWatermark({ type: 'text', text: '', color: '#ffffff', size: 8, opacity: 0.7, position: { x: 50, y: 50 }, imageUrl: null, imageFile: null });
            showToast('Watermark dihapus.', 'info');
        };

        return (
            <div className="flex flex-col items-center w-full">
                <div className="w-full flex justify-center">
                    <div className="w-full flex flex-col items-center relative max-w-3xl">
                        <div ref={imageContainerRef}
                            className="w-full h-auto max-h-[70vh] overflow-hidden rounded-xl flex items-center justify-center relative bg-black/5 shadow-lg"
                            style={{boxShadow: 'var(--shadow-outset)', cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default'), zIndex: 1 }}
                            onMouseDown={handleMouseDown}
                        >
                            {/* ✅ PERBAIKAN: Kembali ke <img> standar dengan optimasi manual */}
                            <img
                                src={img.url}
                                alt="Generated"
                                loading="lazy"
                                decoding="async"
                                className="rounded-xl shadow-lg"
                                style={{
                                    transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                                    filter: finalFilter,
                                    transition: 'none',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    userSelect: 'none',
                                }}
                                draggable="false"
                            />
                            {/* Tombol zoom di pojok kanan atas, warna kontras */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 zoom-control rounded-lg p-1 opacity-90 hover:opacity-100 transition-all z-20"
                                style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                <button onClick={() => handleOpenZoomModal(img.url)} className="p-1 rounded hover:bg-gray-200" title="Perbesar">
                                    <ZoomIn size={18} className="text-black dark:text-white"/>
                                </button>
                                <button onClick={handleZoomIn} className="p-1 rounded hover:bg-gray-200"><Plus size={14} className="text-black dark:text-white"/></button>
                                <button onClick={handleZoomOut} className="p-1 rounded hover:bg-gray-200"><Minus size={14} className="text-black dark:text-white"/></button>
                            </div>
                            {/* Watermark jika aktif (gunakan watermark state, bukan pending) */}
                            {(watermark.text || watermark.imageUrl) && (
                                <div
                                    ref={watermarkRef}
                                    onMouseDown={handleWatermarkMouseDown}
                                    className="absolute watermark-control z-10"
                                    style={{
                                        left: `${watermark.position.x}%`,
                                        top: `${watermark.position.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        opacity: watermark.opacity,
                                        cursor: isDraggingWatermark ? 'grabbing' : 'grab',
                                        pointerEvents: 'auto',
                                        color: watermark.color,
                                        fontSize: `${watermark.size}vmin`,
                                        fontWeight: 'bold',
                                        textShadow: '0 0 2px black, 0 0 2px black',
                                        WebkitUserSelect: 'none', userSelect: 'none',
                                    }}
                                >
                                    {watermark.type === 'text' && watermark.text}
                                    {watermark.type === 'image' && watermark.imageUrl && (
                                        <img src={watermark.imageUrl} alt="Watermark preview" style={{ width: `${watermark.size * 2}px`, height: 'auto' }} />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-center opacity-60 mt-2">Seed: {img.seed}</div>
                        {isZoomModalOpen && zoomModalImg && <ZoomModal imgUrl={zoomModalImg} onClose={handleCloseZoomModal} />}
                    </div>
                </div>
                {/* Editor/aksi di bawah gambar, dalam kartu raised */}
                <div className="w-full flex justify-center">
                    <div className="max-w-3xl w-full flex flex-wrap gap-2 justify-center items-center bg-[var(--bg-color)] rounded-2xl shadow-lg p-4 mt-8 border border-gray-200 dark:border-gray-800 neumorphic-card">
                        <NeumorphicButton onClick={() => onUsePromptAndSeed?.(img.prompt, img.seed)} className="text-xs !p-2"><Layers size={16}/> Gunakan Prompt & Seed</NeumorphicButton>
                        <NeumorphicButton onClick={() => onCreateVariation?.(img.prompt)} className="text-xs !p-2"><Repeat size={16}/> Buat Variasi</NeumorphicButton>
                        <NeumorphicButton onClick={() => onDownload?.(img, finalFilter, watermark)} className="text-xs !p-2 font-bold"><ImageDown size={16}/> Unduh</NeumorphicButton>
                        <div className="flex flex-wrap items-center gap-2 ml-2">
                            <label className="text-xs font-semibold">Filter:</label>
                            <select onChange={(e) => setBaseFilter(e.target.value)} value={baseFilter} className="text-xs p-2 rounded-lg neumorphic-input bg-[var(--bg-color)] border">
                                <option value="none">Normal</option>
                                <option value="grayscale(100%)">Grayscale</option>
                                <option value="sepia(100%)">Sepia</option>
                                <option value="invert(100%)">Invert</option>
                                <option value="hue-rotate(90deg)">Alien</option>
                                <option value="brightness(1.5)">Terang</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 ml-2">
                            <label className="text-xs font-semibold">Watermark:</label>
                            <select value={pendingWatermark.type} onChange={e => setPendingWatermark(w => ({...w, type: e.target.value}))} className="text-xs p-2 rounded-lg neumorphic-input border">
                                <option value="text">Teks</option>
                                <option value="image">Gambar</option>
                            </select>
                            {pendingWatermark.type === 'text' ? (
                                <input type="text" value={pendingWatermark.text} onChange={e => setPendingWatermark(w => ({...w, text: e.target.value}))} placeholder="Isi watermark..." className="text-xs p-2 rounded-lg neumorphic-input border w-24" />
                            ) : (
                                <input type="file" accept="image/png, image/jpeg" onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                            showToast('Ukuran file watermark tidak boleh melebihi 2MB.', 'error');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setPendingWatermark(w => ({ ...w, imageUrl: event.target.result, text: '' }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} className="w-32 text-xs" />
                            )}
                            <input type="color" value={pendingWatermark.color} onChange={e => setPendingWatermark(w => ({...w, color: e.target.value}))} className="w-8 h-8 p-1 rounded-lg border" title="Warna watermark"/>
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] opacity-70">Ukuran</label>
                                <input type="range" min="1" max="50" value={pendingWatermark.size} onChange={e => setPendingWatermark(w => ({...w, size: Number(e.target.value)}))} className="w-16" title="Ukuran watermark"/>
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] opacity-70">Opasitas</label>
                                <input type="range" min="0.1" max="1" step="0.05" value={pendingWatermark.opacity} onChange={e => setPendingWatermark(w => ({...w, opacity: Number(e.target.value)}))} className="w-16" title="Opasitas watermark"/>
                            </div>
                            <NeumorphicButton onClick={handleApplyWatermark} className="text-xs !p-2 bg-primary-500 text-black dark:text-white dark:bg-primary-600">Terapkan</NeumorphicButton>
                            <NeumorphicButton onClick={handleRemoveWatermark} className="text-xs !p-2 bg-red-400 text-black dark:text-white dark:bg-red-700">Hapus</NeumorphicButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Multiple Images ---
    return (
        <div className="flex flex-col w-full">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-8 p-0">
                    {imagesToShow.map((img, idx) => (
                        <div key={img.url + img.seed} /* ... */>
                             <div
                                className="w-full h-auto max-h-[50vh] overflow-hidden rounded-xl flex items-center justify-center relative bg-black/5 shadow-md"
                                /* ... */
                            >
                                {/* ✅ PERBAIKAN: Kembali ke <img> standar dengan optimasi manual */}
                                <img
                                    src={img.url}
                                    alt="Generated"
                                    loading="lazy"
                                    decoding="async"
                                    className="rounded-xl shadow-md"
                                    style={selectedIndex === idx ? {
                                        transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                                        filter: finalFilter,
                                        transition: isDragging ? 'none' : 'transform 0.1s ease-out, filter 0.2s',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        userSelect: 'none',
                                    } : { maxWidth: '100%', maxHeight: '100%' }}
                                    draggable="false"
                                />
                                {/* Tombol zoom di pojok kanan atas, warna kontras */}
                                {selectedIndex === idx && (
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 zoom-control rounded-lg p-1 opacity-90 hover:opacity-100 transition-all z-20"
                                        style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenZoomModal(img.url); }} className="p-1 rounded hover:bg-gray-200" title="Perbesar">
                                            <ZoomIn size={18} className="text-black dark:text-white"/>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }} className="p-1 rounded hover:bg-gray-200"><Plus size={14} className="text-black dark:text-white"/></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }} className="p-1 rounded hover:bg-gray-200"><Minus size={14} className="text-black dark:text-white"/></button>
                                    </div>
                                )}
                                {/* Watermark jika aktif (gunakan watermark state, bukan pending) */}
                                {selectedIndex === idx && (watermark.text || watermark.imageUrl) && (
                                    <div
                                        ref={watermarkRef}
                                        onMouseDown={handleWatermarkMouseDown}
                                        className="absolute watermark-control z-10"
                                        style={{
                                            left: `${watermark.position.x}%`,
                                            top: `${watermark.position.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            opacity: watermark.opacity,
                                            cursor: isDraggingWatermark ? 'grabbing' : 'grab',
                                            pointerEvents: 'auto',
                                            color: watermark.color,
                                            fontSize: `${watermark.size}vmin`,
                                            fontWeight: 'bold',
                                            textShadow: '0 0 2px black, 0 0 2px black',
                                            WebkitUserSelect: 'none', userSelect: 'none',
                                        }}
                                    >
                                        {watermark.type === 'text' && watermark.text}
                                        {watermark.type === 'image' && watermark.imageUrl && (
                                            <img src={watermark.imageUrl} alt="Watermark preview" style={{ width: `${watermark.size * 2}px`, height: 'auto' }} />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-center opacity-60 mt-2">Seed: {img.seed}</div>
                            {selectedIndex === idx && isZoomModalOpen && zoomModalImg && <ZoomModal imgUrl={zoomModalImg} onClose={handleCloseZoomModal} />}
                        </div>
                    ))}
                </div>
            </div>
            {/* Editor/aksi di bawah grid, hanya jika ada gambar terpilih, dalam kartu raised */}
            {selectedIndex !== null && imagesToShow[selectedIndex] && (
                <div className="w-full flex justify-center animate-fade-in mt-10">
                    <div className="max-w-2xl w-full flex flex-col items-center">
                        <div className="relative w-full flex justify-center">
                            <div ref={imageContainerRef}
                                className="w-full h-auto max-h-[60vh] overflow-hidden rounded-xl flex items-center justify-center relative bg-black/5 shadow-md"
                                style={{boxShadow: 'var(--shadow-inset)', cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default') }}
                                onMouseDown={handleMouseDown}
                            >
                                <img
                                    src={imagesToShow[selectedIndex].url}
                                    alt="Generated"
                                    style={{
                                        transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                                        filter: finalFilter,
                                        transition: isDragging ? 'none' : 'transform 0.1s ease-out, filter 0.2s',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        userSelect: 'none',
                                    }}
                                    draggable="false"
                                    className="rounded-xl shadow-md"
                                />
                                {/* Tombol zoom di pojok kanan atas, warna kontras */}
                                <div className="absolute top-2 right-2 flex flex-col gap-1 zoom-control rounded-lg p-1 opacity-90 hover:opacity-100 transition-all z-20"
                                    style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                    <button onClick={() => handleOpenZoomModal(imagesToShow[selectedIndex].url)} className="p-1 rounded hover:bg-gray-200" title="Perbesar">
                                        <ZoomIn size={18} className="text-black dark:text-white"/>
                                    </button>
                                    <button onClick={handleZoomIn} className="p-1 rounded hover:bg-gray-200"><Plus size={14} className="text-black dark:text-white"/></button>
                                    <button onClick={handleZoomOut} className="p-1 rounded hover:bg-gray-200"><Minus size={14} className="text-black dark:text-white"/></button>
                                </div>
                                {/* Watermark jika aktif (gunakan watermark state, bukan pending) */}
                                {(watermark.text || watermark.imageUrl) && (
                                    <div
                                        ref={watermarkRef}
                                        onMouseDown={handleWatermarkMouseDown}
                                        className="absolute watermark-control z-10"
                                        style={{
                                            left: `${watermark.position.x}%`,
                                            top: `${watermark.position.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            opacity: watermark.opacity,
                                            cursor: isDraggingWatermark ? 'grabbing' : 'grab',
                                            pointerEvents: 'auto',
                                            color: watermark.color,
                                            fontSize: `${watermark.size}vmin`,
                                            fontWeight: 'bold',
                                            textShadow: '0 0 2px black, 0 0 2px black',
                                            WebkitUserSelect: 'none', userSelect: 'none',
                                        }}
                                    >
                                        {watermark.type === 'text' && watermark.text}
                                        {watermark.type === 'image' && watermark.imageUrl && (
                                            <img src={watermark.imageUrl} alt="Watermark preview" style={{ width: `${watermark.size * 2}px`, height: 'auto' }} />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-center opacity-60 mt-2">Seed: {imagesToShow[selectedIndex].seed}</div>
                        </div>
                        <div className="max-w-2xl w-full flex flex-wrap gap-2 justify-center items-center bg-[var(--bg-color)] rounded-2xl shadow-2xl p-4 mt-8 border border-gray-200 dark:border-gray-800 neumorphic-card">
                            <NeumorphicButton onClick={() => onUsePromptAndSeed?.(imagesToShow[selectedIndex].prompt, imagesToShow[selectedIndex].seed)} className="text-xs !p-2"><Layers size={16}/> Gunakan Prompt & Seed</NeumorphicButton>
                            <NeumorphicButton onClick={() => onCreateVariation?.(imagesToShow[selectedIndex].prompt)} className="text-xs !p-2"><Repeat size={16}/> Buat Variasi</NeumorphicButton>
                            <NeumorphicButton onClick={() => onDownload?.(imagesToShow[selectedIndex], finalFilter, watermark)} className="text-xs !p-2 font-bold"><ImageDown size={16}/> Unduh</NeumorphicButton>
                            {/* Filter dan watermark ringkas */}
                            <select onChange={(e) => setBaseFilter(e.target.value)} value={baseFilter} className="text-xs p-2 rounded-lg neumorphic-input bg-[var(--bg-color)] border ml-2">
                                <option value="none">Normal</option>
                                <option value="grayscale(100%)">Grayscale</option>
                                <option value="sepia(100%)">Sepia</option>
                                <option value="invert(100%)">Invert</option>
                                <option value="hue-rotate(90deg)">Alien</option>
                                <option value="brightness(1.5)">Terang</option>
                            </select>
                            <NeumorphicButton onClick={() => setWatermark(w => ({...w, type: w.type === 'text' ? 'image' : 'text'}))} className="text-xs !p-2 text-black dark:text-white bg-gray-200 dark:bg-gray-700">{watermark.type === 'text' ? 'Teks' : 'Gambar'}</NeumorphicButton>
                            {watermark.type === 'text' ? (
                                <input type="text" value={watermark.text} onChange={(e) => setWatermark(w => ({...w, text: e.target.value}))} placeholder="Watermark..." className="text-xs p-2 rounded-lg neumorphic-input border w-24" />
                            ) : (
                                <input type="file" accept="image/png, image/jpeg" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                            showToast('Ukuran file watermark tidak boleh melebihi 2MB.', 'error');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setWatermark(w => ({ ...w, imageUrl: event.target.result, text: '' }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} className="w-32 text-xs" />
                            )}
                            <input type="color" value={watermark.color} onChange={(e) => setWatermark(w => ({...w, color: e.target.value}))} className="w-8 h-8 p-1 rounded-lg border" title="Warna watermark"/>
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] opacity-70">Ukuran</label>
                                <input type="range" min="1" max="50" value={watermark.size} onChange={(e) => setWatermark(w => ({...w, size: Number(e.target.value)}))} className="w-16" title="Ukuran watermark"/>
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="text-[10px] opacity-70">Opasitas</label>
                                <input type="range" min="0.1" max="1" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark(w => ({...w, opacity: Number(e.target.value)}))} className="w-16" title="Opasitas watermark"/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isZoomModalOpen && <ZoomModal imgUrl={zoomModalImg} onClose={handleCloseZoomModal} />}
        </div>
    );
};

// ===================== MODAL KONFIRMASI HAPUS =====================
// ===================================================================
// Modal Konfirmasi Hapus Riwayat
// ===================================================================
export const ConfirmDeleteModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Hapus Riwayat?</h2>
                    <NeumorphicButton onClick={onClose} className="!p-2"><X size={20} /></NeumorphicButton>
                </div>
                <div className="text-base opacity-80">Apakah Anda yakin ingin menghapus semua riwayat gambar? Tindakan ini tidak dapat dibatalkan.</div>
                <div className="flex justify-end gap-4">
                    <NeumorphicButton onClick={onClose}>Batal</NeumorphicButton>
                    <NeumorphicButton onClick={onDelete} className="font-bold bg-red-500 dark:bg-red-700 text-black dark:text-white">Hapus</NeumorphicButton>
                </div>
            </div>
        </div>
    );
};
