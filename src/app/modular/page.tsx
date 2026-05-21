// app/modular-test/page.tsx
'use client';

import React, { useState } from 'react';
import { ALL_MODULES } from './modules';
import ModuleCard from './ModuleCard'; // Relative same-folder import

export default function ModularDashboard() {
  const ROOM_CODE = "CRITICAL-ROLL-77A";

  const [activeModules, setActiveModules] = useState<string[]>(['char', 'dice', 'tarot']);
  const [maximizedId, setMaximizedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const dockedModules = ALL_MODULES.filter(m => !activeModules.includes(m.id));

  const removeToDock = (id: string) => {
    if (maximizedId === id) setMaximizedId(null);
    setActiveModules(prev => prev.filter(mId => mId !== id));
  };

  const addFromDock = (id: string) => {
    setActiveModules(prev => [...prev, id]);
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const currentOrder = [...activeModules];
    const draggedIdx = currentOrder.indexOf(draggedId);
    const targetIdx = currentOrder.indexOf(targetId);

    if (draggedIdx !== -1 && targetIdx !== -1) {
      currentOrder.splice(draggedIdx, 1);
      currentOrder.splice(targetIdx, 0, draggedId);
      setActiveModules(currentOrder);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* HEADER NAVBAR */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-wider text-purple-400 flex items-center gap-2">
            <span>🛡️</span> MODULAR-RPG
          </h1>
          <div className="bg-slate-950 px-3 py-1 rounded border border-slate-700 text-xs font-mono tracking-widest text-slate-400">
            ROOM: <span className="text-emerald-400 font-bold">{ROOM_CODE}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/60 py-1.5 px-3 rounded-full border border-slate-700 hover:bg-slate-800 cursor-pointer transition">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">DM</div>
          <span className="text-sm font-medium hidden sm:inline text-slate-300">Player Profile</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 flex flex-col gap-6 relative overflow-hidden">
        
        {/* MODULE SHELF / DOCK */}
        <section className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 shadow-inner backdrop-blur-sm">
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-3">
            📥 Tool Shelf / Module Dock <span className="text-[10px] lowercase text-slate-600 font-normal">(Click to cast into layout)</span>
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {dockedModules.length === 0 ? (
              <p className="text-xs text-slate-600 italic py-1">All systems deployed into active layout.</p>
            ) : (
              dockedModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => addFromDock(module.id)}
                  className="bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 text-sm font-medium px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{module.icon}</span>
                  <span>{module.title}</span>
                  <span className="text-emerald-500 text-xs font-bold font-mono">+</span>
                </button>
              ))
            )}
          </div>
        </section>

        {/* MAXIMUM ZOOM VIEW OVERLAY */}
        {maximizedId && (
          (() => {
            const currentMod = ALL_MODULES.find(m => m.id === maximizedId);
            if (!currentMod) return null;
            return (
              <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 md:p-10 backdrop-blur-md">
                <div className={`w-full max-w-4xl h-[80vh] flex flex-col rounded-2xl border ${currentMod.color} bg-slate-900 shadow-2xl overflow-hidden`}>
                  <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentMod.icon}</span>
                      <h3 className="text-lg font-bold text-white">{currentMod.title}</h3>
                    </div>
                    <button 
                      onClick={() => setMaximizedId(null)}
                      className="bg-slate-800 hover:bg-red-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center transition"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 p-8 overflow-y-auto font-mono text-slate-300 whitespace-pre-line text-lg">
                    {currentMod.defaultContent}
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* REARRANGEABLE GRID SATELLITES */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-start">
          {activeModules.map((id) => {
            const module = ALL_MODULES.find(m => m.id === id);
            if (!module) return null;

            return (
              <ModuleCard
                key={module.id}
                module={module}
                onMaximize={setMaximizedId}
                onRemove={removeToDock}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
              />
            );
          })}
        </section>
      </main>
    </div>
  );
}