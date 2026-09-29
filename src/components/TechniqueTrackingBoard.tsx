'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Flame, 
  Shield, 
  RotateCcw, 
  Zap, 
  Play, 
  Navigation, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Plus, 
  Minus,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { Technique, MasteryStatus, TechniqueProgress } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface TechniqueTrackingBoardProps {
  techniques: Record<string, Technique>;
  progressMap: Record<string, TechniqueProgress>;
  onUpdateStatus: (techId: string, status: MasteryStatus) => void;
  onUpdateReps: (techId: string, deltaDrill: number, deltaSparring: number) => void;
  onUpdateNotes: (techId: string, notes: string) => void;
  onSelectTechnique: (technique: Technique) => void;
  onLaunchGPS: (systemId: string, startingTechniqueId?: string) => void;
}

type StatusFilter = 'all' | MasteryStatus;
type CategoryFilter = 'all' | 'defense' | 'sweep' | 'submission' | 'position';

export const TechniqueTrackingBoard: React.FC<TechniqueTrackingBoardProps> = ({
  techniques,
  progressMap,
  onUpdateStatus,
  onUpdateReps,
  onUpdateNotes,
  onSelectTechnique,
  onLaunchGPS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<Record<string, string>>({});

  const techniqueList = useMemo(() => {
    return Object.values(techniques);
  }, [techniques]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = techniqueList.length;
    let masteredCount = 0;
    let sparringCount = 0;
    let drillingCount = 0;
    let toLearnCount = 0;
    let totalDrillReps = 0;
    let totalSparringLandings = 0;

    techniqueList.forEach((t) => {
      const p = progressMap[t.id];
      const status = p?.status || 'to_learn';
      if (status === 'mastered') masteredCount++;
      else if (status === 'sparring_ready') sparringCount++;
      else if (status === 'drilling') drillingCount++;
      else toLearnCount++;

      totalDrillReps += p?.drillReps || 0;
      totalSparringLandings += p?.sparringSuccessCount || 0;
    });

    const activeOrMastered = masteredCount + sparringCount;
    const progressPercent = total > 0 ? Math.round((activeOrMastered / total) * 100) : 0;

    return {
      total,
      masteredCount,
      sparringCount,
      drillingCount,
      toLearnCount,
      totalDrillReps,
      totalSparringLandings,
      progressPercent,
    };
  }, [techniqueList, progressMap]);

  // Filtered List
  const filteredTechniques = useMemo(() => {
    return techniqueList.filter((tech) => {
      const p = progressMap[tech.id];
      const status: MasteryStatus = p?.status || 'to_learn';

      // Status filter
      if (statusFilter !== 'all' && status !== statusFilter) {
        return false;
      }

      // Category filter
      const cat = (tech.category_id || tech.category).toLowerCase();
      if (categoryFilter === 'defense') {
        const isDefense = cat.includes('pass') || cat.includes('sortie') || cat.includes('défense') || cat.includes('ouverture');
        if (!isDefense) return false;
      } else if (categoryFilter === 'sweep') {
        const isSweep = cat.includes('sweep') || cat.includes('renversement') || cat.includes('balayage');
        if (!isSweep) return false;
      } else if (categoryFilter === 'submission') {
        const isSub = cat.includes('submission') || cat.includes('soumission') || cat.includes('attaque');
        if (!isSub) return false;
      } else if (categoryFilter === 'position') {
        const isPos = cat.includes('position') || cat.includes('guard') || cat.includes('garde') || cat.includes('montée');
        if (!isPos) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tech.name.toLowerCase().includes(q);
        const matchesCategory = tech.category.toLowerCase().includes(q);
        const matchesDetails = tech.details.some(d => d.toLowerCase().includes(q));
        const matchesNotes = p?.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDetails && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [techniqueList, progressMap, statusFilter, categoryFilter, searchQuery]);

  const getStatusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'mastered':
        return {
          label: 'Maîtrisé',
          color: 'bg-purple-100 text-purple-900 border-purple-300 font-bold dark:bg-[#af52de]/20 dark:text-[#af52de] dark:border-[#af52de]/40',
          dot: 'bg-purple-600 dark:bg-[#af52de]',
          icon: Sparkles,
        };
      case 'sparring_ready':
        return {
          label: 'Validé Sparring',
          color: 'bg-blue-100 text-blue-900 border-blue-300 font-bold dark:bg-[#0a84ff]/20 dark:text-[#0a84ff] dark:border-[#0a84ff]/40',
          dot: 'bg-blue-600 dark:bg-[#0a84ff]',
          icon: CheckCircle2,
        };
      case 'drilling':
        return {
          label: 'En Drill',
          color: 'bg-amber-100 text-amber-950 border-amber-300 font-bold dark:bg-[#ffd60a]/20 dark:text-[#ffd60a] dark:border-[#ffd60a]/40',
          dot: 'bg-amber-600 dark:bg-[#ffd60a]',
          icon: Zap,
        };
      case 'to_learn':
      default:
        return {
          label: 'À Découvrir',
          color: 'bg-slate-100 text-slate-800 border-slate-300 font-bold dark:bg-white/10 dark:text-white/80 dark:border-white/20',
          dot: 'bg-slate-500 dark:bg-white/40',
          icon: Circle,
        };
    }
  };

  const getCategoryStyles = (category: string, catId?: string) => {
    const c = (catId || category).toLowerCase();
    if (c.includes('submission') || c.includes('soumission') || c.includes('attaque')) {
      return {
        badge: 'bg-rose-50 text-rose-800 font-bold border border-rose-300 dark:bg-[#ff453a]/15 dark:text-[#ff453a] dark:border-[#ff453a]/30',
        label: 'Soumission',
        icon: Zap,
      };
    }
    if (c.includes('sweep') || c.includes('renversement') || c.includes('balayage')) {
      return {
        badge: 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 dark:bg-[#30d158]/15 dark:text-[#30d158] dark:border-[#30d158]/30',
        label: 'Renversement',
        icon: RotateCcw,
      };
    }
    if (c.includes('pass') || c.includes('sortie') || c.includes('défense') || c.includes('ouverture')) {
      return {
        badge: 'bg-amber-50 text-amber-950 font-bold border border-amber-300 dark:bg-[#ffd60a]/15 dark:text-[#ffd60a] dark:border-[#ffd60a]/30',
        label: 'Sortie / Défense',
        icon: Shield,
      };
    }
    return {
      badge: 'bg-blue-50 text-blue-900 font-bold border border-blue-300 dark:bg-[#0a84ff]/15 dark:text-[#0a84ff] dark:border-[#0a84ff]/30',
      label: 'Position',
      icon: BookOpen,
    };
  };

  const handleLaunchInGPS = (tech: Technique) => {
    let sysId = tech.system_tag;
    if (!sysId) {
      const cat = (tech.category_id || tech.category || '').toLowerCase();
      if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) {
        sysId = 'guard_escapes_system';
      } else if (cat.includes('sweep') || cat.includes('renversement')) {
        sysId = 'sweeps_master_system';
      } else {
        sysId = 'closed_guard_system';
      }
    }
    onLaunchGPS(sysId, tech.id);
  };

  return (
    <div className="space-y-4">
      {/* Overview Analytics Card */}
      <div className="ios-card p-4 space-y-3.5 border border-slate-200 dark:border-white/10 shadow-xs bg-white dark:bg-[#1c1c1e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#af52de] to-[#0a84ff] flex items-center justify-center text-white shadow-md">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-white/60 block">
                Niveau Global de Maîtrise
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Matrice du Codex BJJ
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-[#007aff] dark:text-[#0a84ff] font-mono leading-none">
              {stats.progressPercent}%
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-white/60 block mt-0.5">
              {stats.masteredCount + stats.sparringCount} / {stats.total} validées
            </span>
          </div>
        </div>

        {/* Apple Fitness Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          <div 
            style={{ width: `${(stats.masteredCount / stats.total) * 100}%` }}
            className="h-full bg-purple-500 rounded-full transition-all duration-500" 
            title={`Maîtrisées: ${stats.masteredCount}`}
          />
          <div 
            style={{ width: `${(stats.sparringCount / stats.total) * 100}%` }}
            className="h-full bg-blue-500 rounded-full transition-all duration-500" 
            title={`Validées Sparring: ${stats.sparringCount}`}
          />
          <div 
            style={{ width: `${(stats.drillingCount / stats.total) * 100}%` }}
            className="h-full bg-amber-400 rounded-full transition-all duration-500" 
            title={`En Drill: ${stats.drillingCount}`}
          />
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button 
            onClick={() => setStatusFilter(statusFilter === 'mastered' ? 'all' : 'mastered')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'mastered' 
                ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-400/50 shadow-sm' 
                : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs'
            }`}
          >
            <span className="text-[10px] font-bold text-purple-900 dark:text-[#af52de] uppercase block truncate">Maîtrisées</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">{stats.masteredCount}</span>
          </button>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'sparring_ready' ? 'all' : 'sparring_ready')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'sparring_ready' 
                ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400/50 shadow-sm' 
                : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs'
            }`}
          >
            <span className="text-[10px] font-bold text-blue-900 dark:text-[#0a84ff] uppercase block truncate">Validées</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">{stats.sparringCount}</span>
          </button>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'drilling' ? 'all' : 'drilling')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'drilling' 
                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400/50 shadow-sm' 
                : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-950 dark:text-[#ffd60a] uppercase block truncate">En Drill</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">{stats.drillingCount}</span>
          </button>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'to_learn' ? 'all' : 'to_learn')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'to_learn' 
                ? 'bg-slate-200 border-slate-400 ring-2 ring-slate-400/50 shadow-sm' 
                : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-700 dark:text-white/70 uppercase block truncate">À Découvrir</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono">{stats.toLearnCount}</span>
          </button>
        </div>

        {/* Cumulative Reps Counters */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-[11px]">
          <span className="text-slate-700 dark:text-white/70 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-[#ffd60a]" />
            <span>Répétitions Drill :</span>
            <strong className="text-slate-900 dark:text-white font-mono font-black">{stats.totalDrillReps}</strong>
          </span>
          <span className="text-slate-700 dark:text-white/70 font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-[#ff453a]" />
            <span>Passées en combat :</span>
            <strong className="text-slate-900 dark:text-white font-mono font-black">{stats.totalSparringLandings}</strong>
          </span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une technique à évaluer..."
            className="w-full bg-white dark:bg-[#161618] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
                : 'bg-white dark:bg-white/5 text-slate-800 dark:text-white/80 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            Toutes ({techniqueList.length})
          </button>
          <button
            onClick={() => setCategoryFilter('defense')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'defense'
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
                : 'bg-white dark:bg-white/5 text-slate-800 dark:text-white/80 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${categoryFilter === 'defense' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
            <span>Sorties &amp; Défenses</span>
          </button>
          <button
            onClick={() => setCategoryFilter('sweep')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'sweep'
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
                : 'bg-white dark:bg-white/5 text-slate-800 dark:text-white/80 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${categoryFilter === 'sweep' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span>Renversements</span>
          </button>
          <button
            onClick={() => setCategoryFilter('submission')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'submission'
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
                : 'bg-white dark:bg-white/5 text-slate-800 dark:text-white/80 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${categoryFilter === 'submission' ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`} />
            <span>Soumissions</span>
          </button>
          <button
            onClick={() => setCategoryFilter('position')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'position'
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
                : 'bg-white dark:bg-white/5 text-slate-800 dark:text-white/80 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${categoryFilter === 'position' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
            <span>Positions</span>
          </button>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-white/50">
          <span>{filteredTechniques.length} résultat(s) filtré(s)</span>
          <button
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="text-[#007aff] dark:text-[#0a84ff] hover:underline font-bold text-[11px]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Techniques Mastery Table / Cards */}
      <div className="space-y-3">
        {filteredTechniques.map((tech) => {
          const progress = progressMap[tech.id];
          const status: MasteryStatus = progress?.status || 'to_learn';
          const catStyle = getCategoryStyles(tech.category, tech.category_id);
          const statusBadge = getStatusBadge(status);
          const isNotesOpen = expandedNotesId === tech.id;
          const currentNotes = tempNotes[tech.id] !== undefined ? tempNotes[tech.id] : (progress?.notes || '');

          return (
            <div 
              key={tech.id} 
              className="ios-card p-3.5 space-y-3 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs bg-white dark:bg-[#1c1c1e]"
            >
              {/* Row Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${catStyle.badge}`}>
                      {catStyle.label}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-white/60 font-mono font-semibold">
                      Ceinture {tech.belt_level || 'Blanche'}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-white/60 font-semibold">
                      · {tech.is_gi && tech.is_nogi ? 'Gi & No-Gi' : tech.is_gi ? 'Gi' : 'No-Gi'}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {tech.name}
                  </h3>
                </div>

                {/* Status Indicator Pill */}
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shrink-0 ${statusBadge.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                  <span>{statusBadge.label}</span>
                </div>
              </div>

              {/* 1-Tap Mastery Status Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-white/60 uppercase tracking-wider block mb-1">
                  Niveau d&apos;Avancement
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateStatus(tech.id, 'to_learn');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] transition-all text-center ${
                      status === 'to_learn'
                        ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-xs font-black border border-slate-300 dark:border-transparent'
                        : 'text-slate-700 dark:text-white/60 font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-white/60'
                    }`}
                  >
                    ⚪ Découverte
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateStatus(tech.id, 'drilling');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] transition-all text-center ${
                      status === 'drilling'
                        ? 'bg-amber-100 text-amber-950 border border-amber-400 dark:bg-amber-500/25 dark:text-amber-200 dark:border-amber-500/40 shadow-xs font-black'
                        : 'text-slate-700 dark:text-white/60 font-semibold hover:text-amber-950 dark:hover:text-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    🟡 Drill
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateStatus(tech.id, 'sparring_ready');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] transition-all text-center ${
                      status === 'sparring_ready'
                        ? 'bg-blue-100 text-blue-950 border border-blue-400 dark:bg-blue-500/25 dark:text-blue-200 dark:border-blue-500/40 shadow-xs font-black'
                        : 'text-slate-700 dark:text-white/60 font-semibold hover:text-blue-950 dark:hover:text-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    🔵 Sparring
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playSubmissionChime();
                      onUpdateStatus(tech.id, 'mastered');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] transition-all text-center ${
                      status === 'mastered'
                        ? 'bg-purple-100 text-purple-950 border border-purple-400 dark:bg-purple-500/25 dark:text-purple-200 dark:border-purple-500/40 shadow-xs font-black'
                        : 'text-slate-700 dark:text-white/60 font-semibold hover:text-purple-950 dark:hover:text-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    🟣 Réflexe
                  </button>
                </div>
              </div>

              {/* Reps Counters & Actions Row */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-white/5 flex-wrap">
                {/* Drill Reps counter */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-white/70">Drill:</span>
                  <button
                    onClick={() => onUpdateReps(tech.id, -5, 0)}
                    disabled={(progress?.drillReps || 0) <= 0}
                    className="w-5 h-5 rounded-md bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 shadow-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white min-w-[24px] text-center">
                    {progress?.drillReps || 0}
                  </span>
                  <button
                    onClick={() => onUpdateReps(tech.id, 5, 0)}
                    className="w-5 h-5 rounded-md bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Sparring Lands counter */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-white/70">Combat:</span>
                  <button
                    onClick={() => onUpdateReps(tech.id, 0, -1)}
                    disabled={(progress?.sparringSuccessCount || 0) <= 0}
                    className="w-5 h-5 rounded-md bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 shadow-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white min-w-[20px] text-center">
                    {progress?.sparringSuccessCount || 0}
                  </span>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateReps(tech.id, 0, 1);
                    }}
                    className="w-5 h-5 rounded-md bg-[#007aff] dark:bg-[#0a84ff] text-white active:scale-95 flex items-center justify-center shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Action Buttons: Fiche & GPS */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setExpandedNotesId(isNotesOpen ? null : tech.id);
                    }}
                    title="Ajouter une note personnelle"
                    className={`p-1.5 rounded-xl border transition-all ${
                      progress?.notes 
                        ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-[#ffd60a]/20 dark:border-[#ffd60a]/40 dark:text-[#ffd60a]' 
                        : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onSelectTechnique(tech);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all border border-slate-300 dark:border-transparent"
                  >
                    <Play className="w-3 h-3 text-[#ff3b30] fill-[#ff3b30]" />
                    <span>Fiche</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playRouteNav();
                      handleLaunchInGPS(tech);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                  >
                    <Navigation className="w-3 h-3 fill-white" />
                    <span>GPS</span>
                  </button>
                </div>
              </div>

              {/* Expandable Notes Drawer */}
              {isNotesOpen && (
                <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2 animate-fade-in">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                    Notes &amp; Réglages Personnels pour {tech.name}
                  </label>
                  <textarea
                    value={currentNotes}
                    onChange={(e) => setTempNotes({ ...tempNotes, [tech.id]: e.target.value })}
                    placeholder="Ex: Penser à bien coller la tête sur sa hanche avant d'engager le crochet..."
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-black/50 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setExpandedNotesId(null)}
                      className="px-2.5 py-1 rounded-lg text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        onUpdateNotes(tech.id, currentNotes);
                        setExpandedNotesId(null);
                        soundFX.playClick();
                      }}
                      className="px-3 py-1 rounded-lg bg-[#007aff] dark:bg-[#0a84ff] text-white text-[10px] font-bold shadow-xs active:scale-95 transition-all"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
