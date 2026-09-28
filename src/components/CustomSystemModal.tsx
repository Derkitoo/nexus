'use client';

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  GitCommit, 
  Check, 
  Layers, 
  Shield, 
  Zap, 
  CornerDownRight 
} from 'lucide-react';
import { TacticalSystem, Technique } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface CustomSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomSystem: (system: TacticalSystem, rootTechnique: Technique) => void;
}

export const CustomSystemModal: React.FC<CustomSystemModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomSystem,
}) => {
  const [systemName, setSystemName] = useState('');
  const [systemDesc, setSystemDesc] = useState('');
  const [category, setCategory] = useState('Garde Ouverte');
  const [difficulty, setDifficulty] = useState<TacticalSystem['difficulty']>('Intermédiaire');
  const [isGi, setIsGi] = useState(true);
  const [isNoGi, setIsNoGi] = useState(true);

  // Root technique
  const [rootTechName, setRootTechName] = useState('');
  const [detail1, setDetail1] = useState('');
  const [detail2, setDetail2] = useState('');
  const [troubleshooting, setTroubleshooting] = useState('');

  // Reactions
  const [reaction1Cond, setReaction1Cond] = useState('');
  const [reaction1Next, setReaction1Next] = useState('kimura');
  const [reaction2Cond, setReaction2Cond] = useState('');
  const [reaction2Next, setReaction2Next] = useState('triangle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemName.trim() || !rootTechName.trim()) return;

    const systemId = `custom_${Date.now()}`;
    const rootTechId = `tech_${Date.now()}`;

    const newSystem: TacticalSystem = {
      id: systemId,
      name: systemName,
      rootTechniqueId: rootTechId,
      description: systemDesc || 'Système tactique personnalisé créé par le combattant.',
      category,
      is_gi: isGi,
      is_nogi: isNoGi,
      difficulty,
      belt_level: 'Blue',
      nodeCount: 3,
      featuredBadge: 'Flow Combattant',
      iconName: 'Compass'
    };

    const newRootTech: Technique = {
      id: rootTechId,
      name: rootTechName,
      category: 'Position Initiale',
      category_id: 'position',
      details: [
        detail1.trim() || 'Prendre les prises de contrôle fondamentales',
        detail2.trim() || 'Briser la posture et verrouiller la distance',
      ],
      troubleshooting: troubleshooting.trim() || "Si l'adversaire tente d'ouvrir, réajuster immédiatement.",
      is_gi: isGi,
      is_nogi: isNoGi,
      belt_level: 'Blue',
      system_tag: systemId,
      reactions: [
        {
          condition: reaction1Cond.trim() || "Il pose une main au sol",
          nextId: reaction1Next,
          tacticalTip: "Opportunité directe"
        },
        {
          condition: reaction2Cond.trim() || "Il se redresse violemment",
          nextId: reaction2Next,
          tacticalTip: "Exploiter son élan"
        }
      ]
    };

    soundFX.playSubmissionChime();
    onSaveCustomSystem(newSystem, newRootTech);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-spring-in select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-[#30d158]/20 border border-emerald-200 dark:border-[#30d158]/30 flex items-center justify-center text-emerald-600 dark:text-[#30d158]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Nouveau Flow Tactique</h3>
              <p className="text-[10px] text-slate-500 dark:text-white/50">Créer un itinéraire personnalisé</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-3 space-y-4 flex-1 pr-1">
          {/* System Info */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-3.5 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
              1. Identité du Système
            </span>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-white/60 block mb-1">Nom du Système :</label>
              <input
                type="text"
                required
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="Ex : Système De La Riva, Papillon..."
                className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] shadow-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-white/60 block mb-1">Description / Objectif :</label>
              <input
                type="text"
                value={systemDesc}
                onChange={(e) => setSystemDesc(e.target.value)}
                placeholder="Objectif tactique (ex: déséquilibre et prise de dos)..."
                className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/50 block mb-1">Niveau :</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as TacticalSystem['difficulty'])}
                  className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white px-2 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none shadow-xs cursor-pointer"
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-white font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGi}
                    onChange={(e) => setIsGi(e.target.checked)}
                    className="rounded accent-[#007aff]"
                  />
                  <span>Gi</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-white font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNoGi}
                    onChange={(e) => setIsNoGi(e.target.checked)}
                    className="rounded accent-[#007aff]"
                  />
                  <span>No-Gi</span>
                </label>
              </div>
            </div>
          </div>

          {/* Root Technique */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-3.5 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
              2. Position Initiale du Flow
            </span>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-white/60 block mb-1">Nom de la Position de Départ :</label>
              <input
                type="text"
                required
                value={rootTechName}
                onChange={(e) => setRootTechName(e.target.value)}
                placeholder="Ex : Garde De La Riva (Crochet externe)..."
                className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#007aff] shadow-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-white/60 block">Points clés d&apos;exécution :</label>
              <input
                type="text"
                value={detail1}
                onChange={(e) => setDetail1(e.target.value)}
                placeholder="Point clé 1 : Crochet actif sur la cuisse..."
                className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none shadow-xs"
              />
              <input
                type="text"
                value={detail2}
                onChange={(e) => setDetail2(e.target.value)}
                placeholder="Point clé 2 : Contrôle manche et cheville..."
                className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-white/60 block mb-1">Dépannage / Contre de l&apos;adversaire :</label>
              <input
                type="text"
                value={troubleshooting}
                onChange={(e) => setTroubleshooting(e.target.value)}
                placeholder="S'il écrase le crochet, commuter vers..."
                className="w-full bg-white dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Action / Reactions Branches */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-3.5 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 block">
              3. Branchements Action-Réaction
            </span>

            {/* Branch 1 */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold text-[#007aff] dark:text-[#0a84ff] uppercase">Réaction 1 :</span>
              <input
                type="text"
                value={reaction1Cond}
                onChange={(e) => setReaction1Cond(e.target.value)}
                placeholder="Que fait l'adversaire ? (ex: Il pose une main au sol)"
                className="w-full bg-slate-50 dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none"
              />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-white/40 text-[10px] font-medium">Transition vers :</span>
                <select
                  value={reaction1Next}
                  onChange={(e) => setReaction1Next(e.target.value)}
                  className="bg-slate-50 dark:bg-black/80 text-xs text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none cursor-pointer"
                >
                  <option value="back_take">Prise de Dos (Back Take)</option>
                  <option value="kimura">Tentative de Kimura</option>
                  <option value="triangle">Triangle</option>
                  <option value="hip_bump">Hip Bump Sweep</option>
                </select>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-[#30d158] uppercase">Réaction 2 :</span>
              <input
                type="text"
                value={reaction2Cond}
                onChange={(e) => setReaction2Cond(e.target.value)}
                placeholder="Que fait l'adversaire ? (ex: Il se redresse violemment)"
                className="w-full bg-slate-50 dark:bg-black/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none"
              />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-white/40 text-[10px] font-medium">Transition vers :</span>
                <select
                  value={reaction2Next}
                  onChange={(e) => setReaction2Next(e.target.value)}
                  className="bg-slate-50 dark:bg-black/80 text-xs text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none cursor-pointer"
                >
                  <option value="triangle">Triangle</option>
                  <option value="armbar">Armbar</option>
                  <option value="omoplata">Omoplata</option>
                  <option value="straight_ankle_lock">Clé de cheville</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#007aff] hover:bg-[#0062cc] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
          >
            Enregistrer et Publier l&apos;Itinéraire
          </button>
        </form>
      </div>
    </div>
  );
};
