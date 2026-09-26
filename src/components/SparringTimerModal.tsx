'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Flame, 
  Bell, 
  Volume2, 
  Settings2,
  Clock
} from 'lucide-react';
import { soundFX } from '@/utils/audioFeedback';
import { voiceCopilot } from '@/utils/voiceCopilot';
import { UserProfile } from '@/types/bjj';

interface SparringTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBelt: UserProfile['belt'];
}

const BELT_ROUND_TIMES: Record<UserProfile['belt'], number> = {
  White: 300,  // 5 min
  Blue: 360,   // 6 min
  Purple: 420, // 7 min
  Brown: 480,  // 8 min
  Black: 600,  // 10 min
};

export const SparringTimerModal: React.FC<SparringTimerModalProps> = ({
  isOpen,
  onClose,
  userBelt,
}) => {
  const [totalRounds, setTotalRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundDuration, setRoundDuration] = useState(BELT_ROUND_TIMES[userBelt] || 360);
  const [restDuration, setRestDuration] = useState(60); // 60s rest

  const [phase, setPhase] = useState<'fight' | 'rest'>('fight');
  const [timeLeft, setTimeLeft] = useState(BELT_ROUND_TIMES[userBelt] || 360);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Sync default time if belt changes
  useEffect(() => {
    if (!isRunning && currentRound === 1 && phase === 'fight') {
      const d = BELT_ROUND_TIMES[userBelt] || 360;
      setRoundDuration(d);
      setTimeLeft(d);
    }
  }, [userBelt]);

  // Main Timer Interval
  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentRound, totalRounds, isOpen]);

  const handlePhaseComplete = () => {
    if (phase === 'fight') {
      soundFX.playBuzzer();
      if (voiceCopilot.enabled) voiceCopilot.speak('Fin du round. Repos.');

      if (currentRound >= totalRounds) {
        setIsRunning(false);
        setIsFinished(true);
        soundFX.playSubmissionChime();
        if (voiceCopilot.enabled) voiceCopilot.speak('Session de sparring terminée. Bravo !');
      } else {
        setPhase('rest');
        setTimeLeft(restDuration);
      }
    } else {
      // Rest completed -> Next round
      soundFX.playGong();
      if (voiceCopilot.enabled) voiceCopilot.speak(`Round ${currentRound + 1}. Combat !`);
      setPhase('fight');
      setCurrentRound((r) => r + 1);
      setTimeLeft(roundDuration);
    }
  };

  const handleTogglePlay = () => {
    if (!isRunning) {
      if (timeLeft === roundDuration && phase === 'fight') {
        soundFX.playGong();
        if (voiceCopilot.enabled) voiceCopilot.speak(`Round ${currentRound}. Combat !`);
      } else {
        soundFX.playClick();
      }
      setIsRunning(true);
    } else {
      soundFX.playClick();
      setIsRunning(false);
    }
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

  if (!isOpen) return null;

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage for SVG ring
  const currentTotal = phase === 'fight' ? roundDuration : restDuration;
  const progress = (timeLeft / currentTotal);
  const strokeDashoffset = 283 * (1 - progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-spring-in select-none">
      <div className="relative w-full max-w-sm bg-[#161618] border border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col items-center text-center space-y-4">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0a84ff]/20 border border-[#0a84ff]/30 flex items-center justify-center text-[#0a84ff]">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-white leading-tight">Chronomètre Sparring</h3>
              <p className="text-[10px] text-white/50">Norme IBJJF · Ceinture {userBelt}</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Phase Pill */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
            phase === 'fight' 
              ? 'bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/40 shadow-sm shadow-[#30d158]/20 animate-pulse' 
              : 'bg-[#ffd60a]/20 text-[#ffd60a] border border-[#ffd60a]/40 shadow-sm shadow-[#ffd60a]/20'
          }`}>
            {phase === 'fight' ? '⚡ COMBAT (FIGHT)' : '💤 REPOS (REST)'}
          </span>
          <span className="text-xs font-mono font-bold text-white/60">
            Round {currentRound} / {totalRounds}
          </span>
        </div>

        {/* Big Apple Fitness Circular Timer Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="6"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={phase === 'fight' ? '#30d158' : '#ffd60a'}
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md">
              {timeFormatted}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">
              {phase === 'fight' ? `${Math.round(roundDuration / 60)} min Sparring` : 'Récupération'}
            </span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-center gap-4 pt-1 w-full">
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-white/10"
            title="Réinitialiser"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white active:scale-95 transition-all shadow-xl ${
              isRunning 
                ? 'bg-[#ff453a] shadow-[#ff453a]/30' 
                : 'bg-[#30d158] shadow-[#30d158]/30'
            }`}
          >
            {isRunning ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-1" />
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-white/10"
            title="Passer au suivant"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        {!isRunning && (
          <div className="w-full pt-2 border-t border-white/10 space-y-1.5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block text-left">
              Durée du Round :
            </span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { label: '3 min', sec: 180 },
                { label: '5 min (Blanche)', sec: 300 },
                { label: '6 min (Bleue)', sec: 360 },
                { label: '7 min (Violette)', sec: 420 },
                { label: '10 min (Noire)', sec: 600 }
              ].map((p) => (
                <button
                  key={p.sec}
                  onClick={() => {
                    soundFX.playClick();
                    setRoundDuration(p.sec);
                    setTimeLeft(p.sec);
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
          </div>
        )}
      </div>
    </div>
  );
};
