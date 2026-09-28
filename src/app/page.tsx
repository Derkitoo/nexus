'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { GPSView } from '@/components/GPSView';
import { ReflexDrillView } from '@/components/ReflexDrillView';
import { SparringJournalView } from '@/components/SparringJournalView';
import { FlowGraphModal } from '@/components/FlowGraphModal';
import { BeltPassportModal } from '@/components/BeltPassportModal';
import { CustomSystemModal } from '@/components/CustomSystemModal';
import { SparringTimerModal } from '@/components/SparringTimerModal';
import { IBJJFRulesModal } from '@/components/IBJJFRulesModal';
import { BackupModal } from '@/components/BackupModal';
import { TechniqueListView } from '@/components/TechniqueListView';
import { TechniqueDetailModal } from '@/components/TechniqueDetailModal';
import { AppleTabBar, AppleTab } from '@/components/AppleTabBar';
import { INITIAL_TECHNIQUES, TACTICAL_SYSTEMS } from '@/data/bjjData';
import { Technique, TacticalSystem, UserProfile, TechniqueProgress, MasteryStatus } from '@/types/bjj';
import { soundFX } from '@/utils/audioFeedback';

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppleTab>('explore');
  const [currentSystemId, setCurrentSystemId] = useState<string>('closed_guard_system');
  const [currentTechniqueId, setCurrentTechniqueId] = useState<string>('closed_guard');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['closed_guard']);
  
  // Modals state
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isCustomSystemOpen, setIsCustomSystemOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [selectedTechniqueForModal, setSelectedTechniqueForModal] = useState<Technique | null>(null);
  const [isTechniqueModalOpen, setIsTechniqueModalOpen] = useState(false);

  // Dynamic systems and techniques registry
  const [systems, setSystems] = useState<TacticalSystem[]>(TACTICAL_SYSTEMS);
  const [techniques, setTechniques] = useState<Record<string, Technique>>(INITIAL_TECHNIQUES);
  
  // Technique progress tracking state
  const [techniqueProgress, setTechniqueProgress] = useState<Record<string, TechniqueProgress>>({});

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alexandre Silva',
    belt: 'Blue',
    stripes: 2,
    drillsCompleted: 34,
    favoriteSystem: 'Système Garde Fermée'
  });

  // Load custom systems & profile from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('bjj_user_profile');
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch {}
      }

      const savedCustomSystems = localStorage.getItem('bjj_custom_systems');
      if (savedCustomSystems) {
        try {
          const parsed = JSON.parse(savedCustomSystems);
          setSystems([...TACTICAL_SYSTEMS, ...parsed]);
        } catch {}
      }

      const savedCustomTechniques = localStorage.getItem('bjj_custom_techniques');
      if (savedCustomTechniques) {
        try {
          const parsed = JSON.parse(savedCustomTechniques);
          setTechniques((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }

      const savedProgress = localStorage.getItem('bjj_technique_progress');
      if (savedProgress) {
        try {
          setTechniqueProgress(JSON.parse(savedProgress));
        } catch {}
      } else {
        const initialSampleProgress: Record<string, TechniqueProgress> = {
          closed_guard: { techniqueId: 'closed_guard', status: 'mastered', drillReps: 60, sparringSuccessCount: 18, notes: 'Bien casser la posture avec les genoux' },
          kimura: { techniqueId: 'kimura', status: 'mastered', drillReps: 45, sparringSuccessCount: 12, notes: 'Verrouiller la prise en 4' },
          hip_bump: { techniqueId: 'hip_bump', status: 'mastered', drillReps: 50, sparringSuccessCount: 14, notes: 'Ouvrir sur le coude droit' },
          triangle: { techniqueId: 'triangle', status: 'sparring_ready', drillReps: 35, sparringSuccessCount: 8, notes: 'Angle à 90 degrés' },
          armbar: { techniqueId: 'armbar', status: 'sparring_ready', drillReps: 30, sparringSuccessCount: 6 },
          omoplata: { techniqueId: 'omoplata', status: 'drilling', drillReps: 20, sparringSuccessCount: 2 },
          guard_pass_torreando: { techniqueId: 'guard_pass_torreando', status: 'sparring_ready', drillReps: 40, sparringSuccessCount: 9 },
          guard_pass_knee_slice: { techniqueId: 'guard_pass_knee_slice', status: 'drilling', drillReps: 25, sparringSuccessCount: 3 },
          single_leg_x: { techniqueId: 'single_leg_x', status: 'drilling', drillReps: 15, sparringSuccessCount: 1 },
          straight_ankle_lock: { techniqueId: 'straight_ankle_lock', status: 'drilling', drillReps: 20, sparringSuccessCount: 2 },
        };
        setTechniqueProgress(initialSampleProgress);
        localStorage.setItem('bjj_technique_progress', JSON.stringify(initialSampleProgress));
      }
    }
  }, []);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bjj_user_profile', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleUpdateTechniqueStatus = (techId: string, status: MasteryStatus) => {
    setTechniqueProgress((prev) => {
      const existing = prev[techId] || {
        techniqueId: techId,
        status: 'to_learn',
        drillReps: 0,
        sparringSuccessCount: 0,
      };
      const next = {
        ...prev,
        [techId]: {
          ...existing,
          status,
          lastPracticed: new Date().toISOString(),
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bjj_technique_progress', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleUpdateTechniqueReps = (techId: string, deltaDrill: number, deltaSparring: number) => {
    setTechniqueProgress((prev) => {
      const existing = prev[techId] || {
        techniqueId: techId,
        status: 'to_learn',
        drillReps: 0,
        sparringSuccessCount: 0,
      };
      const nextDrill = Math.max(0, (existing.drillReps || 0) + deltaDrill);
      const nextSparring = Math.max(0, (existing.sparringSuccessCount || 0) + deltaSparring);
      let nextStatus = existing.status;
      if (nextSparring >= 5 && existing.status !== 'mastered') {
        nextStatus = 'sparring_ready';
      }
      const next = {
        ...prev,
        [techId]: {
          ...existing,
          status: nextStatus,
          drillReps: nextDrill,
          sparringSuccessCount: nextSparring,
          lastPracticed: new Date().toISOString(),
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bjj_technique_progress', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleUpdateTechniqueNotes = (techId: string, notes: string) => {
    setTechniqueProgress((prev) => {
      const existing = prev[techId] || {
        techniqueId: techId,
        status: 'to_learn',
        drillReps: 0,
        sparringSuccessCount: 0,
      };
      const next = {
        ...prev,
        [techId]: {
          ...existing,
          notes,
          lastPracticed: new Date().toISOString(),
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bjj_technique_progress', JSON.stringify(next));
      }
      return next;
    });
  };

  const currentSystem: TacticalSystem = 
    systems.find((s) => s.id === currentSystemId) || systems[0];

  const currentTechnique: Technique = 
    techniques[currentTechniqueId] || techniques['closed_guard'];

  // Handlers
  const handleLaunchGPS = (systemId: string, startingTechniqueId?: string) => {
    const sys = systems.find((s) => s.id === systemId) || systems[0];
    const rootId = startingTechniqueId || sys.rootTechniqueId;
    setCurrentSystemId(sys.id);
    setCurrentTechniqueId(rootId);
    setBreadcrumbs([rootId]);
    setActiveTab('gps');
    soundFX.playRouteNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTechniqueModal = (tech: Technique) => {
    setSelectedTechniqueForModal(tech);
    setIsTechniqueModalOpen(true);
  };

  const handleLaunchInGPSFromModal = (techId: string, systemTag?: string) => {
    setIsTechniqueModalOpen(false);
    let sysId = systemTag;
    if (!sysId) {
      const tech = techniques[techId];
      const cat = (tech?.category_id || tech?.category || '').toLowerCase();
      if (cat.includes('pass') || cat.includes('sortie') || cat.includes('défense')) {
        sysId = 'guard_escapes_system';
      } else if (cat.includes('sweep') || cat.includes('renversement')) {
        sysId = 'sweeps_master_system';
      } else {
        sysId = 'closed_guard_system';
      }
    }
    handleLaunchGPS(sysId, techId);
  };

  const handleLaunchDrill = () => {
    soundFX.playClick();
    setActiveTab('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReaction = (nextId: string) => {
    if (!techniques[nextId]) return;

    setCurrentTechniqueId(nextId);
    setBreadcrumbs((prev) => [...prev, nextId]);

    const nextTech = techniques[nextId];
    if (nextTech.category_id === 'submission' || nextTech.category_id === 'sweep') {
      handleUpdateProfile({ drillsCompleted: userProfile.drillsCompleted + 1 });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBreadcrumb = (index: number) => {
    if (index < 0 || index >= breadcrumbs.length) return;
    const targetId = breadcrumbs[index];
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setCurrentTechniqueId(targetId);
    setBreadcrumbs(newBreadcrumbs);
  };

  const handleUndo = () => {
    if (breadcrumbs.length <= 1) return;
    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    const previousId = newBreadcrumbs[newBreadcrumbs.length - 1];
    setCurrentTechniqueId(previousId);
    setBreadcrumbs(newBreadcrumbs);
  };

  const handleReset = () => {
    const rootId = currentSystem.rootTechniqueId;
    setCurrentTechniqueId(rootId);
    setBreadcrumbs([rootId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: AppleTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCustomSystem = (newSystem: TacticalSystem, newRootTechnique: Technique) => {
    setSystems((prev) => {
      const next = [...prev, newSystem];
      if (typeof window !== 'undefined') {
        const customOnly = next.filter((s) => s.id.startsWith('custom_'));
        localStorage.setItem('bjj_custom_systems', JSON.stringify(customOnly));
      }
      return next;
    });

    setTechniques((prev) => {
      const next = { ...prev, [newRootTechnique.id]: newRootTechnique };
      if (typeof window !== 'undefined') {
        const customOnlyTechs: Record<string, Technique> = {};
        Object.values(next).forEach((t) => {
          if (t.id.startsWith('tech_')) customOnlyTechs[t.id] = t;
        });
        localStorage.setItem('bjj_custom_techniques', JSON.stringify(customOnlyTechs));
      }
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      {/* iOS Top Bar (sur Itinéraires, Fight IQ et Journal) */}
      {activeTab !== 'gps' && (
        <Header
          userProfile={userProfile}
          onUpdateBelt={(belt) => handleUpdateProfile({ belt })}
          onOpenPassport={() => setIsPassportOpen(true)}
          onOpenTimer={() => setIsTimerOpen(true)}
        />
      )}

      {/* Tab 1: Itinéraires BJJ */}
      {activeTab === 'explore' && (
        <DashboardView
          systems={systems}
          techniques={techniques}
          userProfile={userProfile}
          onLaunchGPS={handleLaunchGPS}
          onLaunchDrill={handleLaunchDrill}
          onOpenCustomModal={() => setIsCustomSystemOpen(true)}
          onOpenTimer={() => setIsTimerOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
          onOpenPassport={() => setIsPassportOpen(true)}
          progressMap={techniqueProgress}
          onNavigateToTab={handleTabChange}
        />
      )}

      {/* Tab 2: Codex & Techniques Catalog (Vue Liste Complète) */}
      {activeTab === 'techniques' && (
        <TechniqueListView
          techniques={techniques}
          onSelectTechnique={handleOpenTechniqueModal}
          onLaunchGPS={handleLaunchGPS}
          progressMap={techniqueProgress}
        />
      )}

      {/* Tab 3: GPS Flow (Turn-by-turn Navigation) */}
      {activeTab === 'gps' && (
        <GPSView
          system={currentSystem}
          currentTechnique={currentTechnique}
          allTechniques={techniques}
          breadcrumbs={breadcrumbs}
          onSelectReaction={handleSelectReaction}
          onNavigateBreadcrumb={handleNavigateBreadcrumb}
          onUndo={handleUndo}
          onReset={handleReset}
          onBackToDashboard={handleBackToDashboard}
          onOpenFlowModal={() => setIsFlowModalOpen(true)}
        />
      )}

      {/* Tab 3: Fight IQ (Reflex Drills) */}
      {activeTab === 'drill' && (
        <div className="flex-1 flex flex-col pb-24">
          <ReflexDrillView
            onFinishDrill={(pts) => 
              handleUpdateProfile({ drillsCompleted: userProfile.drillsCompleted + Math.max(1, Math.round(pts / 200)) })
            }
          />
        </div>
      )}

      {/* Tab 4: Suivi d'Entraînement & Progression Technique */}
      {activeTab === 'journal' && (
        <SparringJournalView
          techniques={techniques}
          userProfile={userProfile}
          progressMap={techniqueProgress}
          onUpdateStatus={handleUpdateTechniqueStatus}
          onUpdateReps={handleUpdateTechniqueReps}
          onUpdateNotes={handleUpdateTechniqueNotes}
          onSelectTechnique={handleOpenTechniqueModal}
          onLaunchGPS={handleLaunchGPS}
        />
      )}

      {/* Apple iOS Native UITabBar */}
      <AppleTabBar
        currentTab={activeTab}
        onChangeTab={handleTabChange}
        isGPSActive={breadcrumbs.length > 0}
      />

      {/* Apple Modal Cartographie Réseau */}
      <FlowGraphModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
        techniques={techniques}
        currentTechniqueId={currentTechniqueId}
        onSelectTechnique={(id) => {
          setCurrentTechniqueId(id);
          setBreadcrumbs((prev) => [...prev, id]);
          setActiveTab('gps');
        }}
        systemName={currentSystem.name}
      />

      {/* Passeport BJJ & Progression Ceinture Modal */}
      <BeltPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Créateur d'Itinéraire Tactique Custom */}
      <CustomSystemModal
        isOpen={isCustomSystemOpen}
        onClose={() => setIsCustomSystemOpen(false)}
        onSaveCustomSystem={handleSaveCustomSystem}
      />

      {/* Chronomètre de Sparring IBJJF */}
      <SparringTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        userBelt={userProfile.belt}
      />

      {/* Aide-Mémoire & Règles de Soumission IBJJF */}
      <IBJJFRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        userBelt={userProfile.belt}
      />

      {/* Sauvegarde & Restauration JSON */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onRestoreSuccess={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />

      {/* Fiche Technique Complète Apple Modal */}
      <TechniqueDetailModal
        technique={selectedTechniqueForModal}
        isOpen={isTechniqueModalOpen}
        onClose={() => setIsTechniqueModalOpen(false)}
        onLaunchInGPS={handleLaunchInGPSFromModal}
        progressMap={techniqueProgress}
        onUpdateStatus={handleUpdateTechniqueStatus}
        onUpdateReps={handleUpdateTechniqueReps}
      />
    </div>
  );
}
