// File: app/Video.js

"use client";

import { SlidersHorizontal, Camera, Sparkles, CloudSun, Video as VideoIcon } from 'lucide-react';
import { CollapsibleSection, NeumorphicButton } from './components.js';

export default function VideoSection({
  videoParams,
  setVideoParams,
  handleGenerate,
  loading,
  generatedVideoPrompt,
  showToast // Menerima showToast sebagai prop
}) {

  // Fungsi untuk menangani perubahan pada form video
  const handleVideoParamsChange = (e) => {
    const { name, value, type } = e.target;
    setVideoParams(p => ({
      ...p,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <label className="font-semibold block text-xl">Asisten Prompt Video</label>
      <div>
        <label className="text-sm font-semibold">
          Konsep Utama Video <span className="text-red-500">*</span>
        </label>
        <textarea
          name="concept"
          value={videoParams.concept}
          onChange={handleVideoParamsChange}
          placeholder="Cth: Detektif cyberpunk di gang neon..."
          className="w-full p-3 mt-1 rounded-lg neumorphic-input h-28 resize-none"
        />
      </div>
      <CollapsibleSection title="Pengaturan Dasar" icon={<SlidersHorizontal size={18} />}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Gaya Visual</label>
            <select name="visualStyle" value={videoParams.visualStyle} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Cinematic", "Anime", "Photorealistic", "Watercolor", "Pixel Art", "Cyberpunk", "Retro", "Futuristic"].map(o => <option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Durasi (detik)</label>
            <input type="number" name="duration" value={videoParams.duration} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm" />
          </div>
          <div>
            <label className="text-sm font-semibold">Aspek Rasio</label>
            <select name="aspectRatio" value={videoParams.aspectRatio} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["16:9", "9:16", "1:1", "4:3", "21:9"].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Frame Rate</label>
            <select name="fps" value={videoParams.fps} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {[24, 30, 60, 120].map(o => <option key={o} value={o}>{o} fps</option>)}
            </select>
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Sinematografi" icon={<Camera size={18} />}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Gerakan Kamera</label>
            <select name="cameraMovement" value={videoParams.cameraMovement} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Static", "Slow Pan", "Dolly", "Tracking", "Crane", "Steadycam", "Handheld", "Drone"].map(o => <option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Sudut Kamera</label>
            <select name="cameraAngle" value={videoParams.cameraAngle} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Eye Level", "Low Angle", "High Angle", "Dutch Angle", "Overhead", "Point of View"].map(o => <option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Tipe Lensa</label>
            <select name="lensType" value={videoParams.lensType} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Standard (50mm)", "Wide Angle (24mm)", "Telephoto (85mm+)", "Fisheye", "Anamorphic", "Macro"].map(o => <option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Depth of Field</label>
            <select name="depthOfField" value={videoParams.depthOfField} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Shallow", "Medium", "Deep"].map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
            </select>
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Efek Visual" icon={<Sparkles size={18} />}>
        <div>
          <label className="text-sm font-semibold">Film Grain ({videoParams.filmGrain}%)</label>
          <input type="range" name="filmGrain" value={videoParams.filmGrain} onChange={handleVideoParamsChange} min="0" max="100" className="w-full" />
        </div>
        <div>
          <label className="text-sm font-semibold">Chromatic Aberration ({videoParams.chromaticAberration}%)</label>
          <input type="range" name="chromaticAberration" value={videoParams.chromaticAberration} onChange={handleVideoParamsChange} min="0" max="100" className="w-full" />
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Mood & Suasana" icon={<CloudSun size={18} />}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Waktu</label>
            <select name="timeOfDay" value={videoParams.timeOfDay} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Golden Hour", "Blue Hour", "Midday", "Night", "Sunrise", "Sunset", "Twilight"].map(o => <option key={o} value={o.toLowerCase().replace(/ /g, "-")}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Cuaca</label>
            <select name="weather" value={videoParams.weather} onChange={handleVideoParamsChange} className="w-full p-2 mt-1 rounded-lg neumorphic-input text-sm bg-[var(--bg-color)]">
              {["Clear", "Cloudy", "Rainy", "Foggy", "Snowy", "Stormy"].map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
            </select>
          </div>
        </div>
      </CollapsibleSection>
      <NeumorphicButton onClick={handleGenerate} loading={loading} loadingText="Membangun..." className="w-full !mt-6 font-bold text-lg">
        <Sparkles size={18} />Buat Prompt Video
      </NeumorphicButton>
    </div>
  );
}