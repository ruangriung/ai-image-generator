// File: app/page.js

"use client";

import { Sun, Moon, Wand2, Upload, Coins, Clock, Settings, Trash2, ChevronUp, Download, X } from 'lucide-react';
import { useAppState } from './useAppState.js';

import { Spinner, NeumorphicButton, Toasts, GeneratedContentDisplay } from './components.js';
import ChatbotAssistant from './ChatbotAssistant.js';
import Lab from './Lab.js';
import HistorySection from './History.js';
import VideoSection from './Video.js';
import AudioSection from './Audio.js';
import ImageTab from './ImageTab.js';
import TabSelector from './TabSelector.js';
import Modals from './Modals.js';
import AuthButtons from './AuthButtons.js';

export default function AIImageGenerator() {
  const state = useAppState();

  if (!state.isMounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><Spinner /></div>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]`}>
      {state.isBannerVisible && (
       <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 flex items-center justify-center gap-4 z-50 shadow-lg animate-fade-in">
          <span className="text-sm md:text-base">Install aplikasi untuk akses lebih cepat!</span>
          <button 
            onClick={state.handleInstallClick} 
            className="bg-white text-blue-700 font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-200 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <Download size={16} />
            Install
          </button>
          <button onClick={state.handleBannerClose} className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>
      )}

      <style jsx global>{`
          :root {
            --bg-color: #e0e0e0;
            --text-color: #313131;
            --shadow-light: #ffffff;
            --shadow-dark: #bebebe;
            --shadow-outset: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
            --shadow-inset: inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light);
          }
          .dark {
            --bg-color: #3a3a3a;
            --text-color: #e0e0e0;
            --shadow-light: #464646;
            --shadow-dark: #2e2e2e;
          }
          .neumorphic-input, .neumorphic-select, .neumorphic-card {
            background: var(--bg-color);
            color: var(--text-color);
          }
          .neumorphic-card {
            box-shadow: var(--shadow-outset);
            transition: background 0.3s ease, color 0.3s ease;
          }
          .neumorphic-input, .neumorphic-select {
            box-shadow: var(--shadow-inset);
            border: none;
          }
          button, .neumorphic-btn, .neumorphic-button, .neumorphicButton {
            min-width: 44px;
            min-height: 44px;
            outline: none;
          }
          button:focus-visible, .neumorphic-btn:focus-visible, .neumorphic-button:focus-visible, .neumorphicButton:focus-visible {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
          }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
      
      <Toasts toasts={state.toasts} />
      <canvas ref={state.canvasRef} className="hidden"></canvas>
      
      <Modals {...state} />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 pt-20">
          <header className="flex flex-col gap-4 items-center text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2 md:gap-3">
              <Wand2 className="text-yellow-500 h-8 w-8 md:h-9 md:w-9 flex-shrink-0" />
              <span>RuangRiung AI Generator</span>
            </h1>
            <h2 className="text-lg md:text-xl font-semibold mt-2">Tuangkan Imajinasimu, Biarkan AI Mewujudkannya</h2>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 sm:gap-4 p-2 rounded-xl" style={{ boxShadow: 'var(--shadow-outset)' }}>
                <div className="flex items-center gap-2 border-r border-transparent sm:border-[var(--shadow-dark)] dark:sm:border-[var(--shadow-light)] pr-2 sm:pr-3"><Coins size={20} className="text-yellow-500" /><span className="font-bold">{state.coins}</span></div>
                <div className="flex items-center gap-2 pr-2 sm:pr-3"><Clock size={20} className="opacity-70" /><span className="font-mono text-sm font-semibold">{state.countdown}</span></div>
                <NeumorphicButton aria-label="Buka pengaturan" onClick={() => state.setIsAdminModalOpen(true)} className="!p-2"><Settings size={16} /></NeumorphicButton>
              </div>
              <NeumorphicButton aria-label={state.darkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap"} onClick={() => state.setDarkMode(!state.darkMode)} className="!p-3">{state.darkMode ? <Sun /> : <Moon />}</NeumorphicButton>
              <AuthButtons />
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl h-fit space-y-4 neumorphic-card">
                <TabSelector activeTab={state.activeTab} setActiveTab={state.setActiveTab} />
                {state.activeTab === 'image' && <ImageTab {...state} />}
                {state.activeTab === 'video' && <VideoSection {...state} />}
                {state.activeTab === 'audio' && <AudioSection {...state} />}
                {state.activeTab === 'lab' && <Lab isAuthenticated={state.isLabAuthenticated} onAuthSuccess={state.handleLabAuthSuccess} showToast={state.showToast} />}
              </div>
              <div className="p-6 rounded-2xl h-fit neumorphic-card">
                <h3 className="font-bold text-lg mb-4">Buat Prompt dari Gambar</h3>
                <NeumorphicButton onClick={() => state.setIsAnalysisModalOpen(true)} className="w-full"><Upload size={16} /> Analisis Gambar</NeumorphicButton>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-8">
              {/* --- PERBAIKAN UTAMA DI SINI --- */}
              <GeneratedContentDisplay
                  activeTab={state.activeTab}
                  loading={state.loading}
                  generatedImages={state.generatedImages}
                  generatedVideoPrompt={state.generatedVideoPrompt}
                  generatedAudio={state.generatedAudio}
                  onUsePromptAndSeed={state.handleUsePromptAndSeed} // <- Nama prop yang benar
                  onCreateVariation={state.handleCreateVariation} // <- Nama prop yang benar
                  onDownload={state.handleDownload}                 // <- Nama prop yang benar
                  showToast={state.showToast}
                  selectedHistoryImage={state.selectedHistoryImage}
              />
              
              {state.activeTab === 'lab' && !state.loading && (
                <div className="w-full flex justify-center">
                  <div className="rounded-2xl p-8 text-center text-gray-400 bg-[var(--bg-color)] border border-gray-200 dark:border-gray-800 neumorphic-card shadow-lg max-w-3xl w-full">
                    {state.isLabAuthenticated ? 'Hasil eksperimen Lab akan muncul di sini.' : 'Masukkan kata sandi untuk melihat konten Lab.'}
                  </div>
                </div>
              )}
              
              {/* --- PERBAIKAN KEDUA DI SINI --- */}
              <HistorySection
                generationHistory={state.generationHistory}
                setGenerationHistory={state.setGenerationHistory}
                savedPrompts={state.savedPrompts}
                setSavedPrompts={state.setSavedPrompts}
                setSelectedHistoryImage={state.setSelectedHistoryImage}
                setGeneratedImages={state.setGeneratedImages}
                setIsClearHistoryModalOpen={state.setIsClearHistoryModalOpen}
                showToast={state.showToast}
                setPrompt={state.setPrompt}
                setSeed={state.setSeed}
                // Pastikan prop ini juga diteruskan ke HistorySection
                onUsePromptAndSeed={state.handleUsePromptAndSeed} // <- Nama prop yang benar
              />
            </div>
          </div>
        </main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center mt-8">
          <NeumorphicButton onClick={() => state.setIsMasterResetModalOpen(true)} className="w-full max-w-md !text-red-500 !font-semibold">
            <Trash2 size={16} /> Reset Semua Data Aplikasi
          </NeumorphicButton>
        </div>
        <footer className="text-center p-4 mt-8 border-t border-gray-500/20 text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} RuangRiung AI Image Generator - Developed with ❤️ by{' '}
            <a href="https://ariftirtana.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Arif Tirtana
            </a>
          </p>
        </footer>
      </div>
      {state.showBackToTop && (
        <NeumorphicButton onClick={state.scrollToTop} className="!p-3 fixed bottom-5 right-5 z-50 !rounded-full animate-fade-in" title="Back to Top">
          <ChevronUp size={24} />
        </NeumorphicButton>
      )}
      <ChatbotAssistant />
    </div>
  );
}