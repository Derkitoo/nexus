'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Plus, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  Calendar, 
  User, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Technique } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

export interface SparringEntry {
  id: string;
  date: string;
  partner: string;
  partnerBelt: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  techniqueSubmitted?: string;
  sweepLanded?: string;
  tapsConceded?: number;
  notes: string;
}

interface SparringJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  techniques: Record<string, Technique>;
}

export const SparringJournalModal: React.FC<SparringJournalModalProps> = ({
  isOpen,
  onClose,
  techniques,
}) => {
  const [entries, setEntries] = useState<SparringEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [partner, setPartner] = useState('');
  const [partnerBelt, setPartnerBelt] = useState<SparringEntry['partnerBelt']>('Blue');
  const [techniqueSubmitted, setTechniqueSubmitted] = useState('kimura');
  const [sweepLanded, setSweepLanded] = useState('hip_bump');
  const [notes, setNotes] = useState('');

  // Load entries
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bjj_sparring_journal');
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch {
          setEntries([]);
        }
      } else {
        // Initial sample entry for immediate visual pleasure
        const initialSample: SparringEntry[] = [
          {
            id: 'sample-1',
            date: 'Hier',
            partner: 'Lucas (Compétiteur)',
            partnerBelt: 'Purple',
            techniqueSubmitted: 'kimura',
            sweepLanded: 'hip_bump_from_kimura',
            tapsConceded: 1,
            notes: 'Enchaînement Kimura vers Hip bump passé à la perfection quand il a caché sa main sous la cuisse.'
          },
          {
            id: 'sample-2',
            date: 'Il y a 3 jours',
            partner: 'Marc',
            partnerBelt: 'Blue',
            techniqueSubmitted: 'triangle',
            sweepLanded: 'hip_bump',
            tapsConceded: 0,
            notes: 'Bonne ouverture de genoux contrée par Triangle propre.'
          }
        ];
        setEntries(initialSample);
        localStorage.setItem('bjj_sparring_journal', JSON.stringify(initialSample));
      }
    }
  }, []);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner.trim()) return;

    const newEntry: SparringEntry = {
      id: `entry-${Date.now()}`,
      date: "Aujourd'hui",
      partner,
      partnerBelt,
      techniqueSubmitted: techniqueSubmitted || undefined,
      sweepLanded: sweepLanded || undefined,
      notes,
    };

    const next = [newEntry, ...entries];
    setEntries(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bjj_sparring_journal', JSON.stringify(next));
    }

    soundFX.playSubmissionChime();
    setIsAdding(false);
    setPartner('');
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-spring-in">
      <div className="relative w-full max-w-lg bg-[#161618] border border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff453a]/20 border border-[#ff453a]/30 flex items-center justify-center text-[#ff453a]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">Journal de Sparring</h3>
              <p className="text-[10px] text-white/50">Statistiques &amp; Combats</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAdding && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsAdding(true);
                }}
                className="px-3 py-1 rounded-full bg-[#0a84ff] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Round</span>
              </button>
            )}
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
        </div>

        {/* Body */}
        <div className="overflow-y-auto py-3 space-y-3.5 flex-1 pr-0.5">
          {/* Summary Stats Pill (Apple Fitness Style) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="ios-card p-3 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Rounds</span>
              <span className="text-lg font-black text-white font-mono">{entries.length}</span>
            </div>
            <div className="ios-card p-3 text-center space-y-0.5 border border-[#ff453a]/30 bg-[#ff453a]/5">
              <span className="text-[10px] font-bold text-[#ff453a] uppercase tracking-wider block">Soumissions</span>
              <span className="text-lg font-black text-[#ff453a] font-mono">
                {entries.filter((e) => e.techniqueSubmitted).length}
              </span>
            </div>
            <div className="ios-card p-3 text-center space-y-0.5 border border-[#30d158]/30 bg-[#30d158]/5">
              <span className="text-[10px] font-bold text-[#30d158] uppercase tracking-wider block">Balayages</span>
              <span className="text-lg font-black text-[#30d158] font-mono">
                {entries.filter((e) => e.sweepLanded).length}
              </span>
            </div>
          </div>

          {/* New Round Form Drawer */}
          {isAdding ? (
            <form onSubmit={handleSaveEntry} className="ios-card p-4 space-y-3 border border-[#0a84ff]/40 bg-[#0a84ff]/5 animate-spring-in">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-xs font-bold text-white">Nouveau Round de Sparring</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-[11px] text-white/50 hover:text-white"
                >
                  Annuler
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                  Partenaire &amp; Niveau
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                    placeholder="Nom du partenaire..."
                    className="flex-1 bg-black/60 text-xs text-white placeholder-white/30 px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#0a84ff]"
                  />
                  <select
                    value={partnerBelt}
                    onChange={(e) => setPartnerBelt(e.target.value as SparringEntry['partnerBelt'])}
                    className="bg-black/60 text-xs text-white px-2 py-2 rounded-xl border border-white/10 focus:outline-none"
                  >
                    <option value="White">Blanche</option>
                    <option value="Blue">Bleue</option>
                    <option value="Purple">Violette</option>
                    <option value="Brown">Marron</option>
                    <option value="Black">Noire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                    Soumission Validée
                  </label>
                  <select
                    value={techniqueSubmitted}
                    onChange={(e) => setTechniqueSubmitted(e.target.value)}
                    className="w-full bg-black/60 text-xs text-white px-2 py-2 rounded-xl border border-white/10 focus:outline-none truncate"
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
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                    Balayage Réussi
                  </label>
                  <select
                    value={sweepLanded}
                    onChange={(e) => setSweepLanded(e.target.value)}
                    className="w-full bg-black/60 text-xs text-white px-2 py-2 rounded-xl border border-white/10 focus:outline-none truncate"
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

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                  Débrief &amp; Sensations
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Points à corriger, réactions de l'adversaire..."
                  className="w-full bg-black/60 text-xs text-white placeholder-white/30 p-2.5 rounded-xl border border-white/10 focus:outline-none resize-none h-16"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0a84ff] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Enregistrer le Round
              </button>
            </form>
          ) : null}

          {/* Entries Feed */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-1">
              Historique des Rounds ({entries.length})
            </span>

            {entries.map((entry) => (
              <div key={entry.id} className="ios-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {entry.partner.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-tight">{entry.partner}</span>
                      <span className="text-[10px] text-white/40">Ceinture {entry.partnerBelt} · {entry.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {entry.techniqueSubmitted && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#ff453a]/20 text-[#ff453a] border border-[#ff453a]/30">
                        {techniques[entry.techniqueSubmitted]?.name || entry.techniqueSubmitted}
                      </span>
                    )}
                    {entry.sweepLanded && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
                        {techniques[entry.sweepLanded]?.name || entry.sweepLanded}
                      </span>
                    )}
                  </div>
                </div>

                {entry.notes && (
                  <p className="text-xs text-white/70 bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed italic">
                    « {entry.notes} »
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="mt-2 w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all active:scale-95"
        >
          Fermer le Journal
        </button>
      </div>
    </div>
  );
};
