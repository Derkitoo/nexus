'use client';

import React, { useState } from 'react';
import { Home, Compass, Zap, GitCommit, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '@/utils/audioFeedback';

export type TabType = 'dashboard' | 'gps' | 'drill';

interface BottomNavBarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenFlowModal: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onChangeTab,
  onOpenFlowModal,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => {
          soundFX.playClick();
          onChangeTab('dashboard');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentTab === 'dashboard'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px]">Accueil</span>
      </button>

      <button
        onClick={() => {
          soundFX.playClick();
          onChangeTab('gps');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
          currentTab === 'gps'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Compass className={`w-4 h-4 ${currentTab === 'gps' ? 'animate-spin-slow text-blue-400' : ''}`} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="text-[10px]">GPS Flow</span>
      </button>

      <button
        onClick={() => {
          soundFX.playClick();
          onChangeTab('drill');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          currentTab === 'drill'
            ? 'text-amber-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Zap className="w-4 h-4" />
        <span className="text-[10px]">Drill Réflexe</span>
      </button>

      <button
        onClick={() => {
          soundFX.playClick();
          onOpenFlowModal();
        }}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
        title="Ouvrir la cartographie complète"
      >
        <GitCommit className="w-4 h-4 text-slate-400" />
        <span className="text-[10px]">Carte</span>
      </button>

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-slate-500 hover:text-slate-300 transition-all"
        title={soundEnabled ? 'Désactiver le son tactique' : 'Activer le son tactique'}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-blue-400/80" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-600" />
        )}
        <span className="text-[9px] font-mono">{soundEnabled ? 'ON' : 'OFF'}</span>
      </button>
    </nav>
  );
};
