'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  Shield, 
  Zap, 
  Crosshair, 
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
}

type FilterType = 'Tous' | 'Favoris' | 'Gi' | 'No-Gi' | 'Soumissions';

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

  const filters: FilterType[] = ['Tous', 'Favoris', 'Gi', 'No-Gi', 'Soumissions'];

  return (
    <div className="flex-1 flex flex-col p-4 pb-12 space-y-4 animate-spring-in">
      {/* iOS Large Title Header */}
      <div className="pt-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
          Tactical Navigation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Itinéraires BJJ
        </h1>
      </div>

      {/* iOS Frosted Search Field */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une position, réaction, Kimura..."
          className="w-full bg-[#1c1c1e] text-sm text-white placeholder-white/40 pl-10 pr-9 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-[10px]"
          >
            ✕
          </button>
        )}
      </div>

      {/* iOS Segmented Control */}
      <div className="flex bg-[#1c1c1e] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
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
                  ? 'bg-[#2c2c2e] text-white shadow-sm font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {f === 'Favoris' && <Star className="w-3 h-3 text-[#ffd60a] fill-[#ffd60a]" />}
              <span>{f}</span>
            </button>
          );
        })}
      </div>

      {/* Direct Search / Favorites List */}
      {searchedTechniques.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-1">
            {activeFilter === 'Favoris' ? `Favoris (${searchedTechniques.length})` : `Résultats (${searchedTechniques.length})`}
          </span>
          <div className="bg-[#1c1c1e] rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
            {searchedTechniques.map((tech) => (
              <div
                key={tech.id}
                onClick={() => {
                  soundFX.playRouteNav();
                  onLaunchGPS(tech.system_tag || 'closed_guard_system', tech.id);
                }}
                className="p-3.5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{tech.name}</h4>
                  <p className="text-[10px] text-white/50">{tech.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(e, tech.id)}
                    className="p-1 text-white/30 hover:text-[#ffd60a]"
                  >
                    <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(tech.id) ? 'text-[#ffd60a] fill-[#ffd60a]' : ''}`} />
                  </button>
                  <ChevronRight className="w-4 h-4 text-white/30" />
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
          <div className="w-9 h-9 rounded-2xl bg-[#ffd60a]/15 text-[#ffd60a] border border-[#ffd60a]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white/90">Chrono</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenRules?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#bf5af2]/15 text-[#bf5af2] border border-[#bf5af2]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white/90">Règles</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenPassport?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white/90">Passeport</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            onOpenBackup?.();
          }}
          className="ios-card-interactive p-2.5 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Database className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white/90">Backup</span>
        </button>
      </div>

      {/* Fight IQ Reflex Drill Banner */}
      {onLaunchDrill && (
        <div
          onClick={onLaunchDrill}
          className="ios-card-interactive p-4 flex items-center justify-between cursor-pointer border border-[#ffd60a]/20 bg-gradient-to-r from-[#ffd60a]/10 via-[#1c1c1e] to-[#1c1c1e]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd60a]/20 border border-[#ffd60a]/30 flex items-center justify-center text-[#ffd60a] shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  Mode Réflexe Sous Pression
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#ffd60a]/20 text-[#ffd60a]">
                  6s
                </span>
              </div>
              <p className="text-[11px] text-white/50 mt-0.5">
                Automatisez vos réactions face aux counters
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </div>
      )}

      {/* Recommended Routes Section with "+ Nouveau Flow" Button */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Systèmes Tactiques
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              {filteredSystems.length} ROUTES
            </span>
          </div>

          {onOpenCustomModal && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenCustomModal();
              }}
              className="text-[11px] font-bold text-[#30d158] hover:text-[#30d158]/80 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#30d158]/10 border border-[#30d158]/25 active:scale-95 transition-all"
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
                className="ios-card-interactive p-4 flex flex-col justify-between cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isClosedGuard ? 'bg-[#0a84ff]/20 text-[#0a84ff] border border-[#0a84ff]/30' :
                      isAshi ? 'bg-[#ff453a]/20 text-[#ff453a] border border-[#ff453a]/30' :
                      'bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30'
                    }`}>
                      {isClosedGuard ? <Shield className="w-5 h-5" /> :
                       isAshi ? <Zap className="w-5 h-5" /> :
                       <Crosshair className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-[#0a84ff] transition-colors">
                          {sys.name}
                        </h3>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed mt-1 line-clamp-2">
                        {sys.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(e, sys.id)}
                    className="p-1 text-white/30 hover:text-[#ffd60a] shrink-0"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'text-[#ffd60a] fill-[#ffd60a]' : ''}`} />
                  </button>
                </div>

                <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      {sys.difficulty}
                    </span>
                    <span>·</span>
                    <span>{sys.nodeCount} embranchements</span>
                    <span>·</span>
                    <span>{sys.is_gi && sys.is_nogi ? 'Gi & No-Gi' : sys.is_gi ? 'Gi' : 'No-Gi'}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#0a84ff]">
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
