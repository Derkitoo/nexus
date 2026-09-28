'use client';

import React from 'react';
import { 
  X, 
  Check, 
  AlertTriangle, 
  Play, 
  Navigation, 
  ExternalLink, 
  Shield, 
  RotateCcw, 
  Zap, 
  Compass, 
  CheckCircle2, 
  Circle,
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { Technique, TechniqueProgress, MasteryStatus } from '@/types/bjj';
import { TechniqueVideoPreview } from './TechniqueVideoPreview';
import { soundFX } from '@/utils/audioFeedback';

interface TechniqueDetailModalProps {
  technique: Technique | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchInGPS: (techniqueId: string, systemTag?: string) => void;
  progressMap?: Record<string, TechniqueProgress>;
  onUpdateStatus?: (techId: string, status: MasteryStatus) => void;
  onUpdateReps?: (techId: string, deltaDrill: number, deltaSparring: number) => void;
}

export const TechniqueDetailModal: React.FC<TechniqueDetailModalProps> = ({
  technique,
  isOpen,
  onClose,
  onLaunchInGPS,
  progressMap,
  onUpdateStatus,
  onUpdateReps,
}) => {
  if (!isOpen || !technique) return null;

  const getCategoryStyles = (category: string, catId?: string) => {
    const c = (catId || category).toLowerCase();
    if (c.includes('submission') || c.includes('soumission') || c.includes('attaque')) {
      return {
        badge: 'bg-[#ff453a]/20 text-[#ff453a] border border-[#ff453a]/30',
        dot: 'bg-[#ff453a]',
        label: 'Attaque / Soumission'
      };
    }
    if (c.includes('sweep') || c.includes('renversement') || c.includes('balayage')) {
      return {
        badge: 'bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30',
        dot: 'bg-[#30d158]',
        label: 'Renversement / Balayage'
      };
    }
    if (c.includes('pass') || c.includes('sortie') || c.includes('défense') || c.includes('ouverture')) {
      return {
        badge: 'bg-[#ffd60a]/20 text-[#ffd60a] border border-[#ffd60a]/30',
        dot: 'bg-[#ffd60a]',
        label: 'Sortie de Garde / Défense'
      };
    }
    return {
      badge: 'bg-[#0a84ff]/20 text-[#0a84ff] border border-[#0a84ff]/30',
      dot: 'bg-[#0a84ff]',
      label: 'Position de Contrôle'
    };
  };

  const style = getCategoryStyles(technique.category, technique.category_id);
  const reactions = technique.reactions || [];
  const currentProgress = progressMap ? progressMap[technique.id] : undefined;
  const currentStatus: MasteryStatus = currentProgress?.status || 'to_learn';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-spring-in">
        
        {/* Modal Header */}
        <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-white/40 font-mono">
              Ceinture {technique.belt_level || 'Blanche'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-white/30">·</span>
            <span className="text-[10px] text-slate-500 dark:text-white/50">
              {technique.is_gi && technique.is_nogi ? 'Gi & No-Gi' : technique.is_gi ? 'Gi' : 'No-Gi'}
            </span>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white/70 dark:hover:text-white active:scale-95 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          
          {/* Technique Title */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {technique.name}
            </h2>
          </div>

          {/* Mastery Level & Reps Section (Interactive) */}
          {onUpdateStatus && onUpdateReps && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-[#af52de]" />
                  <span>Mon Niveau de Maîtrise</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-white/50 font-mono">
                  {currentProgress?.drillReps || 0} drills · {currentProgress?.sparringSuccessCount || 0} sparrings
                </span>
              </div>

              {/* Status Segmented Buttons */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onUpdateStatus(technique.id, 'to_learn');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                    currentStatus === 'to_learn'
                      ? 'bg-white dark:bg-white/20 text-slate-800 dark:text-white shadow-xs font-bold border border-slate-200/80 dark:border-transparent'
                      : 'text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white/70 hover:bg-slate-300/40'
                  }`}
                >
                  ⚪ Découverte
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onUpdateStatus(technique.id, 'drilling');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                    currentStatus === 'drilling'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/25 dark:text-amber-200 shadow-xs font-bold'
                      : 'text-slate-500 dark:text-white/40 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  🟡 Drill
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onUpdateStatus(technique.id, 'sparring_ready');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                    currentStatus === 'sparring_ready'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-500/25 dark:text-blue-200 shadow-xs font-bold'
                      : 'text-slate-500 dark:text-white/40 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  🔵 Sparring
                </button>
                <button
                  onClick={() => {
                    soundFX.playSubmissionChime();
                    onUpdateStatus(technique.id, 'mastered');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                    currentStatus === 'mastered'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-500/25 dark:text-purple-200 shadow-xs font-bold'
                      : 'text-slate-500 dark:text-white/40 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  🟣 Réflexe
                </button>
              </div>

              {/* Fast Reps Buttons */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-white/50">Drill:</span>
                  <button
                    onClick={() => onUpdateReps(technique.id, 5, 0)}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 active:scale-95 text-slate-800 dark:text-white font-mono font-bold text-[10px] border border-slate-200 dark:border-white/10 shadow-xs"
                  >
                    +5 reps
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-white/50">Combat:</span>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateReps(technique.id, 0, 1);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-[#0a84ff]/20 dark:hover:bg-[#0a84ff]/30 dark:text-[#0a84ff] active:scale-95 font-mono font-bold text-[10px] border border-blue-200 dark:border-transparent shadow-xs"
                  >
                    +1 réussi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Preview / Radar Component */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xs">
            <TechniqueVideoPreview
              technique={technique}
              categoryBadgeColor={style.dot}
            />
          </div>

          {/* Key Checklist Steps */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
              Points Clés &amp; Exécution
            </span>
            <div className="space-y-1.5">
              {technique.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/8 text-xs text-slate-800 dark:text-white/90"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff] border border-blue-200 dark:border-[#0a84ff]/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Advice */}
          {technique.troubleshooting && (
            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-[#ffd60a]/10 border border-amber-200 dark:border-[#ffd60a]/25 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-[#ffd60a]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Dépannage &amp; Pièges Courants</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed pl-5">
                {technique.troubleshooting}
              </p>
            </div>
          )}

          {/* Connected Reactions */}
          {reactions.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
                Enchaînements &amp; Réactions Recommandés ({reactions.length})
              </span>
              <div className="space-y-1.5">
                {reactions.map((r, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/8 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="text-slate-800 dark:text-white/90 font-medium block">
                        {r.condition}
                      </span>
                      {r.tacticalTip && (
                        <span className="text-[11px] text-[#007aff] dark:text-[#0a84ff] font-medium block mt-0.5">
                          💡 {r.tacticalTip}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#1c1c1e]/90 backdrop-blur-md flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              soundFX.playRouteNav();
              onClose();
              onLaunchInGPS(technique.id, technique.system_tag);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#007aff] hover:bg-[#0071e3] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Lancer dans le GPS Tactique</span>
          </button>
        </div>
      </div>
    </div>
  );
};
