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
    if (cat.includes('submission') || cat.includes('soumission')) return 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/30';
    if (cat.includes('sweep') || cat.includes('renversement')) return 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30';
    if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) return 'bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/30';
    return 'bg-[#0a84ff]/15 text-[#0a84ff] border-[#0a84ff]/30';
  };

  const getDotColor = (tech: Technique) => {
    const cat = (tech.category_id || tech.category).toLowerCase();
    if (cat.includes('submission') || cat.includes('soumission')) return 'bg-[#ff453a]';
    if (cat.includes('sweep') || cat.includes('renversement')) return 'bg-[#30d158]';
    if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) return 'bg-[#ffd60a]';
    return 'bg-[#0a84ff]';
  };

  const techList = Object.values(techniques);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#161618] border border-white/12 rounded-[32px] p-4 sm:p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0a84ff]/15 border border-[#0a84ff]/30 flex items-center justify-center text-[#0a84ff]">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">Cartographie Tactique</h3>
              <p className="text-[11px] text-white/50">{systemName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-white/10 rounded-xl p-0.5 border border-white/10">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'visual' ? 'bg-[#0a84ff] text-white shadow-xs' : 'text-white/60 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Graphe</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'list' ? 'bg-[#0a84ff] text-white shadow-xs' : 'text-white/60 hover:text-white'
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
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/60 hover:text-white transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-3 space-y-3 flex-1 pr-1 no-scrollbar">
          <div className="text-[11px] text-white/70 bg-white/5 p-2.5 rounded-2xl border border-white/10 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#30d158] shrink-0" />
            <span>Sélectionnez n&apos;importe quel nœud pour recalibrer le GPS instantanément sur cette position.</span>
          </div>

          {viewMode === 'visual' ? (
            /* Visual Flowchart Nodes Network */
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>RÉSEAU D&apos;EMBRANCHEMENTS DYNAMIQUES</span>
                <span className="text-[#0a84ff] font-bold">Position actuelle clignotante</span>
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
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#0a84ff] bg-[#0a84ff]/15 ring-2 ring-[#0a84ff]/40 shadow-lg'
                          : 'border-white/10 bg-[#1c1c1e] hover:border-white/20'
                      }`}
                    >
                      {/* Active beacon indicator */}
                      {isCurrent && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a84ff] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0a84ff]"></span>
                        </span>
                      )}

                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          {tech.category}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {tech.reactions.length} branches
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#0a84ff]' : 'text-white'}`}>
                        {tech.name}
                      </h4>

                      {/* Micro reaction badges */}
                      <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                        {tech.reactions.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[10px] text-white/50 truncate">
                            <span className="text-white/30">↳</span>
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
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0a84ff]/15 border-[#0a84ff] ring-2 ring-[#0a84ff]/30'
                        : 'bg-[#1c1c1e] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                        <div>
                          <h4 className="text-xs font-bold text-white">{tech.name}</h4>
                          <span className="text-[10px] text-white/50">{tech.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/40">
                          {tech.reactions.length} suites
                        </span>
                        <ChevronRight className="w-4 h-4 text-white/30" />
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
