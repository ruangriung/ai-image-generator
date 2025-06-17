"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { 
    Search, Minus, Plus, X, Layers, ImageDown, 
    Repeat, Sparkles, ChevronUp, ChevronDown, ZoomIn, ImageIcon as FileImage, Upload, Wand2, Text, Image as ImageIconLucide, Move, Grid3x3
} from 'lucide-react';

// Komponen untuk bagian yang bisa ditutup/buka
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

export const ImageEditorModal = ({ image, onClose, onUsePromptAndSeed, onDownload, onCreateVariation, showToast }) => {
  const [zoom, setZoom] = useState(1);
  const [baseFilter, setBaseFilter] = useState('none');
  const [enhancements, setEnhancements] = useState({ sharpness: false, hdr: false, colorBoost: false });
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const [watermark, setWatermark] = useState({
      type: 'text', // 'text' or 'image'
      text: '',
      color: '#ffffff',
      size: 8, // in percentage of image width
      opacity: 0.7,
      position: { x: 50, y: 50 }, // in percentage
      imageUrl: null,
      imageFile: null,
  });
  
  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false);
  const watermarkRef = useRef(null);
  const imageContainerRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  const finalFilter = useMemo(() => {
    const filters = [];
    if (baseFilter !== 'none') filters.push(baseFilter);
    if (enhancements.sharpness) filters.push('contrast(1.2)');
    if (enhancements.hdr) filters.push('saturate(1.5) contrast(1.1)');
    if (enhancements.colorBoost) filters.push('saturate(1.2)');
    return filters.join(' ');
  }, [baseFilter, enhancements]);

  // Main image drag handlers
  const handleMouseDown = (e) => { setIsDragging(true); startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y }; };
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseMove = useCallback((e) => { if (!isDragging) return; setPosition({ x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y }); }, [isDragging]);

  // Watermark drag handlers
  const handleWatermarkMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingWatermark(true);
  };

  const handleWatermarkTouchStart = (e) => {
    e.stopPropagation();
    setIsDraggingWatermark(true);
  };

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
    if (!isDraggingWatermark) return;
    handleWatermarkMove(e.clientX, e.clientY);
  }, [isDraggingWatermark, handleWatermarkMove]);

  const handleWatermarkTouchMove = useCallback((e) => {
    if (!isDraggingWatermark) return;
    const touch = e.touches[0];
    handleWatermarkMove(touch.clientX, touch.clientY);
  }, [isDraggingWatermark, handleWatermarkMove]);

  const handleWatermarkMouseUp = useCallback(() => {
    setIsDraggingWatermark(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    window.addEventListener('mousemove', handleWatermarkMouseMove);
    window.addEventListener('mouseup', handleWatermarkMouseUp);
    
    window.addEventListener('touchmove', handleWatermarkTouchMove);
    window.addEventListener('touchend', handleWatermarkMouseUp); // Use same mouseup for touchend

    return () => { 
        window.removeEventListener('mousemove', handleMouseMove); 
        window.removeEventListener('mouseup', handleMouseUp);

        window.removeEventListener('mousemove', handleWatermarkMouseMove);
        window.removeEventListener('mouseup', handleWatermarkMouseUp);

        window.removeEventListener('touchmove', handleWatermarkTouchMove);
        window.removeEventListener('touchend', handleWatermarkMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleWatermarkMouseMove, handleWatermarkMouseUp, handleWatermarkTouchMove]);

  const handleWatermarkImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showToast('Ukuran file watermark tidak boleh melebihi 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setWatermark(w => ({ ...w, imageUrl: event.target.result, imageFile: file }));
    };
    reader.readAsDataURL(file);
  };
  
  const setWatermarkPosition = (x, y) => {
      setWatermark(w => ({ ...w, position: { x, y } }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="p-4 rounded-2xl w-full max-w-6xl h-[90vh] flex gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}>
        <div ref={imageContainerRef} className="flex-grow h-full overflow-hidden rounded-lg flex items-center justify-center relative neumorphic-card" style={{ boxShadow: 'var(--shadow-inset)' }}>
          <img src={image.url} alt="Editing image" onMouseDown={handleMouseDown} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, filter: finalFilter, transition: 'filter 0.2s', cursor: isDragging ? 'grabbing' : 'grab', maxWidth: '100%', maxHeight: '100%' }} />
           
           {/* Watermark Preview */}
           {(watermark.text || watermark.imageUrl) && (
             <div
               ref={watermarkRef}
               onMouseDown={handleWatermarkMouseDown}
               onTouchStart={handleWatermarkTouchStart}
               className="absolute"
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
                 WebkitUserSelect: 'none',
                 MozUserSelect: 'none',
                 msUserSelect: 'none',
                 userSelect: 'none',
               }}
             >
               {watermark.type === 'text' && watermark.text}
               {watermark.type === 'image' && watermark.imageUrl && (
                 <img src={watermark.imageUrl} alt="Watermark preview" style={{ width: `${watermark.size * 2}px`, height: 'auto' }}/>
               )}
             </div>
           )}
        </div>
        <div className="w-80 h-full flex flex-col gap-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Editor</h2><NeumorphicButton onClick={onClose} className="!p-2"><X size={20} /></NeumorphicButton></div>
          <div className="flex flex-col gap-4 p-4 rounded-xl neumorphic-card flex-grow overflow-y-auto">
            {/* Zoom and Filter */}
            <CollapsibleSection title="Zoom & Filter" icon={<ZoomIn size={18}/>} defaultOpen={true}>
                 <div><label className="font-semibold text-sm">Zoom</label><div className="flex items-center gap-2 p-2 rounded-xl mt-1" style={{boxShadow: 'var(--shadow-outset)'}}><NeumorphicButton onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-full !p-2"><Minus size={16}/></NeumorphicButton><NeumorphicButton onClick={() => {setZoom(1); setPosition({x:0, y:0})}} className="w-full !p-2"><Search size={16}/></NeumorphicButton><NeumorphicButton onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="w-full !p-2"><Plus size={16}/></NeumorphicButton></div></div>
                <div><label className="font-semibold text-sm">Filter Dasar</label><select onChange={(e) => setBaseFilter(e.target.value)} value={baseFilter} className="w-full p-3 mt-1 rounded-lg neumorphic-input bg-[var(--bg-color)]"><option value="none">Normal</option><option value="grayscale(100%)">Grayscale</option><option value="sepia(100%)">Sepia</option><option value="invert(100%)">Invert</option><option value="hue-rotate(90deg)">Alien</option><option value="brightness(1.5)">Terang</option></select></div>
            </CollapsibleSection>
            
            {/* Watermark Section */}
            <CollapsibleSection title="Watermark" icon={<Move size={18}/>} defaultOpen={true}>
              <div className="flex gap-2 w-full">
                  <NeumorphicButton active={watermark.type === 'text'} onClick={() => setWatermark(w => ({...w, type: 'text'}))} className="w-full text-sm !p-2"><Text size={16}/>Teks</NeumorphicButton>
                  <NeumorphicButton active={watermark.type === 'image'} onClick={() => setWatermark(w => ({...w, type: 'image'}))} className="w-full text-sm !p-2"><ImageIconLucide size={16}/>Gambar</NeumorphicButton>
              </div>

              {watermark.type === 'text' ? (
                <div className="space-y-3 pt-2">
                   <input type="text" value={watermark.text} onChange={(e) => setWatermark(w => ({...w, text: e.target.value}))} placeholder="Teks watermark..." className="w-full p-2 rounded-lg neumorphic-input text-sm" />
                   <div className="grid grid-cols-2 gap-2">
                       <div><label className="text-xs">Warna</label><input type="color" value={watermark.color} onChange={(e) => setWatermark(w => ({...w, color: e.target.value}))} className="w-full h-8 p-1 rounded-lg"/></div>
                   </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <input type="file" id="watermark-upload" accept="image/png, image/jpeg" onChange={handleWatermarkImageUpload} className="hidden"/>
                  <NeumorphicButton as="label" htmlFor="watermark-upload" className="w-full text-sm !p-2">
                    <Upload size={16}/> Unggah Gambar (Max 2MB)
                  </NeumorphicButton>
                  {watermark.imageUrl && <img src={watermark.imageUrl} alt="watermark preview" className="w-full h-auto rounded-lg" />}
                </div>
              )}
              
              <div className="space-y-2 pt-2 border-t border-[var(--shadow-dark)] mt-3">
                 <label className="text-sm">Ukuran ({watermark.size}%)</label>
                 <input type="range" min="1" max="50" value={watermark.size} onChange={(e) => setWatermark(w => ({...w, size: Number(e.target.value)}))} className="w-full"/>
                 
                 <label className="text-sm">Opasitas ({Math.round(watermark.opacity * 100)}%)</label>
                 <input type="range" min="0.1" max="1" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark(w => ({...w, opacity: Number(e.target.value)}))} className="w-full"/>
              
                 <label className="text-sm">Posisi Cepat</label>
                 <div className="grid grid-cols-3 gap-1 p-1 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}>
                    <NeumorphicButton onClick={() => setWatermarkPosition(10,10)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(50,10)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(90,10)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(10,50)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(50,50)} className="!p-2 aspect-square"><Grid3x3 size={16}/></NeumorphicButton>
                    <NeumorphicButton onClick={() => setWatermarkPosition(90,50)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(10,90)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(50,90)} className="!p-2 aspect-square"/>
                    <NeumorphicButton onClick={() => setWatermarkPosition(90,90)} className="!p-2 aspect-square"/>
                 </div>
              </div>
            </CollapsibleSection>

            <div className="flex-grow"></div>
            <div className="space-y-3 pt-4 border-t border-[var(--shadow-dark)]">
               <NeumorphicButton onClick={() => onUsePromptAndSeed(image.prompt, image.seed)} className="w-full text-sm !p-2"><Layers/>Gunakan Prompt & Seed</NeumorphicButton>
               <NeumorphicButton onClick={() => onCreateVariation(image)} className="w-full text-sm !p-2"><Repeat size={16}/> Buat Variasi</NeumorphicButton>
               <NeumorphicButton onClick={() => onDownload(image, finalFilter, watermark)} className="w-full text-sm !p-2 font-bold"><ImageDown/>Unduh Gambar</NeumorphicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const compressImage = (file, maxWidth = 800, quality = 0.7) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = event => { const img = new Image(); img.src = event.target.result; img.onload = () => { const canvas = document.createElement('canvas'); let { width, height } = img; if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } else { if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; } } canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height); resolve(canvas.toDataURL('image/jpeg', quality)); }; img.onerror = reject; }; reader.onerror = reject; });

export const ImageAnalysisModal = ({ isOpen, onClose, onPromptGenerated, showToast }) => {
    const [previewSrc, setPreviewSrc] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
             if (file.size > 2 * 1024 * 1024) { // 2MB limit
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
            <div className="p-6 rounded-2xl w-full max-w-2xl flex flex-col gap-4 neumorphic-card" style={{ background: 'var(--bg-color)' }}>
                <div className="flex justify-between items-center"><h2 className="text-xl font-bold flex items-center gap-2"><FileImage size={22}/> Analisis Gambar untuk Prompt</h2><NeumorphicButton onClick={onClose} className="!p-2"><X size={20} /></NeumorphicButton></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg flex flex-col items-center justify-center gap-3" style={{boxShadow:'var(--shadow-inset)'}}><input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>{previewSrc ? (<img src={previewSrc} alt="Pratinjau Gambar" className="max-h-48 w-auto rounded-lg" />) : (<div className="text-center opacity-70"><FileImage size={48} className="mx-auto"/> <p>Pilih gambar</p></div>)}<NeumorphicButton onClick={() => fileInputRef.current.click()} className="w-full text-sm !p-2"><Upload size={16}/> {previewSrc ? 'Ganti Gambar' : 'Unggah Gambar'}</NeumorphicButton></div>
                    <div className="p-4 rounded-lg flex flex-col" style={{boxShadow:'var(--shadow-inset)'}}><h4 className="font-semibold mb-2">Hasil Analisis</h4><div className="flex-grow min-h-[100px] text-sm overflow-y-auto pr-2">{isAnalyzing && <div className="flex items-center gap-2"><Spinner/> Menganalisis...</div>}{analysisResult && <p className="whitespace-pre-wrap">{analysisResult}</p>}{!isAnalyzing && !analysisResult && <p className="opacity-60">Deskripsi gambar akan muncul di sini.</p>}</div></div>
                </div>
                <div className="flex gap-4">
                    <NeumorphicButton onClick={handleAnalyze} loading={isAnalyzing} loadingText="Menganalisis..." className="w-full font-bold" disabled={!previewSrc}><Sparkles size={18}/> Analisis</NeumorphicButton>
                    <NeumorphicButton onClick={() => onPromptGenerated(analysisResult)} className="w-full font-bold" disabled={!analysisResult || isAnalyzing}><Wand2 size={18}/> Gunakan Prompt Ini</NeumorphicButton>
                </div>
            </div>
        </div>
    );
};
