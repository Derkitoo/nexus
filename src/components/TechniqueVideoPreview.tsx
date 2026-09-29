'use client';

import React, { useState } from 'react';
import { Play, Film, Radio, ExternalLink } from 'lucide-react';
import { Technique } from '@/types/bjj';
import { TacticalRadarHUD } from './TacticalRadarHUD';

interface TechniqueVideoPreviewProps {
  technique: Technique;
  categoryBadgeColor?: string;
  allTechniques?: Record<string, Technique>;
  onSelectReaction?: (nextId: string) => void;
  defaultMode?: 'video' | 'radar';
}

export const TechniqueVideoPreview: React.FC<TechniqueVideoPreviewProps> = ({
  technique,
  categoryBadgeColor,
  allTechniques,
  onSelectReaction,
  defaultMode = 'video',
}) => {
  const [activeMode, setActiveMode] = useState<'video' | 'radar'>(defaultMode);
  const [videoError, setVideoError] = useState(false);

  // Extract or build YouTube embed URL
  const youtubeId = technique.youtube_id || (
    technique.video_url?.includes('youtube.com') || technique.video_url?.includes('youtu.be')
      ? technique.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1]
      : null
  );

  const isDirectMp4 = technique.video_url?.endsWith('.mp4') || technique.video_url?.endsWith('.webm');
  const searchQuery = encodeURIComponent(`bjj technique ${technique.name}`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
  const directWatchUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : youtubeSearchUrl;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-black">
      {/* Top Header Mode Switcher (Video vs Radar) */}
      <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md p-0.5 rounded-xl border border-white/20">
        <button
          onClick={() => setActiveMode('video')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
            activeMode === 'video'
              ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white shadow-xs'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Film className="w-3 h-3" />
          <span>Vidéo</span>
        </button>
        <button
          onClick={() => setActiveMode('radar')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
            activeMode === 'radar'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>Radar Tactique</span>
        </button>
      </div>

      {/* External YouTube Link Button (only on Video mode) */}
      {activeMode === 'video' && (
        <a
          href={directWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-[10px] font-bold text-white/90 hover:text-white hover:bg-white/20 transition-all shadow-sm"
          title="Ouvrir le tutoriel complet sur YouTube"
        >
          <Play className="w-3 h-3 text-[#ff3b30] fill-[#ff3b30]" />
          <span>YouTube</span>
          <ExternalLink className="w-2.5 h-2.5 text-white/60" />
        </a>
      )}

      {/* Main Content: Video vs Tactical Radar */}
      <div className="w-full">
        {activeMode === 'video' ? (
          <div className="relative w-full h-56 sm:h-64 bg-black flex items-center justify-center overflow-hidden">
            {youtubeId ? (
              <iframe
                key={technique.id}
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&playsinline=1&modestbranding=1`}
                title={technique.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : isDirectMp4 && !videoError ? (
              <video
                key={technique.id}
                src={technique.video_url}
                className="w-full h-full object-cover filter contrast-[1.05] brightness-90"
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoError(true)}
              />
            ) : (
              /* Fallback Card with Direct Video Search link */
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-slate-900 to-black">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mb-2 shadow-lg">
                  <Play className="w-6 h-6 fill-rose-500" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">
                  Tutoriel vidéo : {technique.name}
                </h4>
                <p className="text-[10px] text-white/60 mb-3 max-w-xs">
                  Visionnez la démonstration technique détaillée en direct sur YouTube.
                </p>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#ff3b30] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>Lancer la vidéo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ) : (
          /* Real Full Interactive Tactical BJJ Radar Station */
          <div className="w-full pt-10">
            <TacticalRadarHUD
              technique={technique}
              allTechniques={allTechniques}
              onSelectReaction={onSelectReaction}
            />
          </div>
        )}
      </div>
    </div>
  );
};
