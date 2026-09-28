'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Play, 
  Navigation, 
  Shield, 
  RotateCcw, 
  Zap, 
  Compass, 
  Filter, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Technique } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface TechniqueListViewProps {
  techniques: Record<string, Technique>;
  onSelectTechnique: (technique: Technique) => void;
  onLaunchGPS: (systemId: string, startingTechniqueId?: string) => void;
  progressMap?: Record<string, import('@/types/bjj').TechniqueProgress>;
}

type CategoryFilter = 'all' | 'defense' | 'sweep' | 'submission' | 'position';
type BeltFilter = 'all' | 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
type GiFilter = 'all' | 'gi' | 'nogi';

export const TechniqueListView: React.FC<TechniqueListViewProps> = ({
  techniques,
  onSelectTechnique,
  onLaunchGPS,
  progressMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedBelt, setSelectedBelt] = useState<BeltFilter>('all');
  const [selectedGi, setSelectedGi] = useState<GiFilter>('all');

  const techniqueList = useMemo(() => {
    return Object.values(techniques);
  }, [techniques]);

  // Filtering logic
  const filteredTechniques = useMemo(() => {
    return techniqueList.filter((tech) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tech.name.toLowerCase().includes(query);
        const matchesCategory = tech.category.toLowerCase().includes(query);
        const matchesDetails = tech.details.some(d => d.toLowerCase().includes(query));
        const matchesTroubleshooting = tech.troubleshooting?.toLowerCase().includes(query);
        const matchesTag = tech.system_tag?.toLowerCase().includes(query);

        if (!matchesName && !matchesCategory && !matchesDetails && !matchesTroubleshooting && !matchesTag) {
          return false;
        }
      }

      // 2. Category Filter
      const cat = (tech.category_id || tech.category).toLowerCase();
      if (selectedCategory === 'defense') {
        const isDefense = cat.includes('pass') || cat.includes('sortie') || cat.includes('défense') || cat.includes('ouverture');
        if (!isDefense) return false;
      } else if (selectedCategory === 'sweep') {
        const isSweep = cat.includes('sweep') || cat.includes('renversement') || cat.includes('balayage');
        if (!isSweep) return false;
      } else if (selectedCategory === 'submission') {
        const isSubmission = cat.includes('submission') || cat.includes('soumission') || cat.includes('attaque');
        if (!isSubmission) return false;
      } else if (selectedCategory === 'position') {
        const isPosition = cat.includes('position') || cat.includes('guard') || cat.includes('garde') || cat.includes('montée');
        if (!isPosition) return false;
      }

      // 3. Belt Filter
      if (selectedBelt !== 'all') {
        if (tech.belt_level && tech.belt_level.toLowerCase() !== selectedBelt.toLowerCase()) {
          return false;
        }
      }

      // 4. Gi/No-Gi Filter
      if (selectedGi !== 'all') {
        if (selectedGi === 'gi' && !tech.is_gi) return false;
        if (selectedGi === 'nogi' && !tech.is_nogi) return false;
      }

      return true;
    });
  }, [techniqueList, searchQuery, selectedCategory, selectedBelt, selectedGi]);

  const getCategoryStyles = (category: string, catId?: string) => {
    const c = (catId || category).toLowerCase();
    if (c.includes('submission') || c.includes('soumission') || c.includes('attaque')) {
      return {
        badge: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-[#ff453a]/15 dark:text-[#ff453a] dark:border-[#ff453a]/30',
        dot: 'bg-rose-500 dark:bg-[#ff453a]',
        label: 'Soumission',
        icon: Zap
      };
    }
    if (c.includes('sweep') || c.includes('renversement') || c.includes('balayage')) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#30d158]/15 dark:text-[#30d158] dark:border-[#30d158]/30',
        dot: 'bg-emerald-500 dark:bg-[#30d158]',
        label: 'Renversement',
        icon: RotateCcw
      };
    }
    if (c.includes('pass') || c.includes('sortie') || c.includes('défense') || c.includes('ouverture')) {
      return {
        badge: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-[#ffd60a]/15 dark:text-[#ffd60a] dark:border-[#ffd60a]/30',
        dot: 'bg-amber-500 dark:bg-[#ffd60a]',
        label: 'Sortie / Défense',
        icon: Shield
      };
    }
    return {
      badge: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-[#0a84ff]/15 dark:text-[#0a84ff] dark:border-[#0a84ff]/30',
      dot: 'bg-[#007aff] dark:bg-[#0a84ff]',
      label: 'Position / Contrôle',
      icon: Compass
    };
  };

  const getBeltColor = (belt?: string) => {
    switch (belt?.toLowerCase()) {
      case 'white': return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-white/20 dark:text-white dark:border-white/30';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-[#0a84ff]/20 dark:text-[#0a84ff] dark:border-[#0a84ff]/30';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-[#bf5af2]/20 dark:text-[#bf5af2] dark:border-[#bf5af2]/30';
      case 'brown': return 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-[#ac8e68]/20 dark:text-[#ac8e68] dark:border-[#ac8e68]/30';
      case 'black': return 'bg-slate-900 text-white border-slate-700 dark:bg-white/10 dark:text-white/90 dark:border-white/40';
      default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-white/70 dark:border-white/20';
    }
  };

  const getSystemForTech = (tech: Technique): string => {
    if (tech.system_tag) return tech.system_tag;
    const cat = (tech.category_id || tech.category).toLowerCase();
    if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) return 'guard_escapes_system';
    if (cat.includes('sweep') || cat.includes('renversement')) return 'sweeps_master_system';
    return 'closed_guard_system';
  };

  return (
    <div className="flex-1 flex flex-col pb-28 px-4 pt-2 max-w-[460px] mx-auto w-full">
      {/* Title Header */}
      <div className="flex items-center justify-between mt-2 mb-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#007aff] dark:text-[#0a84ff]" />
            Codex BJJ
          </h1>
          <p className="text-xs text-slate-500 dark:text-white/50">
            {filteredTechniques.length} sur {techniqueList.length} techniques répertoriées
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-white/70">
          Bibliothèque
        </div>
      </div>

      {/* Apple Search Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-white/40">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, détail, clé..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 text-sm rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
        <button
          onClick={() => {
            soundFX.playClick();
            setSelectedCategory('all');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
              : 'bg-white dark:bg-[#1c1c1e] text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
        >
          Toutes ({techniqueList.length})
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setSelectedCategory('defense');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'defense'
              ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
              : 'bg-white dark:bg-[#1c1c1e] text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
        >
          <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Sorties & Défenses</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setSelectedCategory('sweep');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'sweep'
              ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
              : 'bg-white dark:bg-[#1c1c1e] text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
        >
          <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Renversements</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setSelectedCategory('submission');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'submission'
              ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
              : 'bg-white dark:bg-[#1c1c1e] text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
        >
          <Zap className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Soumissions</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setSelectedCategory('position');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'position'
              ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
              : 'bg-white dark:bg-[#1c1c1e] text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
          }`}
        >
          <Compass className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>Positions</span>
        </button>
      </div>

      {/* Sub-Filters: Gi / No-Gi & Belt */}
      <div className="flex items-center justify-between gap-2 mb-4 text-[11px]">
        {/* Gi / No-Gi Toggle */}
        <div className="flex items-center bg-slate-200/80 dark:bg-[#1c1c1e] p-0.5 rounded-xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setSelectedGi('all')}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
              selectedGi === 'all' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-600 dark:text-white/50'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setSelectedGi('gi')}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
              selectedGi === 'gi' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-600 dark:text-white/50'
            }`}
          >
            Gi
          </button>
          <button
            onClick={() => setSelectedGi('nogi')}
            className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
              selectedGi === 'nogi' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-600 dark:text-white/50'
            }`}
          >
            No-Gi
          </button>
        </div>

        {/* Belt Level Filter Select */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#1c1c1e] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 shadow-xs">
          <span className="text-slate-400 dark:text-white/40 text-xs">Ceinture:</span>
          <select
            value={selectedBelt}
            onChange={(e) => setSelectedBelt(e.target.value as BeltFilter)}
            className="bg-transparent text-slate-900 dark:text-white font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">Toutes</option>
            <option value="White" className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">Blanche</option>
            <option value="Blue" className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">Bleue</option>
            <option value="Purple" className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">Violette</option>
            <option value="Brown" className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">Marron</option>
            <option value="Black" className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">Noire</option>
          </select>
        </div>
      </div>

      {/* Techniques List Cards */}
      {filteredTechniques.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#1c1c1e]/60 rounded-2xl border border-slate-200 dark:border-white/5 text-center my-6 shadow-xs">
          <Layers className="w-10 h-10 text-slate-400 dark:text-white/30 mb-3" />
          <p className="text-sm font-bold text-slate-800 dark:text-white/80">Aucune technique trouvée</p>
          <p className="text-xs text-slate-500 dark:text-white/40 mt-1 max-w-[240px]">
            Essayez de modifier votre recherche ou de réinitialiser les filtres.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedBelt('all');
              setSelectedGi('all');
            }}
            className="mt-4 px-3.5 py-1.5 bg-[#007aff] hover:bg-[#0062cc] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTechniques.map((tech) => {
            const styles = getCategoryStyles(tech.category, tech.category_id);
            const CategoryIcon = styles.icon;
            const reactionCount = tech.reactions?.length || 0;

            return (
              <div
                key={tech.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectTechnique(tech);
                }}
                className="group relative p-3.5 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 transition-all duration-200 cursor-pointer active:scale-[0.985] shadow-xs hover:shadow-sm"
              >
                {/* Header row: Category pill + Belt + Video tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${styles.badge}`}>
                      <CategoryIcon className="w-2.5 h-2.5" />
                      {styles.label}
                    </span>

                    {tech.belt_level && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getBeltColor(tech.belt_level)}`}>
                        {tech.belt_level === 'White' ? 'Blanche' :
                         tech.belt_level === 'Blue' ? 'Bleue' :
                         tech.belt_level === 'Purple' ? 'Violette' :
                         tech.belt_level === 'Brown' ? 'Marron' :
                         tech.belt_level === 'Black' ? 'Noire' : tech.belt_level}
                      </span>
                    )}

                    {!tech.is_nogi && tech.is_gi && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10 text-slate-500 dark:text-white/50 uppercase">
                        Gi Only
                      </span>
                    )}
                    {tech.is_nogi && !tech.is_gi && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10 text-slate-500 dark:text-white/50 uppercase">
                        No-Gi
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Mastery status badge */}
                    {progressMap && progressMap[tech.id] && progressMap[tech.id].status !== 'to_learn' && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        progressMap[tech.id].status === 'mastered'
                          ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-[#af52de]/20 dark:text-[#af52de] dark:border-[#af52de]/40'
                          : progressMap[tech.id].status === 'sparring_ready'
                          ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-[#0a84ff]/20 dark:text-[#0a84ff] dark:border-[#0a84ff]/40'
                          : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-[#ffd60a]/20 dark:text-[#ffd60a] dark:border-[#ffd60a]/40'
                      }`}>
                        {progressMap[tech.id].status === 'mastered' ? '🟣 Maîtrisé' :
                         progressMap[tech.id].status === 'sparring_ready' ? '🔵 Sparring' : '🟡 Drill'}
                      </span>
                    )}

                    {/* Video indicator badge */}
                    {tech.video_url && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 dark:bg-[#ff453a]/15 dark:text-[#ff453a] dark:border-[#ff453a]/30 text-[10px] font-semibold">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Vidéo
                      </div>
                    )}
                  </div>
                </div>

                {/* Technique Name */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#007aff] transition-colors leading-snug">
                    {tech.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-slate-700 dark:group-hover:text-white/70 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>

                {/* First Detail Snippet Preview */}
                {tech.details && tech.details.length > 0 && (
                  <p className="text-xs text-slate-600 dark:text-white/60 line-clamp-2 mt-1.5 leading-relaxed">
                    {tech.details[0]}
                  </p>
                )}

                {/* Footer: Reactions count + Direct GPS quick-launch */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-white/40">
                    <span className="font-semibold text-slate-700 dark:text-white/70">{reactionCount}</span>
                    <span>{reactionCount > 1 ? 'suites tactiques' : 'suite tactique'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFX.playRouteNav();
                        const sysId = getSystemForTech(tech);
                        onLaunchGPS(sysId, tech.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-[#0a84ff]/15 dark:hover:bg-[#0a84ff]/25 dark:text-[#0a84ff] dark:border-[#0a84ff]/30 text-[11px] font-semibold transition-all active:scale-95"
                    >
                      <Navigation className="w-3 h-3" />
                      GPS
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
