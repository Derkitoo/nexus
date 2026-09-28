'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Award, 
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { INITIAL_TECHNIQUES } from '@/data/bjjData';
import { soundFX } from '@/utils/audioFeedback';

interface DrillScenario {
  id: string;
  position: string;
  opponentAction: string;
  correctNextId: string;
  explanation: string;
  distractors: string[];
}

const SCENARIOS: DrillScenario[] = [
  {
    id: 's1',
    position: 'Garde Fermée (Dessous)',
    opponentAction: "L'adversaire pose lourdement ses deux mains sur le tapis !",
    correctNextId: 'kimura',
    explanation: "Bras isolé et angle ouvert : l'attaque de Kimura est le réflexe numéro un !",
    distractors: ['half_guard', 'outside_heel_hook', 'straight_ankle_lock']
  },
  {
    id: 's2',
    position: 'Garde Fermée (Dessous)',
    opponentAction: "L'adversaire se redresse vigoureusement le dos droit pour briser la posture !",
    correctNextId: 'hip_bump',
    explanation: "Utilisez son impulsion montante pour vous asseoir et exécuter le Hip Bump Sweep !",
    distractors: ['ashi_garami', 'side_control', 'omoplata']
  },
  {
    id: 's3',
    position: 'Tentative de Kimura',
    opponentAction: "L'adversaire défend en cachant sa main profondément sous sa cuisse !",
    correctNextId: 'hip_bump_from_kimura',
    explanation: "Il n'a plus d'appui au sol de ce côté : basculez immédiatement en Hip Bump Sweep pour monter !",
    distractors: ['straight_ankle_lock', 'side_control', 'dogfight']
  },
  {
    id: 's4',
    position: 'Tentative de Kimura',
    opponentAction: "L'adversaire repousse votre visage avec son bras libre qui traverse l'axe !",
    correctNextId: 'triangle',
    explanation: "Règle absolue : 1 bras dedans, 1 bras dehors. Glissez la jambe par-dessus sa nuque pour le Triangle !",
    distractors: ['hip_bump', 'back_take', 'mount_control']
  },
  {
    id: 's5',
    position: 'Ashi Garami (Contrôle de Jambe)',
    opponentAction: "L'adversaire tourne sa jambe vers l'extérieur pour tenter d'extraire son genou !",
    correctNextId: 'outside_heel_hook',
    explanation: "Sa rotation offre directement le calcanéum (talon) extérieur en coupe : Outside Heel Hook !",
    distractors: ['kimura', 'closed_guard', 'hip_bump']
  }
];

export const ReflexDrillView: React.FC<{ onFinishDrill: (points: number) => void }> = ({ onFinishDrill }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6);
  const [isFinished, setIsFinished] = useState(false);

  const scenario = SCENARIOS[currentIndex];

  const options = React.useMemo(() => {
    if (!scenario) return [];
    const all = [scenario.correctNextId, ...scenario.distractors];
    return all.sort(() => Math.sin(currentIndex * 7) - 0.5);
  }, [currentIndex, scenario]);

  useEffect(() => {
    if (isAnswered || isFinished) return;

    if (timeLeft <= 0) {
      handleSelectOption('TIMEOUT');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished]);

  const handleSelectOption = (techId: string) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(techId);

    const isCorrect = techId === scenario.correctNextId;
    if (isCorrect) {
      soundFX.playSubmissionChime();
      setScore((s) => s + 100 + timeLeft * 10);
      setStreak((st) => st + 1);
    } else {
      soundFX.playClick();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(6);
    } else {
      setIsFinished(true);
      onFinishDrill(score);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(6);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col p-4 pb-12 items-center justify-center text-center space-y-4 animate-spring-in max-w-md mx-auto w-full">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-[#0a84ff]/20 border border-blue-200 dark:border-[#0a84ff]/30 flex items-center justify-center text-[#007aff] dark:text-[#0a84ff] shadow-xs">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Session Terminée</h2>
          <p className="text-xs text-slate-500 dark:text-white/50">Performance de décision sous pression</p>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 w-full space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-white/60 font-medium">Score :</span>
            <span className="font-mono text-emerald-600 dark:text-[#30d158] font-extrabold text-base">{score} PTS</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-white/60 font-medium">Réussite :</span>
            <span className="font-mono text-[#007aff] dark:text-[#0a84ff] font-bold">
              {Math.round((score / (SCENARIOS.length * 150)) * SCENARIOS.length)} / {SCENARIOS.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3.5 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Recommencer l&apos;entraînement</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-3.5 animate-spring-in max-w-md mx-auto w-full">
      {/* HUD Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-white/70">
          <Flame className="w-4 h-4 text-amber-500" />
          <span className="font-bold">Série : {streak}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
            timeLeft <= 2 
              ? 'bg-rose-100 text-rose-700 dark:bg-[#ff453a]/20 dark:text-[#ff453a] animate-pulse' 
              : 'bg-blue-50 text-[#007aff] dark:bg-white/10 dark:text-[#0a84ff]'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#30d158]">
            {score} pts
          </span>
        </div>
      </div>

      {/* Scenario Inset Card */}
      <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/40 font-mono">
          <span>{currentIndex + 1} / {SCENARIOS.length}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80 font-sans font-medium text-[11px]">
            {scenario.position}
          </span>
        </div>

        <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#ffd60a] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Action Adverse :
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
            « {scenario.opponentAction} »
          </p>
        </div>
      </div>

      <div className="text-center pt-1">
        <span className="text-[11px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider">
          Réaction tactique optimale ?
        </span>
      </div>

      {/* Decision Buttons */}
      <div className="space-y-2">
        {options.map((techId) => {
          const tech = INITIAL_TECHNIQUES[techId];
          const isCorrect = techId === scenario.correctNextId;
          const isChosen = selectedAnswer === techId;

          let btnClass = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 dark:bg-[#1c1c1e] dark:border-white/10 dark:text-white dark:hover:bg-white/10 shadow-xs';
          if (isAnswered) {
            if (isCorrect) {
              btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-[#30d158]/20 dark:border-[#30d158] dark:text-[#30d158] font-bold';
            } else if (isChosen && !isCorrect) {
              btnClass = 'bg-rose-50 border-rose-400 text-rose-800 dark:bg-[#ff453a]/20 dark:border-[#ff453a] dark:text-[#ff453a] font-bold';
            } else {
              btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-40 dark:bg-black/30 dark:border-white/5 dark:text-white/30';
            }
          }

          return (
            <button
              key={techId}
              onClick={() => handleSelectOption(techId)}
              disabled={isAnswered}
              className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between active:scale-[0.98] ${btnClass}`}
            >
              <div>
                <span className="text-xs font-bold block">{tech ? tech.name : techId}</span>
                <span className="text-[10px] text-slate-500 dark:text-white/40">{tech ? tech.category : ''}</span>
              </div>

              {isAnswered && (
                <div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#30d158]" />
                  ) : isChosen ? (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-[#ff453a]" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className="bg-blue-50/80 dark:bg-[#1c1c1e] border border-blue-200 dark:border-[#0a84ff]/30 rounded-2xl p-3.5 animate-spring-in space-y-2.5 shadow-xs">
          <p className="text-xs text-slate-800 dark:text-white/80 leading-relaxed">
            <span className="font-bold text-[#007aff] dark:text-[#0a84ff]">Analyse GPS : </span>
            {scenario.explanation}
          </p>
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
          >
            <span>{currentIndex + 1 < SCENARIOS.length ? 'Suivant' : 'Résultats'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
