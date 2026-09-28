'use client';

import React, { useState } from 'react';
import { X, GitCommit, Compass, ChevronRight, Layers, Sparkles, List } from 'lucide-react';
import { Technique } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface FlowGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  techniques: Record<string, Technique>;
  currentTechniqueId: string;
  onSelectTechnique: (id: string) => void;
  systemName: string;
}

export const FlowGraphModal: React.FC<FlowGraphModalProps> = ({
  isOpen,
  onClose,
  techniques,
  currentTechniqueId,
  onSelectTechnique,
  systemName,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');

  if (!isOpen) return null;

  const getBadgeColor = (tech: Technique) => {
    const cat = (tech.category_id || tech.category).toLowerCase();
    if (cat.includes('submission') || cat.includes('soumission')) return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#ff453a]/15 dark:text-[#ff453a] dark:border-[#ff453a]/30';
    if (cat.includes('sweep') || cat.includes('renversement')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#30d158]/15 dark:text-[#30d158] dark:border-[#30d158]/30';
    if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#ffd60a]/15 dark:text-[#ffd60a] dark:border-[#ffd60a]/30';
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-[#0a84ff]/15 dark:text-[#0a84ff] dark:border-[#0a84ff]/30';
  };

  const getDotColor = (tech: Technique) => {
    const cat = (tech.category_id || tech.category).toLowerCase();
    if (cat.includes('submission') || cat.includes('soumission')) return 'bg-rose-500 dark:bg-[#ff453a]';
    if (cat.includes('sweep') || cat.includes('renversement')) return 'bg-emerald-500 dark:bg-[#30d158]';
    if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) return 'bg-amber-500 dark:bg-[#ffd60a]';
    return 'bg-[#007aff] dark:bg-[#0a84ff]';
  };

  const techList = Object.values(techniques);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/12 rounded-[32px] p-4 sm:p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#0a84ff]/15 border border-blue-200 dark:border-[#0a84ff]/30 flex items-center justify-center text-[#007aff] dark:text-[#0a84ff]">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Cartographie Tactique</h3>
              <p className="text-[11px] text-slate-500 dark:text-white/50">{systemName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-100 dark:bg-white/10 rounded-xl p-0.5 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'visual' ? 'bg-[#007aff] text-white shadow-xs' : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Graphe</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'list' ? 'bg-[#007aff] text-white shadow-xs' : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Liste</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-3 space-y-3 flex-1 pr-1 no-scrollbar">
          <div className="text-[11px] text-slate-700 dark:text-white/70 bg-slate-50 dark:bg-white/5 p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#30d158] shrink-0" />
            <span>Sélectionnez n&apos;importe quel nœud pour recalibrer le GPS instantanément sur cette position.</span>
          </div>

          {viewMode === 'visual' ? (
            /* Visual Flowchart Nodes Network */
            <div className="bg-slate-50/70 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-white/50">
                <span>RÉSEAU D&apos;EMBRANCHEMENTS DYNAMIQUES</span>
                <span className="text-[#007aff] dark:text-[#0a84ff] font-bold">Position actuelle active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {techList.map((tech) => {
                  const isCurrent = tech.id === currentTechniqueId;
                  const badgeClass = getBadgeColor(tech);
                  const dotClass = getDotColor(tech);

                  return (
                    <div
                      key={tech.id}
                      onClick={() => {
                        soundFX.playRouteNav();
                        onSelectTechnique(tech.id);
                        onClose();
                      }}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                        isCurrent
                          ? 'border-[#007aff] bg-blue-50 dark:bg-[#0a84ff]/15 ring-2 ring-[#007aff]/30 shadow-md'
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1c1e] hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      {/* Active beacon indicator */}
                      {isCurrent && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007aff] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#007aff]"></span>
                        </span>
                      )}

                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          {tech.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-white/40">
                          {tech.reactions.length} branches
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#007aff] dark:text-[#0a84ff]' : 'text-slate-900 dark:text-white'}`}>
                        {tech.name}
                      </h4>

                      {/* Micro reaction badges */}
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 space-y-1">
                        {tech.reactions.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-white/50 truncate">
                            <span className="text-slate-400 dark:text-white/30">↳</span>
                            <span className="truncate">{r.condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Structured Tree List */
            <div className="space-y-2.5">
              {techList.map((tech) => {
                const isCurrent = tech.id === currentTechniqueId;
                const dotClass = getDotColor(tech);

                return (
                  <div
                    key={tech.id}
                    onClick={() => {
                      soundFX.playRouteNav();
                      onSelectTechnique(tech.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-[#0a84ff]/15 border-[#007aff] ring-2 ring-[#007aff]/30'
                        : 'bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                        <div>
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#007aff] dark:text-[#0a84ff]' : 'text-slate-900 dark:text-white'}`}>{tech.name}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-white/50">{tech.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-white/40">
                          {tech.reactions.length} suites
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
