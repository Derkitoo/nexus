'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  HardDrive,
  FileJson
} from 'lucide-react';
import { soundFX } from '@/utils/audioFeedback';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onRestoreSuccess,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export all localStorage keys
  const handleExport = () => {
    if (typeof window === 'undefined') return;

    soundFX.playClick();
    const backupData: Record<string, unknown> = {};
    const keys = [
      'bjj_user_profile',
      'bjj_custom_systems',
      'bjj_custom_techniques',
      'bjj_sparring_journal',
      'bjj_favorites',
    ];

    keys.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val) {
        try {
          backupData[k] = JSON.parse(val);
        } catch {
          backupData[k] = val;
        }
      }
    });

    // Also collect all coach notes (bjj_note_*) and checklist mastery (bjj_checks_*)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('bjj_note_') || key.startsWith('bjj_checks_'))) {
        backupData[key] = localStorage.getItem(key);
      }
    }

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bjj-nexus-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    soundFX.playSubmissionChime();
    setStatusMessage('Export réussi ! Fichier de sauvegarde téléchargé.');
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        Object.entries(data).forEach(([key, val]) => {
          if (typeof val === 'object') {
            localStorage.setItem(key, JSON.stringify(val));
          } else {
            localStorage.setItem(key, String(val));
          }
        });

        soundFX.playSubmissionChime();
        setStatusMessage('Restauration réussie avec succès !');
        setTimeout(() => {
          onRestoreSuccess();
          onClose();
        }, 1500);
      } catch {
        setStatusMessage('Erreur : le fichier JSON est corrompu ou invalide.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-spring-in select-none">
      <div className="relative w-full max-w-sm bg-[#161618] border border-white/12 rounded-[32px] p-5 shadow-2xl flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0a84ff]/20 border border-[#0a84ff]/30 flex items-center justify-center text-[#0a84ff]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white leading-tight">Sauvegarde &amp; Export</h3>
              <p className="text-[10px] text-white/50">Synchronisation des données</p>
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

        {statusMessage && (
          <div className="p-3 rounded-2xl bg-[#30d158]/15 border border-[#30d158]/30 text-xs text-[#30d158] font-bold text-center animate-spring-in flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Export Card */}
        <div className="ios-card p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-white">
            <Download className="w-4 h-4 text-[#0a84ff]" />
            <span className="text-xs font-bold">Exporter vos données (Backup)</span>
          </div>
          <p className="text-[11px] text-white/50">
            Téléchargez un fichier JSON contenant votre journal de combat, vos notes de coach et vos itinéraires personnalisés.
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl bg-[#0a84ff] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Télécharger la Sauvegarde</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="ios-card p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-white">
            <Upload className="w-4 h-4 text-[#30d158]" />
            <span className="text-xs font-bold">Restaurer une sauvegarde</span>
          </div>
          <p className="text-[11px] text-white/50">
            Importez un fichier JSON précédemment exporté pour récupérer vos données sur ce navigateur.
          </p>
          <label className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-white/10">
            <Upload className="w-3.5 h-3.5" />
            <span>Sélectionner le fichier JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="mt-1 w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all active:scale-95"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
