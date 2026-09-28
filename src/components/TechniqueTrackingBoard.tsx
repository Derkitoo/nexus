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
          color: 'bg-[#af52de]/15 text-[#8944ab] dark:text-[#af52de] border-[#af52de]/30',
          dot: 'bg-[#af52de]',
          icon: Sparkles,
        };
      case 'sparring_ready':
        return {
          label: 'Validé Sparring',
          color: 'bg-[#007aff]/12 dark:bg-[#0a84ff]/15 text-[#007aff] dark:text-[#0a84ff] border-[#007aff]/30 dark:border-[#0a84ff]/30',
          dot: 'bg-[#007aff] dark:bg-[#0a84ff]',
          icon: CheckCircle2,
        };
      case 'drilling':
        return {
          label: 'En Drill',
          color: 'bg-[#ffd60a]/20 text-[#b45309] dark:text-[#ffd60a] border-[#ffd60a]/40',
          dot: 'bg-[#d97706] dark:bg-[#ffd60a]',
          icon: Zap,
        };
      case 'to_learn':
      default:
        return {
          label: 'À Découvrir',
          color: 'bg-black/5 dark:bg-white/10 text-[#636366] dark:text-white/60 border-black/10 dark:border-white/10',
          dot: 'bg-black/30 dark:bg-white/40',
          icon: Circle,
        };
    }
  };

  const getCategoryStyles = (category: string, catId?: string) => {
    const c = (catId || category).toLowerCase();
    if (c.includes('submission') || c.includes('soumission') || c.includes('attaque')) {
      return {
        badge: 'bg-[#ff3b30]/12 dark:bg-[#ff453a]/15 text-[#dc2626] dark:text-[#ff453a] border border-[#dc2626]/25 dark:border-[#ff453a]/30',
        label: 'Soumission',
        icon: Zap,
      };
    }
    if (c.includes('sweep') || c.includes('renversement') || c.includes('balayage')) {
      return {
        badge: 'bg-[#34c759]/15 dark:bg-[#30d158]/15 text-[#15803d] dark:text-[#30d158] border border-[#15803d]/25 dark:border-[#30d158]/30',
        label: 'Renversement',
        icon: RotateCcw,
      };
    }
    if (c.includes('pass') || c.includes('sortie') || c.includes('défense') || c.includes('ouverture')) {
      return {
        badge: 'bg-[#ffd60a]/20 text-[#b45309] dark:text-[#ffd60a] border border-[#d97706]/30 dark:border-[#ffd60a]/30',
        label: 'Sortie / Défense',
        icon: Shield,
      };
    }
    return {
      badge: 'bg-[#007aff]/12 dark:bg-[#0a84ff]/15 text-[#007aff] dark:text-[#0a84ff] border border-[#007aff]/25 dark:border-[#0a84ff]/30',
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
      <div className="ios-card p-4 space-y-3.5 border border-black/5 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#af52de] to-[#0a84ff] flex items-center justify-center text-white shadow-md">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93] dark:text-white/40 block">
                Niveau Global de Maîtrise
              </span>
              <h2 className="text-base font-extrabold text-[#1c1c1e] dark:text-white tracking-tight">
                Matrice du Codex BJJ
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-[#007aff] dark:text-[#0a84ff] font-mono leading-none">
              {stats.progressPercent}%
            </span>
            <span className="text-[10px] font-medium text-[#8e8e93] dark:text-white/50 block mt-0.5">
              {stats.masteredCount + stats.sparringCount} / {stats.total} validées
            </span>
          </div>
        </div>

        {/* Apple Fitness Progress Bar */}
        <div className="w-full h-2.5 bg-[#e5e5ea] dark:bg-white/10 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          <div 
            style={{ width: `${(stats.masteredCount / stats.total) * 100}%` }}
            className="h-full bg-[#af52de] rounded-full transition-all duration-500" 
            title={`Maîtrisées: ${stats.masteredCount}`}
          />
          <div 
            style={{ width: `${(stats.sparringCount / stats.total) * 100}%` }}
            className="h-full bg-[#007aff] dark:bg-[#0a84ff] rounded-full transition-all duration-500" 
            title={`Validées Sparring: ${stats.sparringCount}`}
          />
          <div 
            style={{ width: `${(stats.drillingCount / stats.total) * 100}%` }}
            className="h-full bg-[#ffd60a] rounded-full transition-all duration-500" 
            title={`En Drill: ${stats.drillingCount}`}
          />
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button 
            onClick={() => setStatusFilter(statusFilter === 'mastered' ? 'all' : 'mastered')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'mastered' 
                ? 'bg-[#af52de]/20 border-[#af52de] ring-1 ring-[#af52de]' 
                : 'bg-[#f2f2f7] dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-[9px] font-bold text-[#af52de] uppercase block truncate">Maîtrisées</span>
            <span className="text-sm font-black text-[#1c1c1e] dark:text-white font-mono">{stats.masteredCount}</span>
          </button>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'sparring_ready' ? 'all' : 'sparring_ready')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'sparring_ready' 
                ? 'bg-[#0a84ff]/20 border-[#0a84ff] ring-1 ring-[#0a84ff]' 
                : 'bg-[#f2f2f7] dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-[9px] font-bold text-[#007aff] dark:text-[#0a84ff] uppercase block truncate">Validées</span>
            <span className="text-sm font-black text-[#1c1c1e] dark:text-white font-mono">{stats.sparringCount}</span>
          </button>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'drilling' ? 'all' : 'drilling')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'drilling' 
                ? 'bg-[#ffd60a]/20 border-[#ffd60a] ring-1 ring-[#ffd60a]' 
                : 'bg-[#f2f2f7] dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-[9px] font-bold text-[#b45309] dark:text-[#ffd60a] uppercase block truncate">En Drill</span>
            <span className="text-sm font-black text-[#1c1c1e] dark:text-white font-mono">{stats.drillingCount}</span>
          </button>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'to_learn' ? 'all' : 'to_learn')}
            className={`p-2 rounded-xl text-center transition-all border ${
              statusFilter === 'to_learn' 
                ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/40 ring-1 ring-black/10 dark:ring-white/30' 
                : 'bg-[#f2f2f7] dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-[9px] font-bold text-[#636366] dark:text-white/50 uppercase block truncate">À Découvrir</span>
            <span className="text-sm font-black text-[#1c1c1e] dark:text-white font-mono">{stats.toLearnCount}</span>
          </button>
        </div>

        {/* Cumulative Reps Counters */}
        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[11px]">
          <span className="text-[#636366] dark:text-white/50 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#d97706] dark:text-[#ffd60a]" />
            <span>Répétitions Drill :</span>
            <strong className="text-[#1c1c1e] dark:text-white font-mono">{stats.totalDrillReps}</strong>
          </span>
          <span className="text-[#636366] dark:text-white/50 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#dc2626] dark:text-[#ff453a]" />
            <span>Passées en combat :</span>
            <strong className="text-[#1c1c1e] dark:text-white font-mono">{stats.totalSparringLandings}</strong>
          </span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93] dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une technique à évaluer..."
            className="w-full bg-white dark:bg-[#161618] text-xs text-[#1c1c1e] dark:text-white placeholder-[#8e8e93] dark:placeholder-white/40 pl-10 pr-9 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8e93] hover:text-[#1c1c1e] dark:hover:text-white"
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
                ? 'bg-[#1c1c1e] text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-[#e5e5ea] dark:bg-white/5 text-[#1c1c1e]/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            Toutes ({techniqueList.length})
          </button>
          <button
            onClick={() => setCategoryFilter('defense')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'defense'
                ? 'bg-[#ffd60a] text-black shadow-md font-extrabold'
                : 'bg-[#e5e5ea] dark:bg-white/5 text-[#1c1c1e]/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <Shield className="w-3 h-3 text-[#b45309] dark:text-black" />
            <span>Sorties &amp; Défenses</span>
          </button>
          <button
            onClick={() => setCategoryFilter('sweep')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'sweep'
                ? 'bg-[#30d158] text-black shadow-md font-extrabold'
                : 'bg-[#e5e5ea] dark:bg-white/5 text-[#1c1c1e]/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <RotateCcw className="w-3 h-3 text-[#15803d] dark:text-black" />
            <span>Renversements</span>
          </button>
          <button
            onClick={() => setCategoryFilter('submission')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'submission'
                ? 'bg-[#ff453a] text-white shadow-md font-extrabold'
                : 'bg-[#e5e5ea] dark:bg-white/5 text-[#1c1c1e]/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <Zap className="w-3 h-3 text-[#dc2626] dark:text-white" />
            <span>Soumissions</span>
          </button>
          <button
            onClick={() => setCategoryFilter('position')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'position'
                ? 'bg-[#007aff] text-white shadow-md font-extrabold'
                : 'bg-[#e5e5ea] dark:bg-white/5 text-[#1c1c1e]/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3 h-3 text-[#007aff] dark:text-white" />
            <span>Positions</span>
          </button>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
        <div className="flex items-center justify-between px-1 text-xs text-[#8e8e93] dark:text-white/50">
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
              className="ios-card p-3.5 space-y-3 border border-black/5 dark:border-white/10 hover:border-black/15 dark:hover:border-white/20 transition-all shadow-sm"
            >
              {/* Row Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${catStyle.badge}`}>
                      {catStyle.label}
                    </span>
                    <span className="text-[10px] text-[#8e8e93] dark:text-white/40 font-mono">
                      Ceinture {tech.belt_level || 'Blanche'}
                    </span>
                    <span className="text-[10px] text-[#8e8e93] dark:text-white/40">
                      {tech.is_gi && tech.is_nogi ? 'Gi & No-Gi' : tech.is_gi ? 'Gi' : 'No-Gi'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1c1c1e] dark:text-white leading-tight">
                    {tech.name}
                  </h3>
                </div>

                {/* Status Indicator Pill */}
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shrink-0 ${statusBadge.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                  <span>{statusBadge.label}</span>
                </div>
              </div>

              {/* 1-Tap Mastery Status Selector (Apple iOS Native Style) */}
              <div>
                <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/40 uppercase tracking-wider block mb-1">
                  Niveau d'Avancement
                </label>
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#e5e5ea] dark:bg-black/40 rounded-xl border border-black/5 dark:border-white/5">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateStatus(tech.id, 'to_learn');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      status === 'to_learn'
                        ? 'bg-white dark:bg-white/20 text-[#1c1c1e] dark:text-white shadow-sm ring-1 ring-black/10 dark:ring-white/30'
                        : 'text-[#636366] dark:text-white/40 hover:text-[#1c1c1e] dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    ⚪ Découverte
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateStatus(tech.id, 'drilling');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      status === 'drilling'
                        ? 'bg-[#ffd60a] text-black shadow-sm font-extrabold'
                        : 'text-[#636366] dark:text-white/40 hover:text-[#1c1c1e] dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    🟡 Drill
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateStatus(tech.id, 'sparring_ready');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      status === 'sparring_ready'
                        ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-sm font-extrabold'
                        : 'text-[#636366] dark:text-white/40 hover:text-[#1c1c1e] dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    🔵 Sparring
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playSubmissionChime();
                      onUpdateStatus(tech.id, 'mastered');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      status === 'mastered'
                        ? 'bg-[#af52de] text-white shadow-sm font-extrabold'
                        : 'text-[#636366] dark:text-white/40 hover:text-[#1c1c1e] dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    🟣 Réflexe
                  </button>
                </div>
              </div>

              {/* Reps Counters & Actions Row */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5 dark:border-white/5 flex-wrap">
                {/* Drill Reps counter */}
                <div className="flex items-center gap-1.5 bg-[#f2f2f7] dark:bg-black/30 px-2 py-1 rounded-xl border border-black/5 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[#636366] dark:text-white/50">Drill:</span>
                  <button
                    onClick={() => onUpdateReps(tech.id, -5, 0)}
                    disabled={(progress?.drillReps || 0) <= 0}
                    className="w-5 h-5 rounded-md bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-[#1c1c1e] dark:text-white border border-black/5 dark:border-white/10 shadow-sm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold text-[#1c1c1e] dark:text-white min-w-[24px] text-center">
                    {progress?.drillReps || 0}
                  </span>
                  <button
                    onClick={() => onUpdateReps(tech.id, 5, 0)}
                    className="w-5 h-5 rounded-md bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/20 active:scale-95 flex items-center justify-center text-[#1c1c1e] dark:text-white border border-black/5 dark:border-white/10 shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Sparring Lands counter */}
                <div className="flex items-center gap-1.5 bg-[#f2f2f7] dark:bg-black/30 px-2 py-1 rounded-xl border border-black/5 dark:border-white/5">
                  <span className="text-[10px] font-bold text-[#636366] dark:text-white/50">Sparring:</span>
                  <button
                    onClick={() => onUpdateReps(tech.id, 0, -1)}
                    disabled={(progress?.sparringSuccessCount || 0) <= 0}
                    className="w-5 h-5 rounded-md bg-white dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-[#1c1c1e] dark:text-white border border-black/5 dark:border-white/10 shadow-sm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold text-[#1c1c1e] dark:text-white min-w-[20px] text-center">
                    {progress?.sparringSuccessCount || 0}
                  </span>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateReps(tech.id, 0, 1);
                    }}
                    className="w-5 h-5 rounded-md bg-[#007aff] dark:bg-[#0a84ff] text-white active:scale-95 flex items-center justify-center shadow-sm"
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
                        ? 'bg-[#ffd60a]/20 border-[#d97706]/40 text-[#b45309] dark:text-[#ffd60a]' 
                        : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-[#636366] dark:text-white/60 hover:text-[#1c1c1e] dark:hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onSelectTechnique(tech);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#1c1c1e] dark:text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all border border-black/5 dark:border-transparent"
                  >
                    <Play className="w-3 h-3 text-[#ff3b30] dark:text-[#ff453a]" />
                    <span>Fiche</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playRouteNav();
                      handleLaunchInGPS(tech);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#007aff]/10 dark:bg-[#0a84ff]/20 hover:bg-[#007aff]/20 dark:hover:bg-[#0a84ff]/30 text-[#007aff] dark:text-[#0a84ff] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all border border-[#007aff]/20 dark:border-transparent"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>GPS</span>
                  </button>
                </div>
              </div>

              {/* Expandable Notes Drawer */}
              {isNotesOpen && (
                <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2 animate-fade-in">
                  <label className="text-[10px] font-bold text-[#8e8e93] dark:text-white/50 uppercase tracking-wider block">
                    Notes &amp; Réglages Personnels pour {tech.name}
                  </label>
                  <textarea
                    value={currentNotes}
                    onChange={(e) => setTempNotes({ ...tempNotes, [tech.id]: e.target.value })}
                    placeholder="Ex: Penser à bien coller la tête sur sa hanche avant d'engager le crochet..."
                    rows={2}
                    className="w-full bg-[#f2f2f7] dark:bg-black/50 text-xs text-[#1c1c1e] dark:text-white placeholder-[#8e8e93] dark:placeholder-white/30 p-2.5 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setExpandedNotesId(null)}
                      className="px-2.5 py-1 rounded-lg text-[10px] text-[#8e8e93] hover:text-[#1c1c1e] dark:hover:text-white"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        onUpdateNotes(tech.id, currentNotes);
                        setExpandedNotesId(null);
                        soundFX.playClick();
                      }}
                      className="px-3 py-1 rounded-lg bg-[#007aff] dark:bg-[#0a84ff] text-white text-[10px] font-bold shadow-sm active:scale-95 transition-all"
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
