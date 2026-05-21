// app/modular-test/ModuleCard.tsx
'use client';

import React from 'react';
import { ModuleData } from './modules';

interface ModuleCardProps {
  module: ModuleData;
  onMaximize: (id: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
}

export default function ModuleCard({
  module,
  onMaximize,
  onRemove,
  onDragStart,
  onDragOver,
}: ModuleCardProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(module.id)}
      onDragOver={(e) => onDragOver(e, module.id)}
      className={`group rounded-xl border ${module.color} flex flex-col h-64 bg-slate-900/40 shadow-md backdrop-blur-xs transition duration-200 cursor-grab active:cursor-grabbing hover:shadow-lg`}
    >
      {/* Module Handlebar Header */}
      <div className="p-3.5 bg-slate-950/40 border-b border-slate-800/50 flex justify-between items-center rounded-t-xl">
        <div className="flex items-center gap-2.5">
          {/* Visual drag indicator handle */}
          <div className="grid grid-cols-2 gap-0.5 opacity-30 group-hover:opacity-70 transition">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span className="text-base">{module.icon}</span>
          <h3 className="font-semibold text-sm text-slate-200 tracking-wide">{module.title}</h3>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition">
          <button
            title="Maximize"
            onClick={() => onMaximize(module.id)}
            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs flex items-center justify-center transition border border-slate-700 text-slate-300"
          >
            🗖
          </button>
          <button
            title="Send to Shelf"
            onClick={() => onRemove(module.id)}
            className="w-6 h-6 rounded bg-slate-800 hover:bg-red-950 hover:text-red-400 text-xs flex items-center justify-center transition border border-slate-700 text-slate-400"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Module Body Content */}
      <div className="p-4 flex-1 overflow-y-auto text-sm text-slate-400 font-mono flex flex-col justify-between">
        <div>{module.defaultContent}</div>
        <div className="text-[10px] text-slate-600 uppercase font-sans tracking-wider text-right border-t border-slate-800/30 pt-2 pointer-events-none">
          Drag header block to rearrange
        </div>
      </div>
    </div>
  );
}