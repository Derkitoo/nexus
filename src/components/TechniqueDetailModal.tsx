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
  Circle
} from 'lucide-react';
import { Technique } from '@/types/bjj';
import { TechniqueVideoPreview } from './TechniqueVideoPreview';
import { soundFX } from '@/utils/audioFeedback';

interface TechniqueDetailModalProps {
  technique: Technique | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchInGPS: (techniqueId: string, systemTag?: string) => void;
}

export const TechniqueDetailModal: React.FC<TechniqueDetailModalProps> = ({
  technique,
  isOpen,
  onClose,
  onLaunchInGPS,
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="ios-card-interactive w-full max-w-lg bg-[#161618] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-spring-in">
        
        {/* Modal Header */}
        <div className="p-4 pb-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              Ceinture {technique.belt_level || 'Blanche'}
            </span>
            <span className="text-[10px] text-white/30">·</span>
            <span className="text-[10px] text-white/50">
              {technique.is_gi && technique.is_nogi ? 'Gi & No-Gi' : technique.is_gi ? 'Gi' : 'No-Gi'}
            </span>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          
          {/* Technique Title */}
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {technique.name}
            </h2>
          </div>

          {/* Video Preview / Radar Component */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            <TechniqueVideoPreview
              technique={technique}
              categoryBadgeColor={style.dot}
            />
          </div>

          {/* Key Checklist Steps */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
              Points Clés &amp; Exécution
            </span>
            <div className="space-y-1.5">
              {technique.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/8 text-xs text-white/90"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0a84ff]/20 text-[#0a84ff] border border-[#0a84ff]/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Advice */}
          {technique.troubleshooting && (
            <div className="p-3 rounded-2xl bg-[#ffd60a]/10 border border-[#ffd60a]/25 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#ffd60a]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Dépannage &amp; Pièges Courants</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed pl-5">
                {technique.troubleshooting}
              </p>
            </div>
          )}

          {/* Connected Reactions */}
          {reactions.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
                Enchaînements &amp; Réactions Recommandés ({reactions.length})
              </span>
              <div className="space-y-1.5">
                {reactions.map((r, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="text-white/90 font-medium block">
                        {r.condition}
                      </span>
                      {r.tacticalTip && (
                        <span className="text-[11px] text-[#0a84ff] font-medium block mt-0.5">
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
        <div className="p-3.5 border-t border-white/10 bg-[#1c1c1e]/90 backdrop-blur-md flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              soundFX.playRouteNav();
              onClose();
              onLaunchInGPS(technique.id, technique.system_tag);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#0a84ff] hover:bg-[#0071e3] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0a84ff]/30 transition-all"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Lancer dans le GPS Tactique</span>
          </button>
        </div>
      </div>
    </div>
  );
};
