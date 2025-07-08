// File: app/contact/layout.js

"use client";

// Layout ini akan memastikan semua style global diterapkan ke halaman kontak
export default function ContactLayout({ children }) {
  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]`}>
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
      `}</style>
      {children}
    </div>
  );
}