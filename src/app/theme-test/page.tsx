"use client";
import React, { useState, useMemo } from 'react';

const THEMES = {
  genshin: {
    name: "Genshin Impact",
    light: {
      background: "#fdfaf3",
      foreground: "#4b443c",
      primary: "#d4ad68",
      secondary: "#5e9296",
      muted: "#f3ede0",
      border: "#e6ddd0",
      card: "#ffffff",
    },
    dark: {
      background: "#1a1814",
      foreground: "#ece5d8",
      primary: "#e6c17a",
      secondary: "#74b5ba",
      muted: "#2d2924",
      border: "#3d372e",
      card: "rgba(255,255,255,0.05)",
    }
  },
  hsr: {
    name: "Honkai: Star Rail",
    light: {
      background: "#f8f7ff",
      foreground: "#3d3a52",
      primary: "#7c5dfa",
      secondary: "#4facfe",
      muted: "#efedff",
      border: "#e0def7",
      card: "#ffffff",
    },
    dark: {
      background: "#0f0e17",
      foreground: "#e0def7",
      primary: "#a389ff",
      secondary: "#00d2ff",
      muted: "#252336",
      border: "#33314a",
      card: "rgba(255,255,255,0.05)",
    }
  },
  zzz: {
    name: "Zenless Zone Zero",
    light: {
      background: "#fefce8",
      foreground: "#18181b",
      primary: "#facc15",
      secondary: "#f43f5e",
      muted: "#fef9c3",
      border: "#e4e4e7",
      card: "#ffffff",
    },
    dark: {
      background: "#09090b",
      foreground: "#facc15", 
      primary: "#fef08a",
      secondary: "#fb7185", 
      muted: "#27272a",
      border: "#3f3f46",
      card: "rgba(255,255,255,0.05)",
    }
  }
};

export default function ThemeTestPage() {
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES>('genshin');
  const [isDark, setIsDark] = useState(false);

  // Memoize the CSS variables to prevent unnecessary re-renders
  const themeVars = useMemo(() => {
    const colors = isDark ? THEMES[activeTheme].dark : THEMES[activeTheme].light;
    return {
      '--background': colors.background,
      '--foreground': colors.foreground,
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--muted': colors.muted,
      '--border': colors.border,
      '--card': colors.card,
    } as React.CSSProperties;
  }, [activeTheme, isDark]);

  return (
    // We apply the variables to this wrapper div. 
    // All Tailwind classes inside will now use these values.
    <div style={themeVars} className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <main className="max-w-5xl mx-auto p-8">
        
        {/* Header & Controls */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-1">Sub-Project Preview</p>
            <h1 className="text-4xl font-black crux-font">{THEMES[activeTheme].name}</h1>
          </div>

          <div className="flex flex-wrap gap-3 p-2 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
            {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTheme(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTheme === t 
                  ? 'bg-[var(--primary)] text-[var(--background)] shadow-lg scale-105' 
                  : 'hover:bg-[var(--background)]/50'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
            <div className="w-[1px] bg-[var(--border)] mx-2" />
            <button
              onClick={() => setIsDark(!isDark)}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 transition-opacity"
            >
              {isDark ? 'LIGHT MODE' : 'DARK MODE'}
            </button>
          </div>
        </header>

        {/* Visual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <section className="md:col-span-2 p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl">
            <h2 className="text-2xl font-bold mb-4 crux-font">Interface Test</h2>
            <p className="mb-6 opacity-80 leading-relaxed">
              Theme switching is now handled via React state and CSS variables on a wrapper. 
              This avoids hydration errors and works perfectly with <span className="text-[var(--primary)] font-bold">Tailwind v4</span>.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[var(--primary)] text-[var(--background)] rounded-full font-bold hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="px-6 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-full font-bold hover:bg-[var(--primary)]/10 transition-colors">
                Outline Button
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="p-6 rounded-3xl bg-[var(--muted)] border border-[var(--border)]">
              <p className="text-xs font-bold opacity-60 uppercase mb-1">Theme Status</p>
              <p className="text-xl font-bold text-[var(--secondary)]">System: {isDark ? 'Dark' : 'Light'}</p>
            </div>
            <div className="p-6 rounded-3xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-pulse" />
              </div>
              <p className="text-sm font-medium">CSS Variables Loaded</p>
            </div>
          </section>

          {/* Color Strip */}
          <section className="md:col-span-3 grid grid-cols-5 gap-2 mt-4">
            <div className="h-12 rounded-lg bg-[var(--primary)] text-[var(--foreground)] text-center" title="Primary">Primary</div>
            <div className="h-12 rounded-lg bg-[var(--secondary)] text-[var(--foreground)] text-center" title="Secondary">Secondary</div>
            <div className="h-12 rounded-lg bg-[var(--muted)] text--[var(--foreground)] text-center" title="Muted">Muted</div>
            <div className="h-12 rounded-lg border border-[var(--border)] text-[var(--foreground)] text-center" title="Border">Border</div>
            <div className="h-12 rounded-lg bg-[var(--foreground)] text-[var(--border)] text-center" title="Foreground">Foreground</div>
          </section>
        </div>
      </main>
    </div>
  );
}