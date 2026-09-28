'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  Shield, 
  ShieldCheck,
  Zap, 
  Crosshair, 
  RotateCcw,
  ArrowRight, 
  ChevronRight,
  Star,
  Timer,
  Plus,
  Scale,
  Database,
  Award,
  Clock
} from 'lucide-react';
import { TacticalSystem, Technique, UserProfile } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface DashboardViewProps {
  systems: TacticalSystem[];
  techniques: Record<string, Technique>;
  userProfile: UserProfile;
  onLaunchGPS: (systemId: string, startingTechniqueId?: string) => void;
  onLaunchDrill?: () => void;
  onOpenCustomModal?: () => void;
  onOpenTimer?: () => void;
  onOpenRules?: () => void;
  onOpenBackup?: () => void;
  onOpenPassport?: () => void;
  progressMap?: Record<string, import('@/types/bjj').TechniqueProgress>;
  onNavigateToTab?: (tab: 'explore' | 'techniques' | 'gps' | 'drill' | 'journal') => void;
}

type FilterType = 'Tous' | 'Favoris' | 'Renversements' | 'Sorties & Défense' | 'Gi' | 'No-Gi' | 'Soumissions';

export const DashboardView: React.FC<DashboardViewProps> = ({
  systems,
  techniques,
  userProfile,
  onLaunchGPS,
  onLaunchDrill,
  onOpenCustomModal,
  onOpenTimer,
  onOpenRules,
  onOpenBackup,
  onOpenPassport,
  progressMap,
  onNavigateToTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tous');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bjj_favorites');
      if (saved) {
        try {
          setFavoriteIds(JSON.parse(saved));
        } catch {
          setFavoriteIds([]);
        }
      }
    }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundFX.playClick();
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('bjj_favorites', JSON.stringify(next));
      }
      return next;
    });
  };

  const filteredSystems = useMemo(() => {
    return systems.filter((sys) => {
      if (activeFilter === 'Favoris' && !favoriteIds.includes(sys.id)) return false;
      if (activeFilter === 'Renversements' && sys.id !== 'sweeps_master_system' && !sys.description.toLowerCase().includes('balayage') && !sys.description.toLowerCase().includes('sweep') && !sys.description.toLowerCase().includes('renversement')) return false;
      if (activeFilter === 'Sorties & Défense' && sys.id !== 'guard_escapes_system' && !sys.description.toLowerCase().includes('défense') && !sys.description.toLowerCase().includes('sortie')) return false;
      if (activeFilter === 'Gi' && !sys.is_gi) return false;
      if (activeFilter === 'No-Gi' && !sys.is_nogi) return false;
      if (activeFilter === 'Soumissions' && !sys.description.toLowerCase().includes('kimura') && !sys.description.toLowerCase().includes('heel hook')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sys.name.toLowerCase().includes(q);
        const matchesDesc = sys.description.toLowerCase().includes(q);
        const matchesTech = Object.values(techniques).some(
          (t) => t.system_tag === sys.rootTechniqueId || t.name.toLowerCase().includes(q)
        );
        return matchesName || matchesDesc || matchesTech;
      }
      return true;
    });
  }, [systems, activeFilter, searchQuery, techniques, favoriteIds]);

  const masteryStats = useMemo(() => {
    const techList = Object.values(techniques);
    const total = techList.length;
    let validated = 0;
    let mastered = 0;
    techList.forEach((t) => {
      const p = progressMap?.[t.id];
      if (p?.status === 'mastered') {
        mastered++;
        validated++;
      } else if (p?.status === 'sparring_ready') {
        validated++;
      }
    });
    const percent = total > 0 ? Math.round((validated / total) * 100) : 0;
    return { total, validated, mastered, percent };
  }, [techniques, progressMap]);

  const searchedTechniques = useMemo(() => {
    if (!searchQuery.trim() && activeFilter !== 'Favoris') return [];
    if (activeFilter === 'Favoris') {
      return Object.values(techniques).filter((t) => favoriteIds.includes(t.id));
    }
    const q = searchQuery.toLowerCase();
    return Object.values(techniques).filter(
      (t) => t.name.toLowerCase().includes(q) || t.troubleshooting?.toLowerCase().includes(q)
    );
  }, [searchQuery, techniques, activeFilter, favoriteIds]);

  const filters: FilterType[] = ['Tous', 'Favoris', 'Renversements', 'Sorties & Défense', 'Gi', 'No-Gi', 'Soumissions'];

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4 animate-spring-in">
      {/* iOS Large Title Header */}
      <div className="pt-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
          Tactical Navigation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Itinéraires BJJ
        </h1>
      </div>

      {/* iOS Frosted Search Field */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une position, réaction, Kimura..."
          className="w-full bg-white dark:bg-[#1c1c1e] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 dark:bg-white/20 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-[10px]"
          >
            ✕
          </button>
        )}
      </div>

      {/* iOS Segmented Control */}
      <div className="flex bg-slate-200/80 dark:bg-[#1c1c1e] p-1 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => {
                soundFX.playClick();
                setActiveFilter(f);
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f === 'Favoris' && <Star className="w-3 h-3 text-[#d97706] dark:text-[#ffd60a] fill-[#d97706] dark:fill-[#ffd60a]" />}
              <span>{f}</span>
            </button>
          );
        })}
      </div>

      {/* Direct Search / Favorites List */}
      {searchedTechniques.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 px-1">
            {activeFilter === 'Favoris' ? `Favoris (${searchedTechniques.length})` : `Résultats (${searchedTechniques.length})`}
          </span>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-xs">
            {searchedTechniques.map((tech) => (
              <div
                key={tech.id}
                onClick={() => {
                  soundFX.playRouteNav();
                  onLaunchGPS(tech.system_tag || 'closed_guard_system', tech.id);
                }}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tech.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-white/50">{tech.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(e, tech.id)}
                    className="p-1 text-slate-400 dark:text-white/30 hover:text-[#d97706] dark:hover:text-[#ffd60a]"
                  >
                    <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(tech.id) ? 'text-[#d97706] fill-[#d97706] dark:text-[#ffd60a] dark:fill-[#ffd60a]' : ''}`} />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* iOS Quick Tools Bar */}
      <div className="grid grid-cols-4 gap-2 pt-0.5">
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenTimer?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 dark:bg-[#ffd60a]/15 dark:text-[#ffd60a] dark:border-[#ffd60a]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-white/90">Chrono</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenRules?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 dark:bg-[#bf5af2]/15 dark:text-[#bf5af2] dark:border-[#bf5af2]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-white/90">Règles</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenPassport?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 dark:bg-[#0a84ff]/15 dark:text-[#0a84ff] dark:border-[#0a84ff]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-white/90">Passeport</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenBackup?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-[#30d158]/15 dark:text-[#30d158] dark:border-[#30d158]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Database className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-white/90">Backup</span>
        </button>
      </div>

      {/* Technique Progress & Training Tracker Widget */}
      {onNavigateToTab && (
        <div
          onClick={() => {
            soundFX.playClick();
            onNavigateToTab('journal');
          }}
          className="ios-card-interactive p-3.5 flex items-center justify-between cursor-pointer border border-blue-200/80 hover:border-blue-300 bg-blue-50/70 dark:bg-[#0a84ff]/10 dark:border-[#0a84ff]/25 group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-[#0a84ff]/20 border border-blue-200 dark:border-[#0a84ff]/30 flex items-center justify-center text-[#007aff] dark:text-[#0a84ff] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Tableau de Suivi &amp; Maîtrise
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-[#0a84ff]/20 text-[#007aff] dark:text-[#0a84ff]">
                  {masteryStats.percent}%
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-white/60 mt-0.5">
                {masteryStats.validated} / {masteryStats.total} techniques validées · Suivre l'avancement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#007aff] dark:text-[#0a84ff] text-xs font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Ouvrir</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Fight IQ Reflex Drill Banner */}
      {onLaunchDrill && (
        <div
          onClick={onLaunchDrill}
          className="ios-card-interactive p-4 flex items-center justify-between cursor-pointer border border-amber-200/80 hover:border-amber-300 bg-amber-50/70 dark:bg-[#ffd60a]/10 dark:border-[#ffd60a]/25 group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-[#ffd60a]/20 border border-amber-200 dark:border-[#ffd60a]/30 flex items-center justify-center text-amber-700 dark:text-[#ffd60a] shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Mode Réflexe Sous Pression
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-[#ffd60a]/20 text-amber-800 dark:text-[#ffd60a]">
                  6s
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-white/60 mt-0.5">
                Automatisez vos réactions face aux counters
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/40 group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}

      {/* Recommended Routes Section with "+ Nouveau Flow" Button */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">
              Systèmes Tactiques
            </span>
            <span className="text-[10px] text-slate-400 dark:text-white/40 font-mono">
              {filteredSystems.length} ROUTES
            </span>
          </div>

          {onOpenCustomModal && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenCustomModal();
              }}
              className="text-[11px] font-bold text-emerald-700 dark:text-[#30d158] hover:opacity-80 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#30d158]/10 border border-emerald-200 dark:border-[#30d158]/25 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau Flow</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredSystems.map((sys) => {
            const isClosedGuard = sys.rootTechniqueId === 'closed_guard';
            const isAshi = sys.rootTechniqueId === 'ashi_garami';
            const isFav = favoriteIds.includes(sys.id);

            return (
              <div
                key={sys.id}
                onClick={() => {
                  soundFX.playRouteNav();
                  onLaunchGPS(sys.id, sys.rootTechniqueId);
                }}
                className="ios-card-interactive p-4 flex flex-col justify-between cursor-pointer group shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      sys.id.includes('guard_escapes') ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-[#ffd60a]/20 dark:text-[#ffd60a] dark:border-[#ffd60a]/30' :
                      sys.id.includes('sweeps') ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-[#30d158]/20 dark:text-[#30d158] dark:border-[#30d158]/30' :
                      isClosedGuard ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-[#0a84ff]/20 dark:text-[#0a84ff] dark:border-[#0a84ff]/30' :
                      isAshi ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-[#ff453a]/20 dark:text-[#ff453a] dark:border-[#ff453a]/30' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-[#30d158]/20 dark:text-[#30d158] dark:border-[#30d158]/30'
                    }`}>
                      {sys.id.includes('guard_escapes') ? <ShieldCheck className="w-5 h-5" /> :
                       sys.id.includes('sweeps') ? <RotateCcw className="w-5 h-5" /> :
                       isClosedGuard ? <Shield className="w-5 h-5" /> :
                       isAshi ? <Zap className="w-5 h-5" /> :
                       <Crosshair className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#007aff] transition-colors">
                          {sys.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed mt-1 line-clamp-2">
                        {sys.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, sys.id)}
                    className="p-1 text-slate-400 dark:text-white/30 hover:text-[#d97706] dark:hover:text-[#ffd60a] shrink-0"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'text-[#d97706] fill-[#d97706] dark:text-[#ffd60a] dark:fill-[#ffd60a]' : ''}`} />
                  </button>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-white/50 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/80">
                      {sys.difficulty}
                    </span>
                    <span>·</span>
                    <span>{sys.nodeCount} embranchements</span>
                    <span>·</span>
                    <span>{sys.is_gi && sys.is_nogi ? 'Gi & No-Gi' : sys.is_gi ? 'Gi' : 'No-Gi'}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#007aff] dark:text-[#0a84ff]">
                    <span>Démarrer</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
