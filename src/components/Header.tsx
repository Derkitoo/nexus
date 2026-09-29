'use client';

import React from 'react';
import { Compass, ChevronDown, Clock, Sun, Moon } from 'lucide-react';
import { UserProfile } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  userProfile: UserProfile;
  onUpdateBelt: (belt: UserProfile['belt']) => void;
  onOpenPassport?: () => void;
  onOpenTimer?: () => void;
}

const BELT_CONFIGS: Record<UserProfile['belt'], { label: string; color: string; bg: string }> = {
  White: { label: 'Ceinture Blanche', color: 'text-slate-100', bg: 'bg-white' },
  Blue: { label: 'Ceinture Bleue', color: 'text-blue-400', bg: 'bg-[#0a84ff]' },
  Purple: { label: 'Ceinture Violette', color: 'text-purple-400', bg: 'bg-[#bf5af2]' },
  Brown: { label: 'Ceinture Marron', color: 'text-amber-500', bg: 'bg-[#a2845e]' },
  Black: { label: 'Ceinture Noire', color: 'text-red-500', bg: 'bg-[#18181b] border border-red-500/80' }
};

export const Header: React.FC<HeaderProps> = ({ 
  userProfile, 
  onUpdateBelt, 
  onOpenPassport,
  onOpenTimer,
}) => {
  const currentBelt = BELT_CONFIGS[userProfile.belt];
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#161618]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 pt-3 pb-2.5 transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand with Apple Maps / OpenRoute Vibe */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#007aff] dark:bg-[#0a84ff] flex items-center justify-center shadow-md shadow-[#007aff]/20 text-white shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[15px] tracking-tight text-slate-900 dark:text-white">
                BJJ Nexus
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff] border border-blue-200/80 dark:border-[#0a84ff]/30 uppercase tracking-wide">
                GPS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-white/50 tracking-tight mt-0.5">
              Tactical Navigation
            </p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle, Sparring Timer & Belt Passport */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 transition-all border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 shadow-xs"
            title={theme === 'light' ? 'Activer le mode Sombre' : 'Activer le mode Clair'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#007aff]" />
            ) : (
              <Sun className="w-4 h-4 text-[#ffd60a]" />
            )}
          </button>

          {onOpenTimer && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenTimer();
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 transition-all border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-amber-600 dark:text-[#ffd60a] shadow-xs"
              title="Chronomètre de Sparring IBJJF"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}

          {/* Apple Style Belt Selector Pill - Opens BJJ Passport Modal */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenPassport?.();
            }}
            className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 transition-all border border-slate-200/80 dark:border-white/10 shadow-xs"
            title="Ouvrir le Passeport & Progression"
          >
            <div className={`w-4 h-3 rounded-xs ${currentBelt.bg} flex items-center justify-end overflow-hidden shadow-xs`}>
              <div className="w-1.5 h-full bg-black flex items-center justify-center gap-[1px]">
                {[...Array(userProfile.stripes)].map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-white" />
                ))}
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-white/90">{userProfile.belt}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-white/40" />
          </button>
        </div>
      </div>
    </header>
  );
};
