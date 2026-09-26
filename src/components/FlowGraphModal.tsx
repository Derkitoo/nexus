'use client';

import React, { useState } from 'react';
import { X, GitCommit, ArrowRight, Sparkles, Layers, List, Shield, Zap } from 'lucide-react';
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
    const c = (tech.category_id || tech.category).toLowerCase();
    if (c.includes('sub') || c.includes('soum') || c.includes('att')) return 'border-red-500 bg-red-950/80 text-red-200';
    if (c.includes('sweep') || c.includes('renv') || c.includes('bal')) return 'border-emerald-500 bg-emerald-950/80 text-emerald-200';
    return 'border-blue-500 bg-blue-950/80 text-blue-200';
  };

  const getDotColor = (tech: Technique) => {
    const c = (tech.category_id || tech.category).toLowerCase();
    if (c.includes('sub') || c.includes('soum') || c.includes('att')) return 'bg-red-500';
    if (c.includes('sweep') || c.includes('renv') || c.includes('bal')) return 'bg-emerald-500';
    return 'bg-blue-500';
  };

  // Node coordinates for visual flowchart representation
  const techList = Object.values(techniques);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Cartographie Tactique</h3>
              <p className="text-[11px] text-slate-400">{systemName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'visual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Graphe</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                  viewMode === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
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
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-3 space-y-3 flex-1 pr-1">
          <div className="text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sélectionnez n&apos;importe quel nœud pour recalibrer le GPS instantanément sur cette position.</span>
          </div>

          {viewMode === 'visual' ? (
            /* Visual Flowchart Nodes Network */
            <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>RÉSEAU D&apos;EMBRANCHEMENTS DYNAMIQUES</span>
                <span className="text-blue-400">Position actuelle clignotante</span>
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
                          ? 'border-blue-500 bg-slate-850 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10'
                          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      {/* Active beacon indicator */}
                      {isCurrent && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                      )}

                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                          {tech.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {tech.reactions.length} branches
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-blue-300' : 'text-white'}`}>
                        {tech.name}
                      </h4>

                      {/* Micro reaction badges */}
                      <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                        {tech.reactions.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                            <span className="text-slate-600">↳</span>
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
                        ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/40'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                        <span className={`text-xs font-bold ${isCurrent ? 'text-blue-300' : 'text-white'}`}>
                          {tech.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {tech.category}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 pl-4 border-l border-slate-700/60">
                      {tech.reactions.map((react, i) => (
                        <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{react.condition}</span>
                          <span className="text-slate-500 text-[10px]">→</span>
                          <span className="text-slate-300 font-medium truncate">
                            {techniques[react.nextId]?.name || react.nextId}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          Fermer la cartographie
        </button>
      </div>
    </div>
  );
};
