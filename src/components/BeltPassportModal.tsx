'use client';

import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  Plus, 
  Minus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { UserProfile } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

interface BeltPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

const BELT_ORDER: Array<UserProfile['belt']> = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

const BELT_DATA: Record<UserProfile['belt'], { 
  nameFr: string; 
  bg: string; 
  accent: string; 
  description: string;
  requirements: string[];
}> = {
  White: {
    nameFr: 'Ceinture Blanche',
    bg: 'bg-white',
    accent: '#ffffff',
    description: 'Fondations, survie, posture et défense dans les positions majeures.',
    requirements: [
      'Garder la posture dans la garde fermée',
      'Sortie de garde aux coudes et aux genoux',
      'Maîtrise de la Kimura et du Triangle de base',
      'Échappement de la position montée (Upa / Hip Escape)'
    ]
  },
  Blue: {
    nameFr: 'Ceinture Bleue',
    bg: 'bg-[#0a84ff]',
    accent: '#0a84ff',
    description: 'Développement du jeu technique, fluidité des transitions et garde ouverte.',
    requirements: [
      'Attaques combinées : enchaînements Kimura / Hip Bump / Triangle',
      'Passages de garde dynamiques (Torreando, Knee Slice)',
      'Contrôle et finalisation depuis le dos (Seatbelt & RNC)',
      'Défense et posture face aux clés de chevilles (Straight Ankle Lock)'
    ]
  },
  Purple: {
    nameFr: 'Ceinture Violette',
    bg: 'bg-[#bf5af2]',
    accent: '#bf5af2',
    description: 'Maîtrise du tempo, anticipation, jeu offensif en jambes et inversions.',
    requirements: [
      'Système Ashi Garami et Outside Heel Hook sécurisés',
      'Attaques d’inversions complexes (Omoplata, Berimbolo)',
      'Rétention de garde proactive et transitions sans temps mort',
      'Capacité à guider et corriger les ceintures blanches et bleues'
    ]
  },
  Brown: {
    nameFr: 'Ceinture Marron',
    bg: 'bg-[#a2845e]',
    accent: '#a2845e',
    description: 'Raffinements millimétriques, finitions chirurgicales et pression écrasante.',
    requirements: [
      'Toutes soumissions autorisées en No-Gi et IBJJF',
      'Création et adaptation instantanée des flux tactiques',
      'Gestion infatigable des rounds de sparring intensifs',
      'Perfectionnement de la pression en contrôle latéral'
    ]
  },
  Black: {
    nameFr: 'Ceinture Noire',
    bg: 'bg-[#1c1c1e] border-2 border-[#ff453a]',
    accent: '#ff453a',
    description: 'Nouveau départ : le Jiu-Jitsu devient une seconde nature.',
    requirements: [
      'Maîtrise technique et philosophique globale',
      'Transmission et pédagogie approfondie',
      'Simplicité et efficacité absolue avec un minimum d’effort physique',
      'Engagement à vie sur la voie du Jiu-Jitsu'
    ]
  }
};

export const BeltPassportModal: React.FC<BeltPassportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [celebrating, setCelebrating] = useState(false);

  if (!isOpen) return null;

  const currentBeltInfo = BELT_DATA[userProfile.belt];
  const beltIdx = BELT_ORDER.indexOf(userProfile.belt);

  const handleAddStripe = () => {
    if (userProfile.stripes < 4) {
      soundFX.playSubmissionChime();
      onUpdateProfile({ stripes: userProfile.stripes + 1 });
    }
  };

  const handleRemoveStripe = () => {
    if (userProfile.stripes > 0) {
      soundFX.playClick();
      onUpdateProfile({ stripes: userProfile.stripes - 1 });
    }
  };

  const handlePromoteBelt = () => {
    if (beltIdx < BELT_ORDER.length - 1) {
      const nextBelt = BELT_ORDER[beltIdx + 1];
      soundFX.playSubmissionChime();
      onUpdateProfile({ belt: nextBelt, stripes: 0 });
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-spring-in select-none">
      <div className="relative w-full max-w-md bg-[#161618] border border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0a84ff]/20 border border-[#0a84ff]/30 flex items-center justify-center text-[#0a84ff]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">Passeport BJJ</h3>
              <p className="text-[10px] text-white/50">Progression &amp; Ceinture</p>
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

        {/* Content */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1 pr-0.5">
          {/* Authentic BJJ Belt Visual Card (Apple Wallet Style) */}
          <div className="relative overflow-hidden rounded-2xl p-4 border border-white/15 bg-gradient-to-br from-black/80 to-[#1c1c1e] shadow-xl">
            {celebrating && (
              <div className="absolute inset-0 bg-[#0a84ff]/20 backdrop-blur-xs flex items-center justify-center z-20 animate-spring-in">
                <span className="text-sm font-black text-white px-4 py-2 rounded-full bg-[#0a84ff] shadow-xl flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Promotion Validée !
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Grade Actuel
              </span>
              <span className="text-xs font-bold text-white/80">
                {userProfile.stripes} barrettes
              </span>
            </div>

            {/* The Visual Belt Render */}
            <div className={`w-full h-8 rounded-md ${currentBeltInfo.bg} flex items-center justify-end overflow-hidden shadow-lg border border-black/40 relative`}>
              {/* Black Rank Sleeve on right side */}
              <div className="w-16 h-full bg-black flex items-center justify-around px-1.5 border-l border-black/20">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-[3px] h-full rounded-xs transition-all ${
                      i < userProfile.stripes ? 'bg-white shadow-xs' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Belt Details */}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-white">
                  {currentBeltInfo.nameFr}
                </h4>
                <p className="text-[11px] text-white/50 mt-0.5">
                  {currentBeltInfo.description}
                </p>
              </div>
            </div>

            {/* Barrettes / Stripes Control */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/70">
                Ajuster les barrettes :
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveStripe}
                  disabled={userProfile.stripes <= 0}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold text-white w-4 text-center">
                  {userProfile.stripes}
                </span>
                <button
                  onClick={handleAddStripe}
                  disabled={userProfile.stripes >= 4}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center transition-all active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Promotion Button if 4 stripes reached or ready */}
          {beltIdx < BELT_ORDER.length - 1 && (
            <button
              onClick={handlePromoteBelt}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Promouvoir à la {BELT_DATA[BELT_ORDER[beltIdx + 1]].nameFr}</span>
            </button>
          )}

          {/* Belt Requirements Checklist */}
          <div className="ios-card p-4 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0a84ff]" />
              Compétences clés du grade
            </span>

            <div className="space-y-2 pt-1">
              {currentBeltInfo.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#30d158] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="ios-card p-3 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Drills Réussis</span>
              <span className="text-lg font-black text-[#0a84ff] font-mono">{userProfile.drillsCompleted}</span>
            </div>
            <div className="ios-card p-3 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Système Favori</span>
              <span className="text-xs font-bold text-white truncate block">{userProfile.favoriteSystem}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="mt-2 w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all active:scale-95"
        >
          Fermer le Passeport
        </button>
      </div>
    </div>
  );
};
