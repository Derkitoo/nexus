'use client';

import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Crosshair, 
  Compass, 
  Zap, 
  Shield, 
  RotateCcw, 
  Activity, 
  Navigation, 
  ChevronRight, 
  Info,
  Layers,
  ArrowUpRight,
  Target,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';
import { Technique } from '@/types/bjj';
import { computeTechniqueRadarData, RadarContactPoint, RadarReactionPoint } from '@/utils/radarBiomechanics';
import { soundFX } from '@/utils/audioFeedback';

interface TacticalRadarHUDProps {
  technique: Technique;
  allTechniques?: Record<string, Technique>;
  onSelectReaction?: (nextId: string) => void;
  compact?: boolean;
}

export const TacticalRadarHUD: React.FC<TacticalRadarHUDProps> = ({
  technique,
  allTechniques,
  onSelectReaction,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'levers' | 'reactions'>('radar');
  const [selectedPoint, setSelectedPoint] = useState<RadarContactPoint | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<RadarReactionPoint | null>(null);
  const [isSweepActive, setIsSweepActive] = useState(true);

  const radarData = useMemo(() => {
    return computeTechniqueRadarData(technique, allTechniques);
  }, [technique, allTechniques]);

  const { telemetry, contactPoints, reactionPoints } = radarData;

  // Compute SVG coordinates for vector arrow
  const vectorRad = (telemetry.angleDegrees - 90) * (Math.PI / 180);
  const vectorEndX = 50 + Math.cos(vectorRad) * 32;
  const vectorEndY = 50 + Math.sin(vectorRad) * 32;

  const handlePointClick = (pt: RadarContactPoint) => {
    soundFX.playClick();
    setSelectedReaction(null);
    setSelectedPoint(selectedPoint?.id === pt.id ? null : pt);
  };

  const handleReactionClick = (rp: RadarReactionPoint) => {
    soundFX.playClick();
    setSelectedPoint(null);
    setSelectedReaction(selectedReaction?.index === rp.index ? null : rp);
  };

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-slate-900 dark:bg-[#0b0f14] text-white border border-slate-700/80 dark:border-cyan-500/25 shadow-xl select-none">
      
      {/* 1. Radar Station Top Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/90 dark:bg-black/80 backdrop-blur-md border-b border-slate-800 dark:border-cyan-500/20 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="font-mono font-bold tracking-widest uppercase text-emerald-400 text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>RADAR TACTIQUE GPS</span>
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
            {telemetry.angleLabel}
          </span>
        </div>

        {/* View Modes */}
        <div className="flex items-center gap-1 bg-slate-800/80 dark:bg-white/5 p-0.5 rounded-lg border border-slate-700 dark:border-white/10 text-[10px]">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('radar');
            }}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              activeTab === 'radar' 
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scope 360°
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('levers');
            }}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              activeTab === 'levers' 
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Leviers ({contactPoints.length})
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('reactions');
            }}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'reactions' 
                ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Contres</span>
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[9px] flex items-center justify-center font-mono">
              {reactionPoints.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 360° RADAR SCOPE DISPLAY */}
      {activeTab === 'radar' && (
        <div className="relative p-3 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 dark:from-black dark:via-[#0b0f14] dark:to-black overflow-hidden">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

          {/* Compass Degrees & Bearings */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* SVG Scope Rings & Crosshairs */}
            <svg className="w-full h-full absolute inset-0 select-none pointer-events-none" viewBox="0 0 100 100">
              <defs>
                {/* Sonar sweep gradient */}
                <radialGradient id="radarGridGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="50" cy="50" r="48" fill="url(#radarGridGlow)" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="0.6" strokeDasharray="1 1" />
              {/* Range Circles */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="2 1.5" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="0.5" />

              {/* Crosshairs */}
              <line x1="50" y1="2" x2="50" y2="98" stroke="#38bdf8" strokeOpacity="0.2" strokeWidth="0.5" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="#38bdf8" strokeOpacity="0.2" strokeWidth="0.5" />

              {/* 45 Degree Diagonal Axes */}
              <line x1="16" y1="16" x2="84" y2="84" stroke="#38bdf8" strokeOpacity="0.1" strokeWidth="0.4" strokeDasharray="1 2" />
              <line x1="16" y1="84" x2="84" y2="16" stroke="#38bdf8" strokeOpacity="0.1" strokeWidth="0.4" strokeDasharray="1 2" />

              {/* Primary Attack Vector Arrow */}
              <line 
                x1="50" 
                y1="50" 
                x2={vectorEndX} 
                y2={vectorEndY} 
                stroke="#f43f5e" 
                strokeWidth="1.6" 
                strokeLinecap="round" 
                className="animate-pulse"
              />
              <circle cx={vectorEndX} cy={vectorEndY} r="1.8" fill="#f43f5e" />
            </svg>

            {/* Rotating Sonar Sweep Beam */}
            {isSweepActive && (
              <div 
                className="absolute inset-0 rounded-full pointer-events-none animate-spin" 
                style={{ 
                  animationDuration: '3.6s', 
                  animationTimingFunction: 'linear',
                  background: 'conic-gradient(from 0deg at 50% 50%, rgba(14, 165, 233, 0.28) 0deg, rgba(14, 165, 233, 0.05) 45deg, transparent 90deg, transparent 360deg)' 
                }} 
              />
            )}

            {/* Center Player/Tatami Node */}
            <div className="absolute z-10 w-9 h-9 rounded-full bg-slate-900/90 dark:bg-black/90 border border-cyan-400/60 shadow-[0_0_15px_rgba(14,165,233,0.5)] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Cardinal Direction Markers */}
            <span className="absolute top-1 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              N · Tête (0°)
            </span>
            <span className="absolute bottom-1 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              S · Base (180°)
            </span>
            <span className="absolute right-1 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              E (90°)
            </span>
            <span className="absolute left-1 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              W (270°)
            </span>

            {/* INTERACTIVE BIOMECHANICAL CONTACT POINTS (Radar Blips) */}
            {contactPoints.map((pt) => {
              const leftPercent = 50 + pt.x;
              const topPercent = 50 + pt.y;
              const isSelected = selectedPoint?.id === pt.id;

              let dotColor = 'bg-emerald-400 border-emerald-300 text-emerald-400';
              let pulseColor = 'bg-emerald-400/40';
              if (pt.type === 'vector') {
                dotColor = 'bg-rose-500 border-rose-300 text-rose-400';
                pulseColor = 'bg-rose-500/40';
              } else if (pt.type === 'pivot') {
                dotColor = 'bg-amber-400 border-amber-200 text-amber-300';
                pulseColor = 'bg-amber-400/40';
              } else if (pt.type === 'threat') {
                dotColor = 'bg-purple-400 border-purple-200 text-purple-300';
                pulseColor = 'bg-purple-400/40';
              }

              return (
                <button
                  key={pt.id}
                  onClick={() => handlePointClick(pt)}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                  title={`${pt.label} (${pt.type})`}
                >
                  <span className={`absolute -inset-1.5 rounded-full ${pulseColor} animate-ping opacity-75`} />
                  <div className={`relative w-4 h-4 rounded-full border-2 ${dotColor} flex items-center justify-center shadow-lg transition-transform ${isSelected ? 'scale-150 ring-2 ring-white' : 'hover:scale-125'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  
                  {/* Floating mini badge on hover or selection */}
                  {(isSelected || (!selectedPoint && !selectedReaction)) && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white border border-white/20 pointer-events-none shadow-md">
                      {pt.label}
                    </span>
                  )}
                </button>
              );
            })}

            {/* INTERACTIVE OPPONENT REACTION BLIPS (Peripheral Sector Pings) */}
            {reactionPoints.map((rp) => {
              const leftPercent = 50 + rp.x;
              const topPercent = 50 + rp.y;
              const isSelected = selectedReaction?.index === rp.index;

              return (
                <button
                  key={`reaction-${rp.index}`}
                  onClick={() => handleReactionClick(rp)}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-25 group cursor-pointer focus:outline-none"
                  title={`Détection : ${rp.condition}`}
                >
                  <span className="absolute -inset-1.5 rounded-full bg-[#0a84ff]/40 animate-ping opacity-75" />
                  <div className={`relative w-5 h-5 rounded-full bg-[#0a84ff] border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform ${isSelected ? 'scale-150 ring-2 ring-amber-400' : 'hover:scale-125'}`}>
                    <Zap className="w-2.5 h-2.5 fill-white" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Blip Detail Card (if clicked) */}
          {selectedPoint && (
            <div className="w-full mt-2 p-2.5 rounded-xl bg-slate-950/90 border border-cyan-400/40 animate-spring-in space-y-1 text-xs shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Point de Levier : {selectedPoint.label}
                </span>
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {selectedPoint.description}
              </p>
            </div>
          )}

          {/* Active Reaction Detail Card (if clicked) */}
          {selectedReaction && (
            <div className="w-full mt-2 p-2.5 rounded-xl bg-blue-950/90 border border-[#0a84ff]/50 animate-spring-in space-y-1.5 text-xs shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#64d2ff] font-mono text-[11px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Réaction Adverse Détectée
                </span>
                <button 
                  onClick={() => setSelectedReaction(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <p className="text-[11px] text-white font-medium">
                « {selectedReaction.condition} »
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 gap-2">
                <span className="text-[10px] text-slate-300 font-mono">
                  → Bascule vers : <strong className="text-white font-bold">{selectedReaction.targetName}</strong>
                </span>

                {onSelectReaction && (
                  <button
                    onClick={() => onSelectReaction(selectedReaction.nextId)}
                    className="px-2.5 py-1 rounded-lg bg-[#007aff] hover:bg-[#0062cc] text-white font-bold text-[10px] flex items-center gap-1 active:scale-95 shadow-xs"
                  >
                    <span>Naviguer (GPS)</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB 2: LEVERS & BIOMECHANICAL CONTACT POINTS LIST */}
      {activeTab === 'levers' && (
        <div className="p-3 space-y-2 bg-slate-950/70 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block px-1">
            Matrice des Points de Contact &amp; Leviers
          </span>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {contactPoints.map((pt) => (
              <div 
                key={pt.id}
                onClick={() => handlePointClick(pt)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedPoint?.id === pt.id
                    ? 'bg-cyan-950/60 border-cyan-400 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${pt.type === 'vector' ? 'bg-rose-500' : pt.type === 'pivot' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    {pt.label}
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {pt.type === 'vector' ? 'Vecteur Force' : pt.type === 'pivot' ? 'Point Pivot' : 'Ancrage'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: OPPONENT REACTION SENSOR DETECTIONS LIST */}
      {activeTab === 'reactions' && (
        <div className="p-3 space-y-2 bg-slate-950/70 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block px-1">
            Signatures Réactionnelles &amp; Contres GPS Détectés ({reactionPoints.length})
          </span>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {reactionPoints.length > 0 ? (
              reactionPoints.map((rp) => (
                <div 
                  key={rp.index}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#0a84ff]/50 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1">
                      <span className="text-[11px] font-bold text-white block leading-tight">
                        ⚡ {rp.condition}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono block">
                        Angle radar : {rp.angleDeg}° · Réponse : {rp.targetName}
                      </span>
                    </div>

                    {onSelectReaction && (
                      <button
                        onClick={() => onSelectReaction(rp.nextId)}
                        className="px-2.5 py-1 rounded-lg bg-[#007aff] hover:bg-[#0062cc] text-white font-bold text-[10px] flex items-center gap-1 active:scale-95 shrink-0 shadow-xs"
                      >
                        <span>GPS</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {rp.tacticalTip && (
                    <p className="text-[10px] text-slate-400 italic bg-black/40 p-1.5 rounded-lg border border-white/5">
                      Conseil : {rp.tacticalTip}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 font-mono text-xs">
                Aucune réaction adverse enregistrée pour ce nœud terminal.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Telemetry Gauges Footer Bar */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 border-t border-slate-800 text-center">
        <div className="p-1 rounded-lg bg-slate-900/80">
          <span className="text-[9px] uppercase font-mono text-slate-400 block truncate">Angle</span>
          <span className="text-xs font-black font-mono text-cyan-400 block">{telemetry.angleDegrees}°</span>
        </div>

        <div className="p-1 rounded-lg bg-slate-900/80">
          <span className="text-[9px] uppercase font-mono text-slate-400 block truncate">Pression</span>
          <span className="text-xs font-black font-mono text-rose-400 block">{telemetry.pressureScore}%</span>
        </div>

        <div className="p-1 rounded-lg bg-slate-900/80">
          <span className="text-[9px] uppercase font-mono text-slate-400 block truncate">Pivot</span>
          <span className="text-[10px] font-bold text-amber-300 block truncate" title={telemetry.fulcrum}>
            {telemetry.fulcrum}
          </span>
        </div>

        <div className="p-1 rounded-lg bg-slate-900/80">
          <span className="text-[9px] uppercase font-mono text-slate-400 block truncate">Tempo</span>
          <span className="text-[10px] font-bold text-emerald-400 block truncate" title={telemetry.tempo}>
            {telemetry.tempo.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};
