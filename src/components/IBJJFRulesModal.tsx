'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Scale, 
  Award 
} from 'lucide-react';
import { UserProfile } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface IBJJFRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBelt: UserProfile['belt'];
}

interface RuleItem {
  technique: string;
  category: 'Bras' | 'Jambes' | 'Cou / Étranglements' | 'Positions';
  giStatus: 'legal' | 'illegal' | 'condition';
  nogiStatus: 'legal' | 'illegal' | 'condition';
  note?: string;
}

const RULES_BY_BELT: Record<UserProfile['belt'], RuleItem[]> = {
  White: [
    { technique: 'Clé de bras droite (Armbar / Juji)', category: 'Bras', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Kimura & Americana', category: 'Bras', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Étranglements (Triangle, Guillotine, RNC)', category: 'Cou / Étranglements', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Straight Ankle Lock (Clé de cheville)', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal', note: 'Sans croiser le pied sur la hanche interne (Reaping interdit)' },
    { technique: 'Clé de poignet (Wristlock)', category: 'Bras', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Autorisé dès la ceinture Bleue' },
    { technique: 'Clé de genou (Kneebar)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Autorisé dès la ceinture Marron' },
    { technique: 'Clé de talon (Heel Hook)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Strictement interdit en IBJJF Gi' },
    { technique: 'Compression biceps / mollet (Slicers)', category: 'Bras', giStatus: 'illegal', nogiStatus: 'illegal' },
  ],
  Blue: [
    { technique: 'Clé de bras & Kimura', category: 'Bras', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Clé de poignet (Wristlock)', category: 'Bras', giStatus: 'legal', nogiStatus: 'legal', note: 'Officiellement autorisé à partir de la ceinture Bleue' },
    { technique: 'Straight Ankle Lock', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Clé de genou (Kneebar)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Réservé aux ceintures Marron et Noire' },
    { technique: 'Toe Hold (Clé de pied américaine)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal' },
    { technique: 'Clé de talon (Heel Hook)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal' },
    { technique: 'Saut en garde fermée (Flying Guard)', category: 'Positions', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Interdit pour sécurité des genoux' },
  ],
  Purple: [
    { technique: 'Toutes soumissions de Ceinture Bleue', category: 'Bras', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Clé de poignet & Étranglements complexes', category: 'Cou / Étranglements', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Straight Ankle Lock', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Kneebar & Toe Hold', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Autorisé à la prochaine ceinture (Marron)' },
    { technique: 'Biceps & Calf Slicers', category: 'Bras', giStatus: 'illegal', nogiStatus: 'illegal' },
    { technique: 'Heel Hook (No-Gi ADCC)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'legal', note: 'Légal dans les divisions intermédiaires ADCC No-Gi' },
  ],
  Brown: [
    { technique: 'Clé de genou (Kneebar)', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal', note: 'Nouveau : autorisé en IBJJF' },
    { technique: 'Toe Hold (Clé de pied en 4)', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal', note: 'Nouveau : autorisé en IBJJF' },
    { technique: 'Compression Mollet & Biceps (Slicers)', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal', note: 'Nouveau : autorisé en IBJJF' },
    { technique: 'Clé de talon (Heel Hook en Gi)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Interdit en Gi' },
    { technique: 'Heel Hook (No-Gi IBJJF & ADCC)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'legal', note: 'Autorisé en No-Gi IBJJF adulte Marron/Noire' },
  ],
  Black: [
    { technique: 'Arsenal Complet IBJJF (Kneebar, Toe Hold, Slicers)', category: 'Jambes', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Toutes clés de poignets, bras et étranglements', category: 'Bras', giStatus: 'legal', nogiStatus: 'legal' },
    { technique: 'Heel Hook & Knee Reaping (En Gi)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Toujours banni en Gi traditionnel' },
    { technique: 'Heel Hook & Knee Reaping (En No-Gi)', category: 'Jambes', giStatus: 'illegal', nogiStatus: 'legal', note: '100% légal en No-Gi professionnel' },
    { technique: 'Torsion cervicale sans étranglement (Neck Crank)', category: 'Cou / Étranglements', giStatus: 'illegal', nogiStatus: 'illegal', note: 'Interdit en IBJJF' },
  ]
};

export const IBJJFRulesModal: React.FC<IBJJFRulesModalProps> = ({
  isOpen,
  onClose,
  userBelt,
}) => {
  const [selectedBelt, setSelectedBelt] = useState<UserProfile['belt']>(userBelt);
  const [modeFilter, setModeFilter] = useState<'all' | 'gi' | 'nogi'>('all');

  if (!isOpen) return null;

  const rules = RULES_BY_BELT[selectedBelt] || RULES_BY_BELT.Blue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-spring-in select-none">
      <div className="relative w-full max-w-lg bg-[#161618] border border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#bf5af2]/20 border border-[#bf5af2]/30 flex items-center justify-center text-[#bf5af2]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">Règles &amp; Soumissions IBJJF</h3>
              <p className="text-[10px] text-white/50">Légalité officielle en compétition</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Belt Switcher Bar */}
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/10">
          {(['White', 'Blue', 'Purple', 'Brown', 'Black'] as Array<UserProfile['belt']>).map((b) => (
            <button
              key={b}
              onClick={() => {
                soundFX.playClick();
                setSelectedBelt(b);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedBelt === b
                  ? 'bg-[#0a84ff] text-white shadow-md'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              Ceinture {b}
            </button>
          ))}
        </div>

        {/* Gi / No-Gi Filter */}
        <div className="flex bg-[#1c1c1e] p-1 rounded-xl border border-white/10 my-2">
          {(['all', 'gi', 'nogi'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                soundFX.playClick();
                setModeFilter(m);
              }}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                modeFilter === m ? 'bg-[#2c2c2e] text-white shadow-xs' : 'text-white/40 hover:text-white'
              }`}
            >
              {m === 'all' ? 'Gi & No-Gi' : m === 'gi' ? 'Gi Uniquement' : 'No-Gi Uniquement'}
            </button>
          ))}
        </div>

        {/* Rules List */}
        <div className="overflow-y-auto py-2 space-y-2 flex-1 pr-1">
          {rules.map((rule, idx) => {
            const isGiLegal = rule.giStatus === 'legal';
            const isNoGiLegal = rule.nogiStatus === 'legal';

            if (modeFilter === 'gi' && !isGiLegal && rule.giStatus === 'illegal') {
              // keep to show illegal icon
            }

            return (
              <div key={idx} className="ios-card p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-tight">
                    {rule.technique}
                  </span>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {(modeFilter === 'all' || modeFilter === 'gi') && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border ${
                        isGiLegal 
                          ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30' 
                          : 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/30'
                      }`}>
                        {isGiLegal ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>GI</span>
                      </span>
                    )}

                    {(modeFilter === 'all' || modeFilter === 'nogi') && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border ${
                        isNoGiLegal 
                          ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30' 
                          : 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/30'
                      }`}>
                        {isNoGiLegal ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>NO-GI</span>
                      </span>
                    )}
                  </div>
                </div>

                {rule.note && (
                  <p className="text-[11px] text-white/50 pl-0.5 leading-tight">
                    ⚠️ {rule.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="mt-2 w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all active:scale-95"
        >
          Fermer l&apos;Aide-Mémoire
        </button>
      </div>
    </div>
  );
};
