// Nama File: app/components.js

"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { Search, Minus, Plus, X, Layers, ImageDown, Diamond, Repeat, ZoomIn, Sparkles } from 'lucide-react';

export const Spinner = () => ( <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

export const NeumorphicButton = ({ children, onClick, className = '', as = 'button', loading, loadingText = "Processing...", active, ...props }) => {
  const Component = as;
  const activeStyle = active ? { boxShadow: 'var(--shadow-inset)' } : {};
  return (
    <Component onClick={onClick} disabled={loading || props.disabled} className={`p-3 rounded-xl transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 ${className} ${loading || props.disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)', ...activeStyle }}
      onMouseDown={(e) => !loading && !props.disabled && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-inset)')}
      onMouseUp={(e) => !loading && !props.disabled && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-outset)')}
      onMouseLeave={(e) => !loading && !props.disabled && !active && (e.currentTarget.style.boxShadow = 'var(--shadow-outset)')}
      {...props}
    > {loading ? <><Spinner /> {loadingText}</> : children} </Component>
  );
};

// Di dalam file app/components.js

export const Toasts = ({ toasts }) => {
  return (
    // Mengubah posisi dari right-5 ke left-5
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

export const ImageEditorModal = ({ image, onClose, onUsePromptAndSeed, onDownload, onCreateVariation, onUpscale }) => {
    const [zoom, setZoom] = useState(1);
    const [baseFilter, setBaseFilter] = useState('none');
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
        return baseFilter;
    }, [baseFilter]);

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
                           <label className="font-semibold text-sm flex items-center gap-2"><Sparkles size={16}/>Tindakan AI</label>
                           <NeumorphicButton onClick={() => onUpscale(image)} className="w-full text-sm !p-2"><ZoomIn size={16}/> Upscale 2x (Simulasi)</NeumorphicButton>
                           <NeumorphicButton onClick={() => onCreateVariation(image)} className="w-full text-sm !p-2"><Repeat size={16}/> Buat Variasi</NeumorphicButton>
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