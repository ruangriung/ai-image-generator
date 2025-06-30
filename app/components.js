"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { 
    Search, Minus, Plus, X, Layers, ImageDown, 
    Repeat, Sparkles, ChevronUp, ChevronDown, ZoomIn, ImageIcon as FileImage, Upload, Wand2, Text, Image as ImageIconLucide, Move, Grid3x3, Copy
} from 'lucide-react';

// ===================================================================
// KOMPONEN UTILITAS
// ===================================================================

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

const compressImage = (file, maxWidth = 800, quality = 0.7) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = event => { const img = new Image(); img.src = event.target.result; img.onload = () => { const canvas = document.createElement('canvas'); let { width, height } = img; if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } else { if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; } } canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height); resolve(canvas.toDataURL('image/jpeg', quality)); }; img.onerror = reject; }; reader.onerror = reject; });

export const ImageAnalysisModal = ({ isOpen, onClose, onPromptGenerated, showToast }) => {
    // ... (kode utuh tidak berubah)
    return ( isOpen ? <div>...</div> : null );
};

export const PromptEditModal = ({ isOpen, onClose, value, onSave }) => {
    // ... (kode utuh tidak berubah)
    return ( isOpen ? <div>...</div> : null );
};

// ===================================================================
// INTI PERUBAHAN: GeneratedContentDisplay yang cerdas
// ===================================================================

const EditorPanel = ({ image, onClose, onUsePromptAndSeed, onCreateVariation, onDownload, showToast }) => {
    const [baseFilter, setBaseFilter] = useState('none');
    const [watermark, setWatermark] = useState({
        type: 'text', text: '', color: '#ffffff', size: 8, opacity: 0.7,
        position: { x: 50, y: 50 }, imageUrl: null
    });
    
    const finalFilter = useMemo(() => {
        if (baseFilter !== 'none') return baseFilter;
        return 'none';
    }, [baseFilter]);

    const handleWatermarkImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { showToast('Ukuran file watermark tidak boleh melebihi 2MB.', 'error'); return; }
            const reader = new FileReader();
            reader.onload = (event) => setWatermark(w => ({ ...w, imageUrl: event.target.result }));
            reader.readAsDataURL(file);
        }
    };
    
    const setWatermarkPosition = (x, y) => setWatermark(w => ({ ...w, position: { x, y } }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-500/20 mt-6">
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Aksi</h3>
                <NeumorphicButton onClick={() => onUsePromptAndSeed(image.prompt, image.seed)} className="w-full text-sm !p-2"><Layers/>Gunakan Prompt & Seed</NeumorphicButton>
                <NeumorphicButton onClick={() => onCreateVariation(image.prompt)} className="w-full text-sm !p-2"><Repeat size={16}/> Buat Variasi</NeumorphicButton>
                <NeumorphicButton onClick={() => onDownload(image, finalFilter, watermark)} className="w-full text-sm !p-2 font-bold"><ImageDown/>Unduh Gambar</NeumorphicButton>
                <NeumorphicButton onClick={onClose} className="w-full text-sm !p-2"><X/> Kembali ke Grid</NeumorphicButton>
            </div>
            <div className="space-y-4">
                 <CollapsibleSection title="Filter" icon={<Sparkles size={18}/>} defaultOpen={true}>
                    <div>
                        <label className="font-semibold text-sm">Filter Dasar</label>
                        <select onChange={(e) => setBaseFilter(e.target.value)} value={baseFilter} className="w-full p-3 mt-1 rounded-lg neumorphic-input bg-[var(--bg-color)]">
                           <option value="none">Normal</option>
                           <option value="grayscale(100%)">Grayscale</option>
                           <option value="sepia(100%)">Sepia</option>
                           <option value="invert(100%)">Invert</option>
                           <option value="hue-rotate(90deg)">Alien</option>
                           <option value="brightness(1.5)">Terang</option>
                        </select>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Watermark" icon={<Move size={18}/>} defaultOpen={true}>
                    <div className="flex gap-2 w-full">
                        <NeumorphicButton active={watermark.type === 'text'} onClick={() => setWatermark(w => ({...w, type: 'text'}))} className="w-full text-sm !p-2"><Text size={16}/>Teks</NeumorphicButton>
                        <NeumorphicButton active={watermark.type === 'image'} onClick={() => setWatermark(w => ({...w, type: 'image'}))} className="w-full text-sm !p-2"><ImageIconLucide size={16}/>Gambar</NeumorphicButton>
                    </div>
                    {watermark.type === 'text' ? (
                        <div className="space-y-3 pt-2">
                           <input type="text" value={watermark.text} onChange={(e) => setWatermark(w => ({...w, text: e.target.value}))} placeholder="Teks watermark..." className="w-full p-2 rounded-lg neumorphic-input text-sm" />
                           <div><label className="text-xs">Warna</label><input type="color" value={watermark.color} onChange={(e) => setWatermark(w => ({...w, color: e.target.value}))} className="w-full h-8 p-1 rounded-lg"/></div>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-2">
                          <input type="file" id="watermark-upload" accept="image/png, image/jpeg" onChange={handleWatermarkImageUpload} className="hidden"/>
                          <NeumorphicButton as="label" htmlFor="watermark-upload" className="w-full text-sm !p-2"><Upload size={16}/> Unggah Gambar</NeumorphicButton>
                          {watermark.imageUrl && <img src={watermark.imageUrl} alt="watermark preview" className="w-full h-auto rounded-lg" />}
                        </div>
                    )}
                    <div className="space-y-2 pt-2 border-t border-[var(--shadow-dark)] mt-3">
                         <label className="text-sm">Ukuran ({watermark.size}%)</label>
                         <input type="range" min="1" max="50" value={watermark.size} onChange={(e) => setWatermark(w => ({...w, size: Number(e.target.value)}))} className="w-full"/>
                         <label className="text-sm">Opasitas ({Math.round(watermark.opacity * 100)}%)</label>
                         <input type="range" min="0.1" max="1" step="0.05" value={watermark.opacity} onChange={(e) => setWatermark(w => ({...w, opacity: Number(e.target.value)}))} className="w-full"/>
                         <label className="text-sm">Posisi</label>
                         <div className="grid grid-cols-3 gap-1 p-1 rounded-lg" style={{boxShadow:'var(--shadow-inset)'}}>
                            <button onClick={() => setWatermarkPosition(15, 15)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(50, 15)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(85, 15)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(15, 50)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(50, 50)} className="p-2 aspect-square neumorphic-button flex items-center justify-center"><Grid3x3 size={16}/></button>
                            <button onClick={() => setWatermarkPosition(85, 50)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(15, 85)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(50, 85)} className="p-2 aspect-square neumorphic-button"/>
                            <button onClick={() => setWatermarkPosition(85, 85)} className="p-2 aspect-square neumorphic-button"/>
                         </div>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
};


export const GeneratedContentDisplay = ({
    activeTab, loading, generatedImages, generatedVideoPrompt, generatedAudio,
    editingImage, setEditingImage, // State dan setter diterima sebagai props
    onUsePromptAndSeed, onCreateVariation, onDownload, showToast,
}) => {

    const [zoomLevel, setZoomLevel] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const startDragPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (editingImage) {
            setZoomLevel(1);
            setImagePosition({ x: 0, y: 0 });
        }
    }, [editingImage]);

    const handleZoomIn = (e) => { e.stopPropagation(); setZoomLevel(prev => Math.min(prev + 0.2, 5)); };
    const handleZoomOut = (e) => { e.stopPropagation(); setZoomLevel(prev => Math.max(prev - 0.2, 0.5)); };
    const handleResetZoom = (e) => { e.stopPropagation(); setZoomLevel(1); setImagePosition({ x: 0, y: 0 }); };

    const handleMouseDown = (e) => {
        if (e.target.closest('.zoom-control')) return;
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


    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4">{activeTab === 'image' ? 'Membuat Gambar...' : 'Memproses...'}</p>
                </div>
            );
        }

        if (activeTab === 'image') {
            // Tampilan Editor jika ada gambar yang dipilih
            if (editingImage) {
                return (
                    <div className="w-full animate-fade-in">
                        <div className="w-full h-auto max-h-[70vh] overflow-hidden rounded-lg flex items-center justify-center relative neumorphic-card" style={{boxShadow: 'var(--shadow-inset)', cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default')}}>
                            <img 
                               src={editingImage.url} alt={editingImage.prompt} onMouseDown={handleMouseDown}
                               style={{ 
                                 transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                                 transition: isDragging ? 'none' : 'transform 0.1s ease-out', 
                                 maxWidth: '100%', maxHeight: '100%', userSelect: 'none'
                               }}
                               draggable="false"
                            />
                            <div className="zoom-control absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl bg-black/40 text-white">
                               <button onClick={handleZoomOut} className="p-2 rounded-lg hover:bg-black/50 transition-colors"><Minus size={16}/></button>
                               <button onClick={handleResetZoom} className="p-2 rounded-lg hover:bg-black/50 transition-colors"><Search size={16}/></button>
                               <button onClick={handleZoomIn} className="p-2 rounded-lg hover:bg-black/50 transition-colors"><Plus size={16}/></button>
                           </div>
                        </div>
                        <EditorPanel 
                            image={editingImage}
                            onClose={() => setEditingImage(null)}
                            onUsePromptAndSeed={onUsePromptAndSeed}
                            onCreateVariation={onCreateVariation}
                            onDownload={onDownload}
                            showToast={showToast}
                        />
                    </div>
                );
            }

            // Tampilan Grid jika tidak ada gambar yang diedit
            if (generatedImages.length === 0) {
                return <p className="text-gray-500">Hasil gambar akan muncul di sini.</p>;
            }
            return (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {generatedImages.map((img) => (
                        <div key={img.date} className="group relative rounded-xl p-2 space-y-3 flex flex-col neumorphic-card"
                            onClick={() => setEditingImage(img)} style={{ cursor: 'pointer' }}>
                            <img src={img.url} className="w-full h-auto rounded-lg"/>
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                <span className="text-white font-bold py-2 px-4 rounded-lg bg-white/20 backdrop-blur-sm flex items-center gap-2"><Wand2 size={18}/> Edit & Lihat</span>
                            </div>
                            <p className="text-xs text-center opacity-60">Seed: {img.seed}</p>
                        </div>
                    ))}
                </div>
            );
        }

        // Tampilan untuk tab lain
        if (activeTab === 'video') { /* ... */ }
        if (activeTab === 'audio') { /* ... */ }

        return null;
    };
    
    return (
        <div className="p-6 rounded-2xl min-h-[50vh] flex flex-col justify-center items-center neumorphic-card">
            <h2 className="text-2xl font-bold mb-4">
                {editingImage ? 'Editor Gambar' : 'Hasil Generasi'}
            </h2>
            {renderContent()}
        </div>
    );
};
