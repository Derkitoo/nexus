'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Plus, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Activity, 
  User, 
  TrendingUp,
  Sparkles,
  Zap,
  BarChart2,
  Trash2,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Technique, UserProfile, TechniqueProgress, MasteryStatus, TrainingSession, TrainingType, TrainingIntensity } from '@/types/bjj';
import { TechniqueTrackingBoard } from './TechniqueTrackingBoard';
import { soundFX } from '@/utils/audioFeedback';

interface SparringJournalViewProps {
  techniques: Record<string, Technique>;
  userProfile: UserProfile;
  progressMap: Record<string, TechniqueProgress>;
  onUpdateStatus: (techId: string, status: MasteryStatus) => void;
  onUpdateReps: (techId: string, deltaDrill: number, deltaSparring: number) => void;
  onUpdateNotes: (techId: string, notes: string) => void;
  onSelectTechnique: (technique: Technique) => void;
  onLaunchGPS: (systemId: string, startingTechniqueId?: string) => void;
}

export const SparringJournalView: React.FC<SparringJournalViewProps> = ({
  techniques,
  userProfile,
  progressMap,
  onUpdateStatus,
  onUpdateReps,
  onUpdateNotes,
  onSelectTechnique,
  onLaunchGPS,
}) => {
  // Top Segmented Tab: 'techniques' (Tableau de Suivi) or 'sessions' (Sessions d'Entraînement)
  const [activeSegment, setActiveSegment] = useState<'techniques' | 'sessions'>('techniques');
  
  // Training sessions state
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isAddingSession, setIsAddingSession] = useState(false);

  // Form state
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [trainingType, setTrainingType] = useState<TrainingType>('nogi');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [roundsCount, setRoundsCount] = useState(6);
  const [intensity, setIntensity] = useState<TrainingIntensity>('hard');
  const [selectedFocusTechniques, setSelectedFocusTechniques] = useState<string[]>([]);
  const [partnerNotes, setPartnerNotes] = useState('');
  const [sparringNotes, setSparringNotes] = useState('');
  const [submissionLanded, setSubmissionLanded] = useState('');
  const [sweepLanded, setSweepLanded] = useState('');

  // Load training sessions from localStorage with legacy migration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem('bjj_training_sessions');
      if (savedSessions) {
        try {
          setSessions(JSON.parse(savedSessions));
        } catch {
          setSessions([]);
        }
      } else {
        // Check for legacy sparring journal entries
        const legacyJournal = localStorage.getItem('bjj_sparring_journal');
        if (legacyJournal) {
          try {
            const parsed = JSON.parse(legacyJournal);
            const migrated: TrainingSession[] = parsed.map((item: any, idx: number) => ({
              id: item.id || `migrated-${idx}-${Date.now()}`,
              date: item.date === 'Hier' ? '2026-09-27' : '2026-09-28',
              trainingType: 'nogi',
              durationMinutes: 90,
              roundsCount: 5,
              intensity: 'hard',
              techniquesWorked: [item.techniqueSubmitted, item.sweepLanded].filter(Boolean),
              partnerNotes: `${item.partner || 'Partenaire'} (${item.partnerBelt || 'Bleue'})`,
              sparringNotes: item.notes || '',
              submissionsLanded: item.techniqueSubmitted ? [item.techniqueSubmitted] : [],
              sweepsLanded: item.sweepLanded ? [item.sweepLanded] : [],
            }));
            setSessions(migrated);
            localStorage.setItem('bjj_training_sessions', JSON.stringify(migrated));
          } catch {
            setSessions([]);
          }
        } else {
          // Default initial sample sessions
          const initialSamples: TrainingSession[] = [
            {
              id: 'sample-1',
              date: '2026-09-27',
              trainingType: 'nogi',
              durationMinutes: 90,
              roundsCount: 6,
              intensity: 'hard',
              techniquesWorked: ['kimura', 'hip_bump_from_kimura', 'armbar'],
              partnerNotes: 'Lucas (Violette)',
              sparringNotes: 'Très bon rythme en sparring. La feinte de Kimura vers le Hip Bump est passée directement.',
              submissionsLanded: ['kimura'],
              sweepsLanded: ['hip_bump_from_kimura'],
            },
            {
              id: 'sample-2',
              date: '2026-09-25',
              trainingType: 'gi',
              durationMinutes: 75,
              roundsCount: 4,
              intensity: 'moderate',
              techniquesWorked: ['triangle', 'guard_pass_torreando', 'omoplata'],
              partnerNotes: 'Marc (Bleue) & Thomas (Blanche)',
              sparringNotes: 'Travail spécifique sur la fermeture de garde et ouverture de hanche.',
              submissionsLanded: ['triangle'],
              sweepsLanded: [],
            }
          ];
          setSessions(initialSamples);
          localStorage.setItem('bjj_training_sessions', JSON.stringify(initialSamples));
        }
      }
    }
  }, []);

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: TrainingSession = {
      id: `session-${Date.now()}`,
      date: sessionDate,
      trainingType,
      durationMinutes,
      roundsCount,
      intensity,
      techniquesWorked: selectedFocusTechniques,
      partnerNotes: partnerNotes.trim() || undefined,
      sparringNotes: sparringNotes.trim() || undefined,
      submissionsLanded: submissionLanded ? [submissionLanded] : [],
      sweepsLanded: sweepLanded ? [sweepLanded] : [],
    };

    const next = [newSession, ...sessions];
    setSessions(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bjj_training_sessions', JSON.stringify(next));
    }

    // Auto-update technique progress for landed submissions or sweeps
    if (submissionLanded) {
      onUpdateReps(submissionLanded, 0, 1);
    }
    if (sweepLanded) {
      onUpdateReps(sweepLanded, 0, 1);
    }

    soundFX.playSubmissionChime();
    setIsAddingSession(false);
    setPartnerNotes('');
    setSparringNotes('');
    setSelectedFocusTechniques([]);
    setSubmissionLanded('');
    setSweepLanded('');
  };

  const handleDeleteSession = (id: string) => {
    const next = sessions.filter(s => s.id !== id);
    setSessions(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bjj_training_sessions', JSON.stringify(next));
    }
    soundFX.playClick();
  };

  // Sessions Volume Statistics
  const sessionStats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const totalRounds = sessions.reduce((acc, s) => acc + s.roundsCount, 0);
    const giSessions = sessions.filter(s => s.trainingType === 'gi').length;
    const nogiSessions = sessions.filter(s => s.trainingType === 'nogi').length;

    return {
      totalSessions,
      totalHours,
      totalRounds,
      giSessions,
      nogiSessions,
    };
  }, [sessions]);

  const getTrainingTypeBadge = (type: TrainingType) => {
    switch (type) {
      case 'gi':
        return { label: 'Gi (Kimono)', color: 'bg-blue-100 text-blue-900 border-blue-300 font-bold dark:bg-[#0a84ff]/15 dark:text-[#0a84ff] dark:border-[#0a84ff]/30' };
      case 'nogi':
        return { label: 'No-Gi', color: 'bg-purple-100 text-purple-900 border-purple-300 font-bold dark:bg-[#af52de]/15 dark:text-[#af52de] dark:border-[#af52de]/30' };
      case 'open_mat':
        return { label: 'Open Mat', color: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold dark:bg-[#30d158]/15 dark:text-[#30d158] dark:border-[#30d158]/30' };
      case 'drills':
        return { label: 'Drills Spécifiques', color: 'bg-amber-100 text-amber-950 border-amber-300 font-bold dark:bg-[#ffd60a]/20 dark:text-[#ffd60a] dark:border-[#ffd60a]/30' };
      case 'competition':
        return { label: 'Prépa Compétition', color: 'bg-rose-100 text-rose-950 border-rose-300 font-bold dark:bg-[#ff453a]/15 dark:text-[#ff453a] dark:border-[#ff453a]/30' };
    }
  };

  const getIntensityBadge = (int: TrainingIntensity) => {
    switch (int) {
      case 'light':
        return { label: 'Légère', color: 'text-slate-600 dark:text-white/60 font-bold' };
      case 'moderate':
        return { label: 'Modérée', color: 'text-amber-800 dark:text-[#ffd60a] font-bold' };
      case 'hard':
        return { label: 'Intense', color: 'text-orange-800 dark:text-[#ff9f0a] font-bold' };
      case 'extreme':
        return { label: 'Extrême 🔥', color: 'text-rose-800 dark:text-[#ff453a] font-black' };
    }
  };

  const toggleFocusTechnique = (techId: string) => {
    if (selectedFocusTechniques.includes(techId)) {
      setSelectedFocusTechniques(selectedFocusTechniques.filter(id => id !== techId));
    } else {
      setSelectedFocusTechniques([...selectedFocusTechniques, techId]);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-28 space-y-4 animate-spring-in max-w-md mx-auto w-full">
      {/* iOS Large Title Header */}
      <div className="pt-2 px-1 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
            Centre d'Entraînement BJJ
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Suivi &amp; Progression
          </h1>
        </div>

        {activeSegment === 'sessions' && (
          <button
            onClick={() => {
              soundFX.playClick();
              setIsAddingSession(!isAddingSession);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#007aff] dark:bg-[#0a84ff] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Séance</span>
          </button>
        )}
      </div>

      {/* Top Segmented Bar (Apple iOS Native Style) */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveSegment('techniques');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSegment === 'techniques'
              ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Tableau des Techniques</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveSegment('sessions');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSegment === 'sessions'
              ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Journal des Séances</span>
        </button>
      </div>

      {/* VIEW 1: TABLEAU DE SUIVI DES TECHNIQUES */}
      {activeSegment === 'techniques' && (
        <TechniqueTrackingBoard
          techniques={techniques}
          progressMap={progressMap}
          onUpdateStatus={onUpdateStatus}
          onUpdateReps={onUpdateReps}
          onUpdateNotes={onUpdateNotes}
          onSelectTechnique={onSelectTechnique}
          onLaunchGPS={onLaunchGPS}
        />
      )}

      {/* VIEW 2: SESSIONS D'ENTRAÎNEMENT & SPARRING */}
      {activeSegment === 'sessions' && (
        <div className="space-y-4">
          {/* Apple Fitness Activity Summary Rings/Pills */}
          <div className="grid grid-cols-3 gap-2">
            <div className="ios-card p-3 text-center space-y-0.5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1c1e] shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider block">Séances</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{sessionStats.totalSessions}</span>
            </div>
            <div className="ios-card p-3 text-center space-y-0.5 border border-blue-200 dark:border-[#0a84ff]/30 bg-blue-50/70 dark:bg-[#0a84ff]/5 shadow-xs">
              <span className="text-[10px] font-bold text-[#007aff] dark:text-[#0a84ff] uppercase tracking-wider block">Temps Tatami</span>
              <span className="text-xl font-black text-[#007aff] dark:text-[#0a84ff] font-mono">{sessionStats.totalHours}h</span>
            </div>
            <div className="ios-card p-3 text-center space-y-0.5 border border-emerald-200 dark:border-[#30d158]/30 bg-emerald-50/70 dark:bg-[#30d158]/5 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-[#30d158] uppercase tracking-wider block">Rounds</span>
              <span className="text-xl font-black text-emerald-700 dark:text-[#30d158] font-mono">{sessionStats.totalRounds}</span>
            </div>
          </div>

          {/* Add Session Form Drawer */}
          {isAddingSession && (
            <form onSubmit={handleSaveSession} className="ios-card p-4 space-y-3.5 border border-blue-200 dark:border-[#0a84ff]/40 bg-blue-50/40 dark:bg-[#0a84ff]/5 animate-spring-in shadow-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-bold text-[#1c1c1e] dark:text-white">Enregistrer une Séance de Tatami</span>
                <button
                  type="button"
                  onClick={() => setIsAddingSession(false)}
                  className="text-[11px] text-[#8e8e93] hover:text-[#1c1c1e] dark:hover:text-white"
                >
                  Annuler
                </button>
              </div>

              {/* Date & Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-[#f2f2f7] dark:bg-black/60 text-xs text-[#1c1c1e] dark:text-white px-2.5 py-2 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block mb-1">
                    Format
                  </label>
                  <select
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value as TrainingType)}
                    className="w-full bg-[#f2f2f7] dark:bg-black/60 text-xs text-[#1c1c1e] dark:text-white px-2 py-2 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none"
                  >
                    <option value="gi">🥋 Gi (Kimono)</option>
                    <option value="nogi">🩳 No-Gi</option>
                    <option value="open_mat">🤼 Open Mat</option>
                    <option value="drills">⚡ Drills</option>
                    <option value="competition">🏆 Prépa Compétition</option>
                  </select>
                </div>
              </div>

              {/* Duration & Rounds & Intensity */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block mb-1">
                    Durée (min)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-[#f2f2f7] dark:bg-black/60 text-xs text-[#1c1c1e] dark:text-white px-2.5 py-2 rounded-xl border border-black/10 dark:border-white/10 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block mb-1">
                    Rounds
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={roundsCount}
                    onChange={(e) => setRoundsCount(Number(e.target.value))}
                    className="w-full bg-[#f2f2f7] dark:bg-black/60 text-xs text-[#1c1c1e] dark:text-white px-2.5 py-2 rounded-xl border border-black/10 dark:border-white/10 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block mb-1">
                    Intensité
                  </label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value as TrainingIntensity)}
                    className="w-full bg-[#f2f2f7] dark:bg-black/60 text-xs text-[#1c1c1e] dark:text-white px-1.5 py-2 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none"
                  >
                    <option value="light">Légère</option>
                    <option value="moderate">Modérée</option>
                    <option value="hard">Intense</option>
                    <option value="extreme">Extrême 🔥</option>
                  </select>
                </div>
              </div>

              {/* Focus Techniques Picker */}
              <div>
                <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block mb-1">
                  Techniques Clés Travaillées ce jour
                </label>
                <div className="max-h-24 overflow-y-auto p-1.5 bg-[#f2f2f7] dark:bg-black/40 rounded-xl border border-black/10 dark:border-white/10 flex flex-wrap gap-1">
                  {Object.values(techniques).slice(0, 16).map((t) => {
                    const isSelected = selectedFocusTechniques.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleFocusTechnique(t.id)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white border-transparent'
                            : 'bg-white dark:bg-white/5 text-[#1c1c1e] dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submissions & Sweeps landed during session */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-white/50 uppercase tracking-wider block mb-1">
                    Soumission Passée
                  </label>
                  <select
                    value={submissionLanded}
                    onChange={(e) => setSubmissionLanded(e.target.value)}
                    className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white px-2 py-2 rounded-xl border border-slate-300 dark:border-white/10 focus:outline-none truncate"
                  >
                    <option value="">Aucune</option>
                    {Object.values(techniques)
                        .filter((t) => t.category_id === 'submission' || t.category.includes('Soumission'))
                        .map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 dark:text-white/50 uppercase tracking-wider block mb-1">
                    Renversement Réussi
                  </label>
                  <select
                    value={sweepLanded}
                    onChange={(e) => setSweepLanded(e.target.value)}
                    className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white px-2 py-2 rounded-xl border border-slate-300 dark:border-white/10 focus:outline-none truncate"
                  >
                    <option value="">Aucun</option>
                    {Object.values(techniques)
                        .filter((t) => t.category_id === 'sweep' || t.category.includes('Renversement'))
                        .map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                  </select>
                </div>
              </div>

              {/* Partner & Débrief */}
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-white/50 uppercase tracking-wider block mb-1">
                  Partenaires du Jour
                </label>
                <input
                  type="text"
                  value={partnerNotes}
                  onChange={(e) => setPartnerNotes(e.target.value)}
                  placeholder="Ex: Lucas (Violette), Marc (Bleue)..."
                  className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-white/50 uppercase tracking-wider block mb-1">
                  Débrief &amp; Analyse de la Séance
                </label>
                <textarea
                  value={sparringNotes}
                  onChange={(e) => setSparringNotes(e.target.value)}
                  placeholder="Sensations, erreurs observées, points techniques à corriger..."
                  className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 p-2.5 rounded-xl border border-slate-300 dark:border-white/10 focus:outline-none resize-none h-16"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#007aff] dark:bg-[#0a84ff] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Valider &amp; Enregistrer la Séance
              </button>
            </form>
          )}

          {/* Sessions List */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 px-1">
              Historique des Entraînements ({sessions.length})
            </span>

            {sessions.map((session) => {
              const typeBadge = getTrainingTypeBadge(session.trainingType);
              const intBadge = getIntensityBadge(session.intensity);

              return (
                <div key={session.id} className="ios-card p-4 space-y-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1c1e] shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${typeBadge.color}`}>
                          {typeBadge.label}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-white/40 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" />
                          {session.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#007aff] dark:text-[#0a84ff]" />
                          <strong className="text-slate-900 dark:text-white font-mono">{session.durationMinutes}m</strong>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-[#30d158]" />
                          <strong className="text-slate-900 dark:text-white font-mono">{session.roundsCount} rounds</strong>
                        </span>
                        <span>·</span>
                        <span className={`text-[11px] font-bold ${intBadge.color}`}>
                          {intBadge.label}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-[#ff453a] transition-colors"
                      title="Supprimer la séance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Highlights pills */}
                  {((session.submissionsLanded && session.submissionsLanded.length > 0) || 
                    (session.sweepsLanded && session.sweepsLanded.length > 0) ||
                    (session.techniquesWorked && session.techniquesWorked.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {session.submissionsLanded?.map((subId) => (
                        <span key={subId} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-[#ff453a]/20 dark:text-[#ff453a] dark:border-[#ff453a]/30">
                          🎯 {techniques[subId]?.name || subId}
                        </span>
                      ))}
                      {session.sweepsLanded?.map((swpId) => (
                        <span key={swpId} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#30d158]/20 dark:text-[#30d158] dark:border-[#30d158]/30">
                          🔄 {techniques[swpId]?.name || swpId}
                        </span>
                      ))}
                      {session.techniquesWorked?.map((techId) => (
                        <span key={techId} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/10">
                          {techniques[techId]?.name || techId}
                        </span>
                      ))}
                    </div>
                  )}

                  {session.partnerNotes && (
                    <div className="text-[11px] text-slate-600 dark:text-white/60 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
                      <span>Avec : <strong className="text-slate-900 dark:text-white">{session.partnerNotes}</strong></span>
                    </div>
                  )}

                  {session.sparringNotes && (
                    <p className="text-xs text-slate-800 dark:text-white/80 bg-slate-50 dark:bg-black/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 leading-relaxed italic">
                      « {session.sparringNotes} »
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
