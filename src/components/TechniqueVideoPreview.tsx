'use client';

import React, { useState } from 'react';
import { Activity, Eye, Play, Film, Radio, ExternalLink } from 'lucide-react';
import { Technique } from '@/types/bjj';

interface TechniqueVideoPreviewProps {
  technique: Technique;
  categoryBadgeColor: string;
}

export const TechniqueVideoPreview: React.FC<TechniqueVideoPreviewProps> = ({
  technique,
  categoryBadgeColor,
}) => {
  const [activeMode, setActiveMode] = useState<'video' | 'radar'>('video');
  const [tacticalOverlay, setTacticalOverlay] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isSubmission = technique.category_id === 'submission' || technique.category.toLowerCase().includes('soumission') || technique.category.toLowerCase().includes('attaque');
  const isSweep = technique.category_id === 'sweep' || technique.category.toLowerCase().includes('renversement');

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
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black group">
      {/* Top Header Mode Switcher (Video vs Radar) */}
      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 bg-black/75 backdrop-blur-md p-0.5 rounded-xl border border-white/15">
        <button
          onClick={() => setActiveMode('video')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
            activeMode === 'video'
              ? 'bg-[#0a84ff] text-white shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Film className="w-3 h-3" />
          <span>Vidéo</span>
        </button>
        <button
          onClick={() => setActiveMode('radar')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
            activeMode === 'radar'
              ? 'bg-[#2c2c2e] text-white shadow-xs'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Radio className="w-3 h-3 text-[#30d158]" />
          <span>Radar</span>
        </button>
      </div>

      {/* External YouTube Link Button */}
      <a
        href={directWatchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-[10px] font-bold text-white/80 hover:text-white hover:bg-white/15 transition-all shadow-sm"
        title="Ouvrir le tutoriel complet sur YouTube"
      >
        <Play className="w-3 h-3 text-[#ff453a] fill-[#ff453a]" />
        <span>YouTube</span>
        <ExternalLink className="w-2.5 h-2.5 text-white/50" />
      </a>

      {/* Video Content */}
      <div className="relative w-full h-48 sm:h-56 bg-black flex items-center justify-center overflow-hidden">
        {activeMode === 'video' ? (
          youtubeId ? (
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
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#1c1c1e] to-black">
              <div className="w-12 h-12 rounded-2xl bg-[#ff453a]/20 border border-[#ff453a]/40 flex items-center justify-center text-[#ff453a] mb-2 shadow-lg">
                <Play className="w-6 h-6 fill-[#ff453a]" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">
                Tutoriel vidéo BJJ : {technique.name}
              </h4>
              <p className="text-[10px] text-white/50 mb-3 max-w-xs">
                Visionnez la démonstration technique détaillée en direct sur YouTube.
              </p>
              <a
                href={youtubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-[#ff453a] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>Lancer la vidéo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )
        ) : (
          /* Tactical Martial Arts Visual Graphic Simulator */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#161618] via-black to-[#161618] relative p-3">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0a84ff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Target vector circles */}
            <div className="relative w-24 h-24 rounded-full border border-[#0a84ff]/30 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-t-2 border-[#0a84ff] animate-spin" style={{ animationDuration: '4s' }} />
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-[#1c1c1e]/80 backdrop-blur-sm">
                <Activity className={`w-7 h-7 ${isSubmission ? 'text-[#ff453a]' : isSweep ? 'text-[#30d158]' : 'text-[#0a84ff]'} animate-pulse`} />
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <p className="text-xs font-bold text-white tracking-wide">
                {technique.name}
              </p>
              <span className="text-[10px] text-white/50 font-mono">
                Visualisation Radar GPS · Angle &amp; Posture
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating HUD toggle (bottom right) */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20">
        <button
          onClick={() => setTacticalOverlay(!tacticalOverlay)}
          className={`p-1.5 rounded-xl border backdrop-blur-md transition-all active:scale-95 ${
            tacticalOverlay 
              ? 'bg-[#0a84ff] border-[#0a84ff] text-white' 
              : 'bg-black/60 border-white/15 text-white/60 hover:text-white'
          }`}
          title="Afficher / Masquer Radar HUD"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Optional Tactical HUD Overlay */}
      {tacticalOverlay && (
        <div className="absolute inset-0 pointer-events-none p-3 pt-12 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] text-white/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
              <span>RADAR TACTIQUE</span>
            </div>

            <div className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#0a84ff]">
              {technique.is_gi && technique.is_nogi ? 'GI & NO-GI' : technique.is_gi ? 'GI' : 'NO-GI'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-black/80 border border-white/15 text-white/90">
              {technique.belt_level || 'White'} Belt
            </span>
            <span className="text-white/60 bg-black/80 px-2 py-0.5 rounded border border-white/15">
              POINT CLÉ ANALYSÉ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
