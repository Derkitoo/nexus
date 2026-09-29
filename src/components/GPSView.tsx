'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  RotateCcw, 
  Compass, 
  GitCommit, 
  CornerDownRight, 
  ShieldCheck, 
  Undo2, 
  FileEdit, 
  Save, 
  Check, 
  Navigation,
  Sparkles,
  Award,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Technique, TacticalSystem } from '@/types/bjj';
import { TechniqueVideoPreview } from './TechniqueVideoPreview';
import { soundFX } from '@/utils/audioFeedback';

interface GPSViewProps {
  system: TacticalSystem;
  currentTechnique: Technique;
  allTechniques: Record<string, Technique>;
  breadcrumbs: string[];
  onSelectReaction: (nextId: string) => void;
  onNavigateBreadcrumb: (index: number) => void;
  onUndo: () => void;
  onReset: () => void;
  onBackToDashboard: () => void;
  onOpenFlowModal: () => void;
}

export const GPSView: React.FC<GPSViewProps> = ({
  system,
  currentTechnique,
  allTechniques,
  breadcrumbs,
  onSelectReaction,
  onNavigateBreadcrumb,
  onUndo,
  onReset,
  onBackToDashboard,
  onOpenFlowModal,
}) => {
  const [sheetMode, setSheetMode] = useState<'actions' | 'details'>('actions');
  const [isMatMode, setIsMatMode] = useState(false);
  
  // Interactive Checklist Mastery per technique (localStorage)
  const [checkedDetails, setCheckedDetails] = useState<number[]>([]);

  // Coach notes
  const [note, setNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  // When technique changes: load checklist & notes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNote = localStorage.getItem(`bjj_note_${currentTechnique.id}`);
      setNote(savedNote || '');
      setIsEditingNote(false);

      const savedChecks = localStorage.getItem(`bjj_checks_${currentTechnique.id}`);
      if (savedChecks) {
        try {
          setCheckedDetails(JSON.parse(savedChecks));
        } catch {
          setCheckedDetails([]);
        }
      } else {
        setCheckedDetails([]);
      }
    }
  }, [currentTechnique.id, currentTechnique.name, currentTechnique.details]);

  const toggleCheckDetail = (index: number) => {
    soundFX.playClick();
    setCheckedDetails((prev) => {
      const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bjj_checks_${currentTechnique.id}`, JSON.stringify(next));
      }
      if (next.length === currentTechnique.details.length && currentTechnique.details.length > 0) {
        soundFX.playSubmissionChime();
      }
      return next;
    });
  };

  const handleSaveNote = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bjj_note_${currentTechnique.id}`, note);
      setNoteSaved(true);
      setIsEditingNote(false);
      soundFX.playClick();
      setTimeout(() => setNoteSaved(false), 2000);
    }
  };

  const getCategoryStyles = (category: string, catId?: string) => {
    const c = (catId || category).toLowerCase();
    if (c.includes('submission') || c.includes('soumission') || c.includes('attaque')) {
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#ff453a]/20 dark:text-[#ff453a] dark:border-[#ff453a]/30',
        dot: 'bg-rose-500 dark:bg-[#ff453a]',
      };
    }
    if (c.includes('sweep') || c.includes('renversement') || c.includes('balayage')) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#30d158]/20 dark:text-[#30d158] dark:border-[#30d158]/30',
        dot: 'bg-emerald-500 dark:bg-[#30d158]',
      };
    }
    if (c.includes('pass') || c.includes('sortie') || c.includes('défense') || c.includes('ouverture')) {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#ffd60a]/20 dark:text-[#ffd60a] dark:border-[#ffd60a]/30',
        dot: 'bg-amber-500 dark:bg-[#ffd60a]',
      };
    }
    return {
      badge: 'bg-blue-50 text-[#007aff] border-blue-200 dark:bg-[#0a84ff]/20 dark:text-[#0a84ff] dark:border-[#0a84ff]/30',
      dot: 'bg-[#007aff] dark:bg-[#0a84ff]',
    };
  };

  const currentStyles = getCategoryStyles(currentTechnique.category, currentTechnique.category_id);
  const reactions = currentTechnique.reactions || [];
  const masteryPercent = currentTechnique.details.length > 0 
    ? Math.round((checkedDetails.length / currentTechnique.details.length) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-[#f2f2f7] dark:bg-black text-slate-900 dark:text-white min-h-screen relative overflow-hidden select-none pb-28">
      {/* 1. Apple Maps Floating Turn Banner (Top Maneuver Card) */}
      <div className="sticky top-0 z-30 p-3 pt-2">
        <div className="bg-white/90 dark:bg-[#161618]/90 backdrop-blur-2xl rounded-3xl p-3 border border-slate-200/80 dark:border-white/15 shadow-sm dark:shadow-2xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-2xl bg-[#007aff] dark:bg-[#0a84ff] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#007aff]/30">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider border ${currentStyles.badge}`}>
                    {currentTechnique.category}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono">
                    Étape {breadcrumbs.length}
                  </span>
                  {masteryPercent === 100 && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#30d158]/20 dark:text-[#30d158] dark:border-[#30d158]/30 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Maîtrisé
                    </span>
                  )}
                </div>
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white truncate tracking-tight mt-0.5">
                  {currentTechnique.name}
                </h1>
              </div>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onBackToDashboard();
              }}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/15 dark:hover:bg-white/20 active:scale-95 text-xs font-bold text-slate-700 dark:text-white transition-all shrink-0 border border-slate-200/80 dark:border-white/10"
            >
              Fin
            </button>
          </div>

          {/* Breadcrumb Steps Pill Track */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-white/10 text-[11px]">
            {breadcrumbs.map((techId, index) => {
              const tech = allTechniques[techId];
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${techId}-${index}`}>
                  <button
                    onClick={() => {
                      soundFX.playRouteNav();
                      onNavigateBreadcrumb(index);
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isLast
                        ? 'bg-[#007aff] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tech ? tech.name : techId}
                  </button>
                  {!isLast && <span className="text-slate-300 dark:text-white/30 text-xs">›</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Tactical Visual Stage */}
      <div className="relative px-3 flex-1 pb-72">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-2xl">
          <TechniqueVideoPreview
            technique={currentTechnique}
            categoryBadgeColor={currentStyles.dot}
          />

          {/* Floating Apple Maps Map Controls (Right Edge) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenFlowModal();
              }}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all border border-slate-200/80 dark:border-white/20 shadow-md"
              title="Cartographie réseau"
            >
              <GitCommit className="w-4 h-4 text-[#007aff] dark:text-[#0a84ff]" />
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onReset();
              }}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all border border-slate-200/80 dark:border-white/20 shadow-md"
              title="Recalibrer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setIsMatMode(true);
              }}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all border border-slate-200/80 dark:border-white/20 shadow-md"
              title="Mode Tatami Plein Écran (HUD)"
            >
              <Maximize2 className="w-4 h-4 text-amber-500 dark:text-[#ffd60a]" />
            </button>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex bg-slate-200/70 dark:bg-[#1c1c1e] p-1 rounded-2xl border border-slate-200/80 dark:border-white/10 mt-3">
          <button
            onClick={() => setSheetMode('actions')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sheetMode === 'actions'
                ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Décisions ({reactions.length})
          </button>
          <button
            onClick={() => setSheetMode('details')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              sheetMode === 'details'
                ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Checklist &amp; Débrief</span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-[#30d158] font-bold">
              {masteryPercent}%
            </span>
          </button>
        </div>

        {/* Details Mode Content */}
        {sheetMode === 'details' && (
          <div className="mt-3 space-y-3 animate-spring-in">
            {/* Interactive Checkable Checklist */}
            <div className="ios-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#007aff] dark:text-[#0a84ff]" />
                  Checklist d&apos;exécution tactique
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-[#30d158] font-bold">
                  {checkedDetails.length} / {currentTechnique.details.length} validés
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {currentTechnique.details.map((detail, idx) => {
                  const isChecked = checkedDetails.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheckDetail(idx)}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs cursor-pointer transition-all active:scale-[0.99] ${
                        isChecked 
                          ? 'bg-emerald-50 dark:bg-[#30d158]/10 border-emerald-200 dark:border-[#30d158]/40 text-emerald-950 dark:text-white' 
                          : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#30d158] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-white/30 shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'font-medium' : ''}>{detail}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Troubleshooting Alert Card */}
            {currentTechnique.troubleshooting && (
              <div className="ios-card p-4 border border-amber-200 dark:border-[#ffd60a]/30 bg-amber-50/70 dark:bg-[#ffd60a]/10 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-[#ffd60a]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Contre &amp; Dépannage
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-white/80 leading-relaxed pl-6">
                  {currentTechnique.troubleshooting}
                </p>
              </div>
            )}

            {/* Coach Notes */}
            <div className="ios-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 flex items-center gap-1.5">
                  <FileEdit className="w-4 h-4 text-purple-600 dark:text-[#bf5af2]" />
                  Notes du Professeur
                </span>
                {noteSaved && (
                  <span className="text-[10px] text-emerald-600 dark:text-[#30d158] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Enregistré
                  </span>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Notez les conseils donnés par votre coach..."
                    className="w-full bg-slate-50 dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] resize-none h-16"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 dark:text-white/50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1 bg-[#007aff] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingNote(true)}
                  className="p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200/80 dark:border-white/5 text-xs text-slate-400 dark:text-white/50 italic cursor-pointer hover:border-slate-300 dark:hover:border-white/15 transition-colors"
                >
                  {note ? (
                    <span className="not-italic text-slate-800 dark:text-white/90">{note}</span>
                  ) : (
                    "+ Ajouter une consigne ou sensation de combat"
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Apple Bottom Decision Sheet docked above Apple TabBar */}
      <div className="fixed bottom-[62px] left-0 right-0 z-40 max-w-[460px] mx-auto bg-white/95 dark:bg-[#161618]/95 backdrop-blur-2xl rounded-t-[28px] border-t border-x border-slate-200/80 dark:border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-2xl p-3.5 pb-4 space-y-2.5">
        <div className="w-8 h-1 rounded-full bg-slate-300 dark:bg-white/20 mx-auto" />

        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
            <CornerDownRight className="w-4 h-4 text-[#007aff] dark:text-[#0a84ff]" />
            Que fait l&apos;adversaire ?
          </span>

          {breadcrumbs.length > 1 && (
            <button
              onClick={() => {
                soundFX.playClick();
                onUndo();
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 transition-colors active:scale-95"
            >
              <Undo2 className="w-3 h-3" />
              <span>Annuler</span>
            </button>
          )}
        </div>

        {/* Reaction Maneuver Cards */}
        <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-0.5">
          {reactions.length > 0 ? (
            reactions.map((reaction, index) => {
              const targetTech = allTechniques[reaction.nextId];
              const targetCategory = targetTech ? getCategoryStyles(targetTech.category, targetTech.category_id) : currentStyles;

              return (
                <button
                  key={index}
                  onClick={() => {
                    const isTargetFinish = targetTech && (targetTech.category_id === 'submission' || targetTech.category_id === 'sweep');
                    if (isTargetFinish) {
                      soundFX.playSubmissionChime();
                    } else {
                      soundFX.playRouteNav();
                    }
                    onSelectReaction(reaction.nextId);
                  }}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100/90 active:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 dark:active:bg-white/15 active:scale-[0.98] border border-slate-200/80 dark:border-white/10 hover:border-[#007aff]/60 dark:hover:border-[#0a84ff]/60 rounded-xl p-2.5 transition-all flex items-center justify-between gap-2.5 group"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#007aff] dark:group-hover:text-[#0a84ff] transition-colors leading-tight block truncate">
                      {reaction.condition}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border ${targetCategory.badge}`}>
                        → {targetTech ? targetTech.name : reaction.nextId}
                      </span>
                      {reaction.tacticalTip && (
                        <span className="text-[10px] text-slate-400 dark:text-white/40 truncate max-w-[180px]">
                          · {reaction.tacticalTip}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-slate-200/70 group-hover:bg-[#007aff] group-hover:text-white flex items-center justify-center text-slate-400 dark:bg-white/10 dark:text-white/40 transition-colors shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-[#30d158]/15 border border-emerald-200 dark:border-[#30d158]/30 text-center space-y-1.5">
              <span className="text-xs font-black text-emerald-700 dark:text-[#30d158] block">
                🎯 Destination Finale Atteinte !
              </span>
              <button
                onClick={() => {
                  soundFX.playRouteNav();
                  onReset();
                }}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
              >
                Recommencer l&apos;itinéraire
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Fullscreen Mode Tatami HUD Overlay */}
      {isMatMode && (
        <div className="fixed inset-0 z-50 bg-[#0d0d0f] flex flex-col justify-between p-4 sm:p-6 animate-spring-in select-none">
          {/* Top HUD Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#0a84ff] text-white flex items-center justify-center shadow-lg shadow-[#0a84ff]/30">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0a84ff]">
                    Cockpit Tatami HUD
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">
                    Étape {breadcrumbs.length}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white/80">{system.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMatMode(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/20 text-white text-xs font-bold active:scale-95 border border-white/20 transition-all"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Quitter</span>
              </button>
            </div>
          </div>

          {/* Center Giant Technique Card */}
          <div className="my-auto py-4 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <span className={`w-2.5 h-2.5 rounded-full ${currentStyles.dot}`} />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                {currentTechnique.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight px-2">
              {currentTechnique.name}
            </h1>

            {currentTechnique.details.length > 0 && (
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-xl text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a84ff] block mb-1">
                  Point clé d&apos;exécution :
                </span>
                <p className="text-sm font-semibold text-white/90 leading-snug">
                  👉 {currentTechnique.details[0]}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Large Touch Reaction Targets */}
          <div className="space-y-2.5 pt-3 border-t border-white/15">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-white/60">
                Que fait l&apos;adversaire ? (Appuyez)
              </span>
              {breadcrumbs.length > 1 && (
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onUndo();
                  }}
                  className="text-xs font-bold text-[#0a84ff] flex items-center gap-1 active:scale-95"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Précédent</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
              {reactions.length > 0 ? (
                reactions.map((reaction, index) => {
                  const targetTech = allTechniques[reaction.nextId];
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const isTargetFinish = targetTech && (targetTech.category_id === 'submission' || targetTech.category_id === 'sweep');
                        if (isTargetFinish) {
                          soundFX.playSubmissionChime();
                        } else {
                          soundFX.playRouteNav();
                        }
                        onSelectReaction(reaction.nextId);
                      }}
                      className="w-full p-4 rounded-2xl bg-[#1c1c1e] hover:bg-[#2c2c2e] active:scale-[0.98] border border-white/15 hover:border-[#0a84ff] text-left flex items-center justify-between gap-3 transition-all group"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-sm sm:text-base font-extrabold text-white block leading-tight group-hover:text-[#0a84ff] transition-colors">
                          {reaction.condition}
                        </span>
                        <span className="text-xs font-bold text-[#0a84ff] block">
                          → Réaction : {targetTech ? targetTech.name : reaction.nextId}
                        </span>
                      </div>
                      <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white shrink-0 transition-colors" />
                    </button>
                  );
                })
              ) : (
                <div className="p-4 rounded-2xl bg-[#30d158]/20 border border-[#30d158]/40 text-center space-y-2">
                  <span className="text-base font-black text-[#30d158] block">
                    🎯 Destination Finale Atteinte !
                  </span>
                  <button
                    onClick={() => {
                      soundFX.playRouteNav();
                      onReset();
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#30d158] text-black font-extrabold text-sm active:scale-95 shadow-lg"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
