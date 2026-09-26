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
import { AppleTabBar, AppleTab } from '@/components/AppleTabBar';
import { INITIAL_TECHNIQUES, TACTICAL_SYSTEMS } from '@/data/bjjData';
import { Technique, TacticalSystem, UserProfile } from '@/types/bjj';
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

  // Dynamic systems and techniques registry
  const [systems, setSystems] = useState<TacticalSystem[]>(TACTICAL_SYSTEMS);
  const [techniques, setTechniques] = useState<Record<string, Technique>>(INITIAL_TECHNIQUES);

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
    <div className="flex-1 flex flex-col min-h-screen bg-black text-white relative">
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
        />
      )}

      {/* Tab 2: GPS Flow (Turn-by-turn Navigation) */}
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

      {/* Tab 4: Journal de Sparring & Stats */}
      {activeTab === 'journal' && (
        <SparringJournalView
          techniques={techniques}
          userProfile={userProfile}
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
    </div>
  );
}
