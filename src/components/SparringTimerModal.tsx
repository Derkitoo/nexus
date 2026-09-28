'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Flame, 
  Settings2,
  Clock,
  Shield,
  Zap,
  Target,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Check,
  ChevronRight
} from 'lucide-react';
import { soundFX } from '@/utils/audioFeedback';
import { UserProfile } from '@/types/bjj';

interface SparringTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBelt: UserProfile['belt'];
}

export type SparringMode = 'ibjjf' | 'shark_tank' | 'thematic' | 'drill';

const BELT_ROUND_TIMES: Record<UserProfile['belt'], number> = {
  White: 300,  // 5 min
  Blue: 360,   // 6 min
  Purple: 420, // 7 min
  Brown: 480,  // 8 min
  Black: 600,  // 10 min
};

const THEMATIC_POSITIONS = [
  '🥋 Garde Fermée (Dessous)',
  '⚡ Passage de Garde (Dessus)',
  '🛡️ Demi-Garde Underhook',
  '🏔️ Position Montée',
  '🎒 Prise de Dos & RNC',
  '💥 100 Kilos / Contrôle Latéral',
  '🤼 Debout / Combat de Takedown',
  '🦵 Ashi Garami / Leg Locks'
];

export const SparringTimerModal: React.FC<SparringTimerModalProps> = ({
  isOpen,
  onClose,
  userBelt,
}) => {
  // Timer settings
  const [sparringMode, setSparringMode] = useState<SparringMode>('ibjjf');
  const [totalRounds, setTotalRounds] = useState(5);
  const [isUnlimitedRounds, setIsUnlimitedRounds] = useState(false);
  const [roundDuration, setRoundDuration] = useState(BELT_ROUND_TIMES[userBelt] || 360);
  const [restDuration, setRestDuration] = useState(60);
  const [enableWarning30s, setEnableWarning30s] = useState(true);
  const [enableWarning10s, setEnableWarning10s] = useState(true);

  // Runtime state
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<'fight' | 'rest'>('fight');
  const [timeLeft, setTimeLeft] = useState(BELT_ROUND_TIMES[userBelt] || 360);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [thematicIndex, setThematicIndex] = useState(0);

  // UI state
  const [activeTab, setActiveTab] = useState<'timer' | 'settings'>('timer');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visualFlash, setVisualFlash] = useState<'round_change' | 'warning_30' | 'warning_10' | null>(null);

  // Sync default time if belt changes and timer hasn't started
  useEffect(() => {
    if (!isRunning && currentRound === 1 && phase === 'fight' && sparringMode === 'ibjjf') {
      const d = BELT_ROUND_TIMES[userBelt] || 360;
      setRoundDuration(d);
      setTimeLeft(d);
    }
  }, [userBelt, isRunning, currentRound, phase, sparringMode]);

  // Main Timer Tick
  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // Visual warning triggers (silent visual pulses)
        if (phase === 'fight') {
          if (prev === 31 && enableWarning30s) {
            triggerFlash('warning_30');
          } else if (prev === 11 && enableWarning10s) {
            triggerFlash('warning_10');
          }
        }

        if (prev <= 1) {
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentRound, totalRounds, isUnlimitedRounds, isOpen, enableWarning30s, enableWarning10s]);

  const triggerFlash = (type: 'round_change' | 'warning_30' | 'warning_10') => {
    setVisualFlash(type);
    setTimeout(() => setVisualFlash(null), 1200);
  };

  const handlePhaseComplete = () => {
    triggerFlash('round_change');

    if (phase === 'fight') {
      // Fight ended -> Go to rest or end
      if (!isUnlimitedRounds && currentRound >= totalRounds) {
        setIsRunning(false);
        setIsFinished(true);
      } else {
        if (restDuration > 0) {
          setPhase('rest');
          setTimeLeft(restDuration);
        } else {
          // Instant next round if rest is 0
          nextRound();
        }
      }
    } else {
      // Rest ended -> Next round
      nextRound();
    }
  };

  const nextRound = () => {
    setPhase('fight');
    setCurrentRound((r) => r + 1);
    setTimeLeft(roundDuration);
    setThematicIndex((prev) => (prev + 1) % THEMATIC_POSITIONS.length);
  };

  const handleTogglePlay = () => {
    soundFX.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundFX.playClick();
    setIsRunning(false);
    setPhase('fight');
    setCurrentRound(1);
    setTimeLeft(roundDuration);
    setIsFinished(false);
  };

  const handleSkip = () => {
    soundFX.playClick();
    handlePhaseComplete();
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    soundFX.playClick();
    setTimeLeft((prev) => Math.max(5, prev + deltaSeconds));
  };

  if (!isOpen) return null;

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage for SVG ring
  const currentTotal = phase === 'fight' ? roundDuration : (restDuration || 1);
  const progress = Math.min(1, Math.max(0, timeLeft / currentTotal));
  const strokeDashoffset = 283 * (1 - progress);

  // Dynamic visual styling based on warnings
  const getRingColor = () => {
    if (phase === 'rest') return '#ffd60a'; // Amber for Rest
    if (timeLeft <= 10 && enableWarning10s) return '#ff453a'; // Red for final 10s
    if (timeLeft <= 30 && enableWarning30s) return '#ff9f0a'; // Orange for final 30s
    return '#30d158'; // Emerald for Fight
  };

  const getModeDetails = () => {
    switch (sparringMode) {
      case 'shark_tank':
        return { label: 'Shark Tank 🦈', desc: '1 Défenseur au centre, partenaires tournants' };
      case 'thematic':
        return { label: 'Thématique 🎯', desc: THEMATIC_POSITIONS[thematicIndex] };
      case 'drill':
        return { label: 'Drill Explosif ⚡', desc: 'Rounds courts de haute intensité' };
      default:
        return { label: `IBJJF ${userBelt}`, desc: `Rounds officiels de ${Math.round(roundDuration / 60)} minutes` };
    }
  };

  const modeInfo = getModeDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-spring-in select-none">
      {/* Outer Card with Light/Dark adaptiveness */}
      <div className={`relative w-full ${isFullscreen ? 'max-w-xl h-[94vh]' : 'max-w-md max-h-[92vh]'} bg-[#161618] border border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300`}>
        
        {/* Flash Screen Warning Rim */}
        {visualFlash === 'round_change' && (
          <div className="absolute inset-0 border-4 border-white/80 animate-pulse pointer-events-none rounded-[32px] z-30" />
        )}
        {visualFlash === 'warning_10' && (
          <div className="absolute inset-0 border-4 border-[#ff453a] animate-pulse pointer-events-none rounded-[32px] z-30" />
        )}
        {visualFlash === 'warning_30' && (
          <div className="absolute inset-0 border-4 border-[#ffd60a] animate-pulse pointer-events-none rounded-[32px] z-30" />
        )}

        {/* 1. Top Header Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0a84ff]/15 border border-[#0a84ff]/30 flex items-center justify-center text-[#0a84ff]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight flex items-center gap-1.5">
                Chrono Sparring Pro
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#0a84ff]/20 text-[#0a84ff]">
                  v2.0
                </span>
              </h3>
              <p className="text-[10px] text-white/50">{modeInfo.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Fullscreen / Tatami expand button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all active:scale-90"
              title={isFullscreen ? 'Réduire' : 'Mode Plein Écran Tatami'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Toggle Settings Panel button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab(activeTab === 'timer' ? 'settings' : 'timer');
              }}
              className={`p-1.5 rounded-full transition-all active:scale-90 ${
                activeTab === 'settings' 
                  ? 'bg-[#0a84ff] text-white' 
                  : 'bg-white/10 hover:bg-white/15 text-white/70 hover:text-white'
              }`}
              title="Personnaliser les rounds et options"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Close button */}
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

        {/* 2. TAB 1: Live Interactive Timer View */}
        {activeTab === 'timer' ? (
          <div className="flex-1 flex flex-col items-center justify-between py-2 space-y-3">
            
            {/* Phase & Round Status Pills */}
            <div className="w-full flex items-center justify-between px-1">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                phase === 'fight' 
                  ? 'bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/40 shadow-sm shadow-[#30d158]/20 animate-pulse' 
                  : 'bg-[#ffd60a]/20 text-[#ffd60a] border border-[#ffd60a]/40 shadow-sm shadow-[#ffd60a]/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${phase === 'fight' ? 'bg-[#30d158]' : 'bg-[#ffd60a]'}`} />
                {phase === 'fight' ? 'COMBAT (SPARRING)' : 'REPOS (REST)'}
              </span>

              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-bold text-white/70">
                  Round {currentRound} {isUnlimitedRounds ? '(Illimité)' : `/ ${totalRounds}`}
                </span>
              </div>
            </div>

            {/* Sub-Banner for Thematic / Shark Tank Modes */}
            {sparringMode === 'thematic' && (
              <div className="w-full py-1.5 px-3 rounded-xl bg-[#0a84ff]/10 border border-[#0a84ff]/25 text-center">
                <span className="text-[11px] font-bold text-[#0a84ff]">
                  {modeInfo.desc}
                </span>
              </div>
            )}

            {/* Round Tracker Dots */}
            {!isUnlimitedRounds && totalRounds <= 12 && (
              <div className="flex items-center gap-1.5 py-0.5">
                {[...Array(totalRounds)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i + 1 < currentRound
                        ? 'w-4 bg-[#30d158]'
                        : i + 1 === currentRound
                        ? 'w-6 bg-[#0a84ff]'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Giant Circular Apple Ring Display */}
            <div className={`relative ${isFullscreen ? 'w-72 h-72' : 'w-56 h-56'} flex items-center justify-center my-auto transition-all`}>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  strokeWidth="5.5"
                  className="timer-bg-ring stroke-white/10"
                />
                {/* Active Dynamic Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke={getRingColor()}
                  strokeWidth="5.5"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-linear"
                />
              </svg>

              {/* Digital Time Centerpiece */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`${isFullscreen ? 'text-6xl' : 'text-5xl'} font-black text-white font-mono tracking-tight drop-shadow-md`}>
                  {timeFormatted}
                </span>

                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 mt-1">
                  {phase === 'fight' ? `${Math.round(roundDuration / 60)} min Sparring` : `${restDuration}s Récupération`}
                </span>

                {/* Quick In-Round Adjustments (+30s / -30s) */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleAdjustTime(-30)}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/15 text-[10px] font-bold text-white/60 active:scale-95 transition-all"
                    title="-30 secondes"
                  >
                    -30s
                  </button>
                  <button
                    onClick={() => handleAdjustTime(30)}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/15 text-[10px] font-bold text-white/60 active:scale-95 transition-all"
                    title="+30 secondes"
                  >
                    +30s
                  </button>
                </div>
              </div>
            </div>

            {/* Finished Alert */}
            {isFinished && (
              <div className="w-full py-2 px-3 rounded-2xl bg-[#30d158]/20 border border-[#30d158]/40 text-center animate-spring-in">
                <span className="text-xs font-black text-[#30d158] block">
                  🎉 Session Terminée avec Succès !
                </span>
                <span className="text-[10px] text-white/70">
                  {totalRounds} rounds complétés au total.
                </span>
              </div>
            )}

            {/* Giant Apple iOS Touch Controls */}
            <div className="flex items-center justify-center gap-5 pt-1 w-full">
              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-white/10"
                title="Remise à zéro"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Main Play / Pause Circle */}
              <button
                onClick={handleTogglePlay}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white active:scale-95 transition-all shadow-xl ${
                  isRunning 
                    ? 'bg-[#ff453a] shadow-[#ff453a]/30 hover:bg-[#ff453a]/90' 
                    : 'bg-[#30d158] shadow-[#30d158]/30 hover:bg-[#30d158]/90'
                }`}
                title={isRunning ? 'Mettre en pause' : 'Démarrer le chrono'}
              >
                {isRunning ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white ml-1" />
                )}
              </button>

              {/* Skip to Next Phase */}
              <button
                onClick={handleSkip}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-white/10"
                title="Passer au round ou repos suivant"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* 3. TAB 2: Full Pro Customization Settings Panel */
          <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 no-scrollbar animate-spring-in">
            
            {/* Mode Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                Type de Sparring :
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'ibjjf', label: 'IBJJF Officiel', desc: 'Durée selon la ceinture' },
                  { id: 'shark_tank', label: 'Shark Tank 🦈', desc: 'Rotation de partenaires' },
                  { id: 'thematic', label: 'Thématique 🎯', desc: 'Positions de départ imposées' },
                  { id: 'drill', label: 'Drills ⚡', desc: 'Intervalles haute intensité' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      soundFX.playClick();
                      setSparringMode(m.id as SparringMode);
                      if (m.id === 'drill') {
                        setRoundDuration(120);
                        setRestDuration(30);
                        setTimeLeft(120);
                      } else if (m.id === 'ibjjf') {
                        const d = BELT_ROUND_TIMES[userBelt] || 360;
                        setRoundDuration(d);
                        setTimeLeft(d);
                      }
                    }}
                    className={`p-2.5 rounded-2xl text-left border transition-all ${
                      sparringMode === m.id
                        ? 'bg-[#0a84ff]/20 border-[#0a84ff] text-white'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70'
                    }`}
                  >
                    <span className="text-xs font-bold block">{m.label}</span>
                    <span className="text-[9px] text-white/40 block mt-0.5 leading-tight">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Round Duration Customizer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Durée du Round</span>
                <span className="text-sm font-black font-mono text-[#0a84ff]">
                  {Math.floor(roundDuration / 60)} min {roundDuration % 60 > 0 ? `${roundDuration % 60}s` : ''}
                </span>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { sec: 120, label: '2 min' },
                  { sec: 180, label: '3 min' },
                  { sec: 300, label: '5 min' },
                  { sec: 360, label: '6 min' },
                  { sec: 420, label: '7 min' },
                  { sec: 480, label: '8 min' },
                  { sec: 600, label: '10 min' },
                  { sec: 900, label: '15 min' }
                ].map((p) => (
                  <button
                    key={p.sec}
                    onClick={() => {
                      soundFX.playClick();
                      setRoundDuration(p.sec);
                      if (!isRunning && phase === 'fight') setTimeLeft(p.sec);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                      roundDuration === p.sec
                        ? 'bg-[#0a84ff] text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Fine tuning + / - */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-white/40">Ajustement fin :</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      const n = Math.max(30, roundDuration - 30);
                      setRoundDuration(n);
                      if (!isRunning && phase === 'fight') setTimeLeft(n);
                    }}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-white px-2">30s</span>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      const n = roundDuration + 30;
                      setRoundDuration(n);
                      if (!isRunning && phase === 'fight') setTimeLeft(n);
                    }}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rest Duration Customizer */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Temps de Repos</span>
                <span className="text-sm font-black font-mono text-[#ffd60a]">
                  {restDuration === 0 ? 'Sans repos' : `${restDuration} sec`}
                </span>
              </div>

              {/* Quick Rest Pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { sec: 0, label: '0s' },
                  { sec: 15, label: '15s' },
                  { sec: 30, label: '30s' },
                  { sec: 45, label: '45s' },
                  { sec: 60, label: '60s' },
                  { sec: 90, label: '90s' },
                  { sec: 120, label: '2 min' }
                ].map((p) => (
                  <button
                    key={p.sec}
                    onClick={() => {
                      soundFX.playClick();
                      setRestDuration(p.sec);
                      if (!isRunning && phase === 'rest') setTimeLeft(p.sec);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                      restDuration === p.sec
                        ? 'bg-[#ffd60a] text-black font-extrabold'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds Count */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Nombre de Rounds</span>
                <span className="text-sm font-black font-mono text-white">
                  {isUnlimitedRounds ? 'Illimité ♾️' : `${totalRounds} Rounds`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[3, 5, 8, 10, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      soundFX.playClick();
                      setTotalRounds(num);
                      setIsUnlimitedRounds(false);
                    }}
                    className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all ${
                      !isUnlimitedRounds && totalRounds === num
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setIsUnlimitedRounds(!isUnlimitedRounds);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    isUnlimitedRounds
                      ? 'bg-[#30d158] text-black'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  ♾️
                </button>
              </div>
            </div>

            {/* Visual Warnings Toggles */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">Signaux Visuels Silencieux</span>
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Alerte Orange à 30s</span>
                <button
                  onClick={() => setEnableWarning30s(!enableWarning30s)}
                  className={`w-9 h-5 rounded-full transition-all relative ${
                    enableWarning30s ? 'bg-[#30d158]' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    enableWarning30s ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Flash d&apos;urgence à 10s</span>
                <button
                  onClick={() => setEnableWarning10s(!enableWarning10s)}
                  className={`w-9 h-5 rounded-full transition-all relative ${
                    enableWarning10s ? 'bg-[#30d158]' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    enableWarning10s ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* Apply & Return to Timer Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('timer');
              }}
              className="w-full py-3 rounded-2xl bg-[#0a84ff] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 shadow-lg shadow-[#0a84ff]/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Valider &amp; Lancer</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
