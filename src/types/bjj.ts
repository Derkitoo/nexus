export type CategoryType = 'position' | 'submission' | 'sweep' | 'pass';

export interface Category {
  id: string;
  name: string;
  description: string;
  badge_color: 'blue' | 'red' | 'emerald' | 'amber';
}

export interface OpponentReaction {
  condition: string;
  nextId: string;
  tacticalTip?: string;
}

export interface Technique {
  id: string;
  name: string;
  category: string; // 'Position Initiale' | 'Attaque / Soumission' | 'Renversement / Balayage'
  category_id?: CategoryType;
  details: string[];
  troubleshooting?: string;
  video_url?: string;
  youtube_id?: string;
  is_gi: boolean;
  is_nogi: boolean;
  belt_level?: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  system_tag?: string; // 'closed_guard' | 'ashi_garami' | 'half_guard'
  reactions: OpponentReaction[];
}

export interface TacticalSystem {
  id: string;
  name: string;
  rootTechniqueId: string;
  description: string;
  category: string;
  is_gi: boolean;
  is_nogi: boolean;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  belt_level: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  nodeCount: number;
  featuredBadge?: string;
  iconName: string;
}

export interface UserProfile {
  name: string;
  belt: 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';
  stripes: number;
  drillsCompleted: number;
  favoriteSystem: string;
}

export type MasteryStatus = 'to_learn' | 'drilling' | 'sparring_ready' | 'mastered';

export interface TechniqueProgress {
  techniqueId: string;
  status: MasteryStatus;
  drillReps: number;
  sparringSuccessCount: number;
  notes?: string;
  lastPracticed?: string;
}

export type TrainingType = 'gi' | 'nogi' | 'open_mat' | 'drills' | 'competition';
export type TrainingIntensity = 'light' | 'moderate' | 'hard' | 'extreme';

export interface TrainingSession {
  id: string;
  date: string;
  trainingType: TrainingType;
  durationMinutes: number;
  roundsCount: number;
  intensity: TrainingIntensity;
  techniquesWorked: string[];
  partnerNotes?: string;
  sparringNotes?: string;
  submissionsLanded?: string[];
  sweepsLanded?: string[];
}

