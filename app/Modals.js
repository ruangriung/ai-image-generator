// File: app/Modals.js

"use client";

import { X, EyeOff, Eye, RefreshCw, KeyRound, Check, Trash2 } from 'lucide-react';
import { NeumorphicButton, ImageAnalysisModal, PromptEditModal } from './components.js';

export default function Modals({
  // Props untuk semua modal
  isAnalysisModalOpen, setIsAnalysisModalOpen,
  isPromptModalOpen, setIsPromptModalOpen,
  isAdminModalOpen, setIsAdminModalOpen,
  isClearHistoryModalOpen, setIsClearHistoryModalOpen,
  isApiModalOpen, setIsApiModalOpen,
  isTurboAuthModalOpen, setIsTurboAuthModalOpen,
  isMasterResetModalOpen, setIsMasterResetModalOpen,

  // Props spesifik
  prompt, setPrompt,
  showToast,
  adminPassword, setAdminPassword,
  showAdminPassword, setShowAdminPassword,
  handleAdminReset,
  handleClearHistory,
  tempApiKey, setTempApiKey,
  showApiKey, setShowApiKey,
  modelRequiringKey, handleApiKeySubmit,
  setModel,
  generatedTurboPassword, turboPasswordInput, setTurboPasswordInput,
  handleGenerateModalPassword, handleActivateTurbo,
  handleMasterReset,

  // --- Props baru untuk ImageAnalysisModal ---
  setActiveTab
}) {
  return (
    <>
      <ImageAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onPromptGenerated={(p) => {
          setPrompt(p);
          showToast("Prompt dari gambar berhasil dibuat!", "success");
          setIsAnalysisModalOpen(false);
          setActiveTab('image'); // Langsung pindah ke tab gambar
        }}
        showToast={showToast}
      />

      <PromptEditModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        value={prompt}
        onSave={(newPrompt) => setPrompt(newPrompt)}
      />

      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Panel Admin</h2>
              <NeumorphicButton onClick={() => setIsAdminModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton>
            </div>
            <p className="mb-4 text-sm"> Masukkan password admin untuk mengakses fitur. atau hubungi Admin ruangriung di halaman <a style={{ color: "#3b82f6" }} href="https://web.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener noreferrer">Facebook RuangRiung</a>.</p>
            <div className="relative w-full mb-4">
              <label htmlFor="admin-password-input" className="sr-only">Password Admin</label>
              <input id="admin-password-input" type={showAdminPassword ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password Admin" className="w-full p-3 rounded-lg neumorphic-input pr-12" />
              <button type="button" aria-label={showAdminPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
            <div className="space-y-4">
              <NeumorphicButton onClick={handleAdminReset} className="font-bold w-full"><RefreshCw size={16} /> Reset Koin</NeumorphicButton>
            </div>
          </div>
        </div>
      )}

      {isClearHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
            <h2 className="text-xl font-bold mb-4">Konfirmasi</h2>
            <p className="mb-6">Yakin ingin menghapus semua riwayat & favorit?</p>
            <div className="flex justify-end gap-4">
              <NeumorphicButton onClick={() => setIsClearHistoryModalOpen(false)}>Batal</NeumorphicButton>
              <NeumorphicButton onClick={handleClearHistory} className="font-bold bg-red-500 text-white">Hapus</NeumorphicButton>
            </div>
          </div>
        </div>
      )}

      {isApiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">API Key untuk {modelRequiringKey?.toUpperCase()}</h2>
              <NeumorphicButton onClick={() => setIsApiModalOpen(false)} className="!p-2"><X size={20} /></NeumorphicButton>
            </div>
            <p className="mb-4 text-sm">Model ini memerlukan API key yang valid.</p>
            <div className="relative w-full mb-4">
              <label htmlFor="api-key-input" className="sr-only">API Key</label>
              <input id="api-key-input" type={showApiKey ? "text" : "password"} value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} placeholder="Masukkan API Key Anda" className="w-full p-3 rounded-lg neumorphic-input pr-12" />
              <button type="button" aria-label={showApiKey ? "Sembunyikan API Key" : "Tampilkan API Key"} onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
            <div className="flex justify-end gap-4">
              <NeumorphicButton onClick={() => setIsApiModalOpen(false)}>Batal</NeumorphicButton>
              <NeumorphicButton onClick={handleApiKeySubmit} className="font-bold">Simpan</NeumorphicButton>
            </div>
          </div>
        </div>
      )}

      {isTurboAuthModalOpen && (
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
      )}

      {isMasterResetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="p-8 rounded-2xl w-full max-w-md" style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-outset)' }}>
                <h2 className="text-xl font-bold mb-4">Konfirmasi Reset Data</h2>
                <p className="mb-2 text-sm">Anda yakin ingin menghapus semua data aplikasi dari browser ini? Tindakan ini tidak dapat diurungkan.</p>
                <div className="text-sm p-3 my-4 rounded-lg" style={{ boxShadow: 'var(--shadow-inset)' }}>
                    Data yang akan dihapus:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Riwayat Generasi Gambar</li>
                        <li>Prompt Favorit</li>
                        <li>Kunci API yang Tersimpan</li>
                        <li>Password Turbo yang Tersimpan</li>
                        <li>Semua Pengaturan Pengguna</li>
                    </ul>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <NeumorphicButton onClick={() => setIsMasterResetModalOpen(false)}>Batal</NeumorphicButton>
                    <NeumorphicButton onClick={handleMasterReset} className="font-bold bg-red-500 text-white">Ya, Hapus Semua</NeumorphicButton>
                </div>
            </div>
        </div>
      )}
    </>
  );
}