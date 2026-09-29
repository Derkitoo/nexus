import { Technique, OpponentReaction } from '@/types/bjj';

export interface RadarContactPoint {
  id: string;
  label: string;
  x: number; // percentage from center (-50 to 50)
  y: number; // percentage from center (-50 to 50)
  type: 'anchor' | 'vector' | 'pivot' | 'threat';
  description: string;
}

export interface RadarReactionPoint {
  index: number;
  condition: string;
  nextId: string;
  targetName: string;
  tacticalTip?: string;
  angleDeg: number;
  x: number; // percentage from center (-50 to 50)
  y: number;
}

export interface RadarTelemetry {
  angleDegrees: number;
  angleLabel: string;
  primaryVector: string;
  fulcrum: string;
  weightDistribution: string;
  pressureScore: number;
  tempo: 'Explosif (< 1.5s)' | 'Lourd & Continu' | 'Opportuniste / Réactif';
  categoryLabel: string;
}

export interface TechniqueRadarData {
  telemetry: RadarTelemetry;
  contactPoints: RadarContactPoint[];
  reactionPoints: RadarReactionPoint[];
}

export function computeTechniqueRadarData(
  technique: Technique,
  allTechniques?: Record<string, Technique>
): TechniqueRadarData {
  const name = technique.name.toLowerCase();
  const id = technique.id.toLowerCase();
  const cat = (technique.category_id || technique.category || '').toLowerCase();

  const isSub = cat.includes('submission') || cat.includes('soumission') || cat.includes('attaque');
  const isSweep = cat.includes('sweep') || cat.includes('renversement') || cat.includes('balayage');
  const isPass = cat.includes('pass') || cat.includes('sortie') || cat.includes('défense') || cat.includes('ouverture');

  let angleDegrees = 0;
  let angleLabel = '0° (Axe Frontal)';
  let primaryVector = 'Contrôle axial et maintien de la distance';
  let fulcrum = 'Bassin & Hanches';
  let weightDistribution = '50% Hanches / 50% Haut du corps';
  let pressureScore = 70;
  let tempo: RadarTelemetry['tempo'] = 'Lourd & Continu';

  let contactPoints: RadarContactPoint[] = [];

  // 1. SPECIFIC SUBMISSIONS
  if (name.includes('kimura')) {
    angleDegrees = 45;
    angleLabel = '45° (Diagonale Flanc)';
    primaryVector = 'Torsion de l\'épaule vers la nuque & élévation du coude';
    fulcrum = 'Aisselle adverse & Prise en 4';
    weightDistribution = '70% Décentré Flanc / 30% Appui Sol';
    pressureScore = 92;
    tempo = 'Explosif (< 1.5s)';

    contactPoints = [
      { id: 'p1', label: 'Poignet adverse (Main 1)', x: 18, y: -22, type: 'anchor', description: 'Verrouillé au sol ou plaqué contre le torse' },
      { id: 'p2', label: 'Clé en 4 (Main 2)', x: 28, y: -15, type: 'pivot', description: 'Prise de pouce fermée autour de son propre poignet' },
      { id: 'p3', label: 'Levier de l\'épaule', x: 22, y: -38, type: 'vector', description: 'Rotation du bras vers le haut du dos adverse' },
      { id: 'p4', label: 'Blocage Hanche', x: -15, y: 15, type: 'threat', description: 'Cuisse fermée pour empêcher la roulade de secours' }
    ];
  } else if (name.includes('triangle')) {
    angleDegrees = 90;
    angleLabel = '90° (Angle Perpendiculaire)';
    primaryVector = 'Compression carotide : jambe + épaule adverse';
    fulcrum = 'Creux poplité sous la cheville';
    weightDistribution = '80% Hanches / 20% Nuque';
    pressureScore = 96;
    tempo = 'Explosif (< 1.5s)';

    contactPoints = [
      { id: 'p1', label: 'Nuque & Carotide', x: 0, y: -25, type: 'vector', description: 'Tibia plaqué perpendiculairement sur la nuque' },
      { id: 'p2', label: 'Bras isolé dans l\'axe', x: -16, y: -10, type: 'anchor', description: 'Tiré à travers la ligne médiane' },
      { id: 'p3', label: 'Verrouillage en 4', x: 20, y: -20, type: 'pivot', description: 'Genou fléchi sur la cheville opposée' },
      { id: 'p4', label: 'Coupure d\'Angle', x: -30, y: 5, type: 'threat', description: 'Prise sous le jarret adverse pour pivoter à 90°' }
    ];
  } else if (name.includes('guillotine')) {
    angleDegrees = 0;
    angleLabel = '0° (Axe Sagittal)';
    primaryVector = 'Traction axiale du menton & hyperextension';
    fulcrum = 'Radius sous la trachée & sternum';
    weightDistribution = '60% Dorsaux / 40% Hanches';
    pressureScore = 94;
    tempo = 'Explosif (< 1.5s)';

    contactPoints = [
      { id: 'p1', label: 'Radius menton', x: 0, y: -28, type: 'vector', description: 'Poignet relevé vers l\'épaule opposée' },
      { id: 'p2', label: 'Prise en mentonnière', x: 10, y: -24, type: 'anchor', description: 'Verrouillée en paume à paume' },
      { id: 'p3', label: 'Garde fermée haute', x: 0, y: 22, type: 'pivot', description: 'Pousser avec les hanches vers le haut' }
    ];
  } else if (name.includes('armbar') || name.includes('clé de bras')) {
    angleDegrees = 90;
    angleLabel = '90° (Perpendiculaire)';
    primaryVector = 'Hyperextension du coude contre l\'os pubien';
    fulcrum = 'Crête iliaque / Os pubien';
    weightDistribution = '85% Bassin / 15% Épaules';
    pressureScore = 95;
    tempo = 'Lourd & Continu';

    contactPoints = [
      { id: 'p1', label: 'Poignet adverse (2 mains)', x: 0, y: -35, type: 'anchor', description: 'Pouce orienté vers le plafond' },
      { id: 'p2', label: 'Pivot pubien (Coude)', x: 0, y: 0, type: 'pivot', description: 'Collé au plus près du sternum adverse' },
      { id: 'p3', label: 'Jambe sur le visage', x: -18, y: -18, type: 'vector', description: 'Empêche l\'adversaire de s\'asseoir' },
      { id: 'p4', label: 'Pincement des genoux', x: 18, y: -18, type: 'threat', description: 'Isole complètement le bras' }
    ];
  } else if (name.includes('omoplata')) {
    angleDegrees = 120;
    angleLabel = '120° (Rotation Dorsale)';
    primaryVector = 'Hyperextension et rotation de la coiffe des rotateurs';
    fulcrum = 'Creux du genou sur l\'épaule';
    weightDistribution = '75% Poids sur l\'omoplate adverse';
    pressureScore = 88;
    tempo = 'Lourd & Continu';

    contactPoints = [
      { id: 'p1', label: 'Épaule isolée', x: 20, y: -10, type: 'pivot', description: 'Plaquée au sol par la cuisse' },
      { id: 'p2', label: 'Ceinture / Hanches', x: -22, y: 20, type: 'anchor', description: 'Main bloque le bassin pour stopper la roulade' },
      { id: 'p3', label: 'Buste relevé', x: 28, y: 15, type: 'vector', description: 'S\'asseoir vers l\'avant pour accentuer la torsion' }
    ];
  } else if (name.includes('heel hook') || name.includes('cheville') || name.includes('ankle') || name.includes('leg lock')) {
    angleDegrees = 195;
    angleLabel = '195° (Axe Inférieur & Talon)';
    primaryVector = 'Torsion du talon contre le genou verrouillé en Ashi';
    fulcrum = 'Aisselle & Coudes serrés';
    weightDistribution = '90% Contrôle de hanche / Genou en étau';
    pressureScore = 98;
    tempo = 'Explosif (< 1.5s)';

    contactPoints = [
      { id: 'p1', label: 'Pied sous aisselle', x: -8, y: 26, type: 'anchor', description: 'Talon exposé et crocheté au poignet' },
      { id: 'p2', label: 'Pince Ashi Garami', x: 15, y: 12, type: 'pivot', description: 'Pied extérieur sur la hanche, pied intérieur sous le fessier' },
      { id: 'p3', label: 'Vecteur de rotation', x: -22, y: 32, type: 'vector', description: 'Pontage des hanches avec rotation du buste' }
    ];
  }
  // 2. SWEEPS / RENVERSEMENTS
  else if (isSweep) {
    angleDegrees = name.includes('hip bump') ? 45 : name.includes('ciseaux') ? 90 : 135;
    angleLabel = `${angleDegrees}° (Angle de Bascule)`;
    primaryVector = 'Déplacement du centre de gravité adverse au-delà de sa base';
    fulcrum = 'Coude au sol & Extension du bassin';
    weightDistribution = '60% Impulsion / 40% Blocage de poste';
    pressureScore = 82;
    tempo = 'Explosif (< 1.5s)';

    contactPoints = [
      { id: 'p1', label: 'Point de Poste bloqué', x: 22, y: -18, type: 'anchor', description: 'Empêche l\'adversaire de poser sa main en appui' },
      { id: 'p2', label: 'Impulsion de Hanche', x: 0, y: 8, type: 'vector', description: 'Bassin projeté en oblique vers le haut' },
      { id: 'p3', label: 'Appui Coude / Main', x: -24, y: -5, type: 'pivot', description: 'Point d\'élévation principal du tronc' }
    ];
  }
  // 3. PASSAGES DE GARDE & DEFENSE
  else if (isPass) {
    angleDegrees = 30;
    angleLabel = '30° (Angle de Contournement)';
    primaryVector = 'Pression diagonale et dépassement de la ligne des genoux';
    fulcrum = 'Contrôle des bas de pantalon / Hanche adverse';
    weightDistribution = '75% Poids vers l\'avant / 25% Mobilité';
    pressureScore = 80;
    tempo = 'Lourd & Continu';

    contactPoints = [
      { id: 'p1', label: 'Verrou Genoux / Pantalon', x: 20, y: 10, type: 'anchor', description: 'Contrôle bilatéral pour neutraliser les crochets' },
      { id: 'p2', label: 'Pression Sternum / Épaule', x: 0, y: -22, type: 'vector', description: 'Écrase le cadre adverse vers le sol' },
      { id: 'p3', label: 'Cercle de hanche', x: -28, y: 0, type: 'pivot', description: 'Enjamber les jambes pour sécuriser le contrôle latéral' }
    ];
  }
  // 4. POSITIONS INITIALES (Garde Fermée, etc.)
  else {
    angleDegrees = 0;
    angleLabel = '0° (Contrôle Médian)';
    primaryVector = 'Rupture de posture continue et contrôle de distance';
    fulcrum = 'Verrouillage des chevilles derrière le dos';
    weightDistribution = '50% Dos au sol / 50% Traction des cuisses';
    pressureScore = 75;
    tempo = 'Opportuniste / Réactif';

    contactPoints = [
      { id: 'p1', label: 'Contrôle Nuque / Col', x: 0, y: -26, type: 'vector', description: 'Tirer l\'adversaire vers son torse pour casser l\'érection' },
      { id: 'p2', label: 'Contrôle Poignets / Triceps', x: 20, y: -12, type: 'anchor', description: 'Empêche l\'ouverture des coudes' },
      { id: 'p3', label: 'Verrouillage Chevilles', x: 0, y: 25, type: 'pivot', description: 'Fermé haut au-dessus des crêtes iliaques' },
      { id: 'p4', label: 'Traction des Genoux', x: -15, y: 10, type: 'threat', description: 'Casse la base adverse à chaque tentative de redressement' }
    ];
  }

  // REACTION BLIPS: map all technique reactions onto the radar perimeter
  const reactions = technique.reactions || [];
  const reactionPoints: RadarReactionPoint[] = reactions.map((r, i) => {
    // Distribute angles evenly around radar or based on specific reactions
    const step = 360 / Math.max(1, reactions.length);
    const angle = (i * step + 30) % 360;
    const rad = (angle - 90) * (Math.PI / 180);
    // Outer perimeter ring: radius ~38%
    const radius = 38;
    const x = Math.round(Math.cos(rad) * radius);
    const y = Math.round(Math.sin(rad) * radius);

    const targetTech = allTechniques ? allTechniques[r.nextId] : null;
    const targetName = targetTech ? targetTech.name : r.nextId;

    return {
      index: i,
      condition: r.condition,
      nextId: r.nextId,
      targetName,
      tacticalTip: r.tacticalTip,
      angleDeg: angle,
      x,
      y
    };
  });

  return {
    telemetry: {
      angleDegrees,
      angleLabel,
      primaryVector,
      fulcrum,
      weightDistribution,
      pressureScore,
      tempo,
      categoryLabel: technique.category
    },
    contactPoints,
    reactionPoints
  };
}
