'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Plus, 
  Award, 
  CheckCircle2, 
  Calendar, 
  User, 
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { Technique, UserProfile } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

export interface SparringEntry {
  id: string;
  date: string;
  partner: string;
  partnerBelt: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  techniqueSubmitted?: string;
  sweepLanded?: string;
  notes: string;
}

interface SparringJournalViewProps {
  techniques: Record<string, Technique>;
  userProfile: UserProfile;
}

export const SparringJournalView: React.FC<SparringJournalViewProps> = ({
  techniques,
  userProfile,
}) => {
  const [entries, setEntries] = useState<SparringEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [partner, setPartner] = useState('');
  const [partnerBelt, setPartnerBelt] = useState<SparringEntry['partnerBelt']>('Blue');
  const [techniqueSubmitted, setTechniqueSubmitted] = useState('kimura');
  const [sweepLanded, setSweepLanded] = useState('hip_bump');
  const [notes, setNotes] = useState('');

  // Load entries from localStorage
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
        const initialSample: SparringEntry[] = [
          {
            id: 'sample-1',
            date: 'Hier',
            partner: 'Lucas (Compétiteur)',
            partnerBelt: 'Purple',
            techniqueSubmitted: 'kimura',
            sweepLanded: 'hip_bump_from_kimura',
            notes: 'Enchaînement Kimura vers Hip bump passé à la perfection quand il a caché sa main sous la cuisse.'
          },
          {
            id: 'sample-2',
            date: 'Il y a 3 jours',
            partner: 'Marc',
            partnerBelt: 'Blue',
            techniqueSubmitted: 'triangle',
            sweepLanded: 'hip_bump',
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

  const totalSubs = entries.filter((e) => e.techniqueSubmitted).length;
  const totalSweeps = entries.filter((e) => e.sweepLanded).length;

  return (
    <div className="flex-1 flex flex-col p-4 pb-28 space-y-4 animate-spring-in max-w-md mx-auto w-full">
      {/* iOS Large Title Header */}
      <div className="pt-2 px-1 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
            Suivi des Combats
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Journal de Sparring
          </h1>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            setIsAdding(!isAdding);
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#0a84ff] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Round</span>
        </button>
      </div>

      {/* Apple Fitness Activity Summary Rings/Pills */}
      <div className="grid grid-cols-3 gap-2">
        <div className="ios-card p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Rounds</span>
          <span className="text-xl font-black text-white font-mono">{entries.length}</span>
        </div>
        <div className="ios-card p-3 text-center space-y-0.5 border border-[#ff453a]/30 bg-[#ff453a]/5">
          <span className="text-[10px] font-bold text-[#ff453a] uppercase tracking-wider block">Soumissions</span>
          <span className="text-xl font-black text-[#ff453a] font-mono">{totalSubs}</span>
        </div>
        <div className="ios-card p-3 text-center space-y-0.5 border border-[#30d158]/30 bg-[#30d158]/5">
          <span className="text-[10px] font-bold text-[#30d158] uppercase tracking-wider block">Balayages</span>
          <span className="text-xl font-black text-[#30d158] font-mono">{totalSweeps}</span>
        </div>
      </div>

      {/* Add Entry Form Drawer */}
      {isAdding && (
        <form onSubmit={handleSaveEntry} className="ios-card p-4 space-y-3 border border-[#0a84ff]/40 bg-[#0a84ff]/5 animate-spring-in">
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-xs font-bold text-white">Consigner un Round de Sparring</span>
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
              Partenaire &amp; Grade
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                placeholder="Prénom du partenaire..."
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
              Débrief &amp; Analyse
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Réactions de l'adversaire, ouvertures trouvées..."
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
      )}

      {/* Entries List */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-1">
          Historique des Sessions ({entries.length})
        </span>

        {entries.map((entry) => (
          <div key={entry.id} className="ios-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {entry.partner.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{entry.partner}</span>
                  <span className="text-[10px] text-white/40">Ceinture {entry.partnerBelt} · {entry.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap justify-end">
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
              <p className="text-xs text-white/80 bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed italic">
                « {entry.notes} »
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
