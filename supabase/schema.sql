-- ==========================================================
-- BJJ Nexus - Tactical GPS
-- PostgreSQL / Supabase Schema & Initial Data
-- ==========================================================

-- 1. Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    badge_color TEXT DEFAULT 'blue', -- 'blue' (position), 'red' (submission), 'emerald' (sweep), 'amber' (defense)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Techniques table
CREATE TABLE IF NOT EXISTS techniques (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    details_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    troubleshooting TEXT,
    video_url TEXT,
    is_gi BOOLEAN DEFAULT true,
    is_nogi BOOLEAN DEFAULT true,
    belt_level TEXT DEFAULT 'White', -- 'White', 'Blue', 'Purple', 'Brown', 'Black'
    system_tag TEXT DEFAULT 'closed_guard', -- e.g. 'closed_guard', 'ashi_garami', 'half_guard'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Transitions table (The Tactical GPS Flow Graph)
CREATE TABLE IF NOT EXISTS transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initial_technique_id TEXT NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    opponent_reaction TEXT NOT NULL,
    target_technique_id TEXT NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    tactical_tip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transitions_initial ON transitions(initial_technique_id);
CREATE INDEX IF NOT EXISTS idx_transitions_target ON transitions(target_technique_id);
CREATE INDEX IF NOT EXISTS idx_techniques_category ON techniques(category_id);
CREATE INDEX IF NOT EXISTS idx_techniques_system ON techniques(system_tag);

-- Enable Row Level Security (RLS) & allow public read access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE transitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read techniques" ON techniques FOR SELECT USING (true);
CREATE POLICY "Allow public read transitions" ON transitions FOR SELECT USING (true);

-- ==========================================================
-- SEED DATA: Categories
-- ==========================================================
INSERT INTO categories (id, name, description, badge_color) VALUES
('position', 'Position Initiale', 'Position de contrôle ou garde fondamentale', 'blue'),
('submission', 'Attaque / Soumission', 'Finalisation articulaire ou étranglement', 'red'),
('sweep', 'Renversement / Balayage', 'Inversion de posture pour passer dessus', 'emerald'),
('pass', 'Passage de Garde', 'Neutralisation et dépassement des jambes adverses', 'amber')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    badge_color = EXCLUDED.badge_color;

-- ==========================================================
-- SEED DATA: Techniques
-- ==========================================================
INSERT INTO techniques (id, name, category_id, details_json, troubleshooting, video_url, is_gi, is_nogi, belt_level, system_tag) VALUES
(
    'closed_guard',
    'Garde Fermée (Dessous)',
    'position',
    '["Garder les chevilles croisées", "Contrôler les manches ou poignets", "Briser la posture avec les genoux ramenés vers soi"]'::jsonb,
    'S''il se lève, ouvrez la garde immédiatement pour suivre ses hanches ou attaquer les jambes.',
    'https://assets.mixkit.co/videos/preview/mixkit-martial-arts-training-in-a-dojo-42841-large.mp4',
    true, true, 'White', 'closed_guard'
),
(
    'kimura',
    'Tentative de Kimura',
    'submission',
    '["Décroiser les jambes", "S''asseoir en diagonale vers l''épaule ciblée", "Saisir son propre poignet en prise en 4 (figure four)"]'::jsonb,
    'S''il raidit le bras ou cache sa main sous sa cuisse, basculez sans hésiter sur le Hip Bump ou le Triangle.',
    'https://assets.mixkit.co/videos/preview/mixkit-wrestlers-training-on-the-mat-42840-large.mp4',
    true, true, 'White', 'closed_guard'
),
(
    'hip_bump',
    'Hip Bump Sweep (Renversement à la hanche)',
    'sweep',
    '["Ouvrir la garde et planter le pied opposé au sol", "Se dresser vigoureusement sur le coude puis la main", "Projeter la hanche en avant vers sa poitrine en bloquant son triceps"]'::jsonb,
    'Si l''adversaire résiste et pose sa main pour stopper le renversement, verrouillez immédiatement la Guillotine ou la Kimura.',
    'https://assets.mixkit.co/videos/preview/mixkit-men-in-sports-uniforms-practicing-martial-arts-42839-large.mp4',
    true, true, 'White', 'closed_guard'
),
(
    'hip_bump_from_kimura',
    'Enchaînement Hip Bump (Depuis Kimura défendue)',
    'sweep',
    '["Puisqu''il plaque son bras vers l''intérieur, utilisez votre prise pour tirer son buste", "Pousser avec les hanches vers le côté dégagé", "Monter directement en position montée (Mount)"]'::jsonb,
    'S''il s''affaisse vers vous, réajustez vos jambes pour la clé de bras (Armbar) en pivotant à 90°.',
    'https://assets.mixkit.co/videos/preview/mixkit-martial-arts-training-in-a-dojo-42841-large.mp4',
    true, true, 'Blue', 'closed_guard'
),
(
    'triangle',
    'Étranglement Triangle (Sankaku-Jime)',
    'submission',
    '["Glisser un bras à l''intérieur et l''autre à l''extérieur (règle du 1 bras dedans, 1 bras dehors)", "Verrouiller le creux poplité sur la cheville", "Pivoter l''angle à 45° et tirer la nuque vers le bas"]'::jsonb,
    'S''il tente de se redresser pour vous écraser (stack), sous-croisez sa jambe extérieure pour couper son angle et balayer.',
    'https://assets.mixkit.co/videos/preview/mixkit-men-in-sports-uniforms-practicing-martial-arts-42839-large.mp4',
    true, true, 'White', 'closed_guard'
),
(
    'omoplata',
    'Omoplata (Clé d''épaule aux jambes)',
    'submission',
    '["Pousser la tête de l''adversaire avec la cuisse", "Pivoter à 180° parallèlement au partenaire", "S''asseoir en avant et contrôler sa taille pour l''empêcher de rouler"]'::jsonb,
    'S''il commence à faire une roulade avant pour s''échapper, suivez la rotation pour monter directement en side control.',
    'https://assets.mixkit.co/videos/preview/mixkit-wrestlers-training-on-the-mat-42840-large.mp4',
    true, true, 'Blue', 'closed_guard'
),
(
    'guillotine',
    'Guillotine Fermée',
    'submission',
    '["Enrouler le menton avec le radius sous la gorge", "Reconnecter les mains (High Elbow ou Palm to Palm)", "Reformer la garde fermée et cambrer le buste"]'::jsonb,
    'S''il saute par-dessus vos hanches en side control, utilisez votre coude pour créer un cadre et récupérer la demi-garde.',
    'https://assets.mixkit.co/videos/preview/mixkit-martial-arts-training-in-a-dojo-42841-large.mp4',
    true, true, 'White', 'closed_guard'
),
(
    'armbar',
    'Clé de Bras Droite (Juji Gatame)',
    'submission',
    '["Contrôler le poignet de l''adversaire contre votre torse avec les deux mains", "Pivoter le bassin pour placer un tibia sur son dos et l''autre jambe par-dessus sa tête", "Serrer les genoux et monter le bassin doucement"]'::jsonb,
    'S''il croise les bras pour défendre (hitchhiker), commutez directement sur l''attaque de poignet ou l''étranglement Triangle.',
    'https://assets.mixkit.co/videos/preview/mixkit-men-in-sports-uniforms-practicing-martial-arts-42839-large.mp4',
    true, true, 'White', 'closed_guard'
),
(
    'ashi_garami',
    'Ashi Garami (Contrôle de jambe)',
    'position',
    '["Pied extérieur sur la hanche adverse", "Jambe intérieure passant sous la cuisse avec talon connecté au creux poplité", "Pincer fortement les genoux pour contrôler la rotation du genou"]'::jsonb,
    'S''il essaie de décoller votre pied de sa hanche, cachez votre pied sous sa cuisse pour passer en 50/50 ou Outside Ashi.',
    'https://assets.mixkit.co/videos/preview/mixkit-martial-arts-training-in-a-dojo-42841-large.mp4',
    false, true, 'Blue', 'ashi_garami'
),
(
    'straight_ankle_lock',
    'Straight Ankle Lock (Clé de cheville droite)',
    'submission',
    '["Caler le tendon d''Achille au niveau de l''os du radius", "Fermer le coude contre ses côtes pour bloquer le pied", "Rouler vers l''épaule extérieure et arquer le dos"]'::jsonb,
    'S''il met sa botte (« putting on the boot ») et avance vers vous, transitionnez vers le Heel Hook extérieur ou relevez-vous pour balayer.',
    'https://assets.mixkit.co/videos/preview/mixkit-wrestlers-training-on-the-mat-42840-large.mp4',
    true, true, 'White', 'ashi_garami'
),
(
    'outside_heel_hook',
    'Outside Heel Hook (Clé de talon extérieure)',
    'submission',
    '["Isoler le talon avec le creux du poignet", "Connecter les mains en Gable grip", "Tourner le buste en bloc vers l''extérieur pour engager la torsion"]'::jsonb,
    'Mouvement à haute vélocité : appliquez une pression contrôlée et relâchez dès le tape.',
    'https://assets.mixkit.co/videos/preview/mixkit-martial-arts-training-in-a-dojo-42841-large.mp4',
    false, true, 'Purple', 'ashi_garami'
),
(
    'half_guard',
    'Demi-Garde avec Underhook (Sous-aisselle)',
    'position',
    '["Ne pas rester à plat dos : se caler sur la hanche inférieure", "Prendre un underhook profond du bras droit", "Verrouiller le triangle de jambes sur sa cheville"]'::jsonb,
    'S''il vous écrase avec un Whizzer puissant, plongez sous ses hanches vers le Deep Half ou le Old School Sweep.',
    'https://assets.mixkit.co/videos/preview/mixkit-men-in-sports-uniforms-practicing-martial-arts-42839-large.mp4',
    true, true, 'Blue', 'half_guard'
),
(
    'dogfight',
    'Position Dogfight',
    'position',
    '["Monter sur les genoux face à face", "Serrer la taille avec l''underhook", "Contrôler la cheville lointaine ou plonger pour le genou"]'::jsonb,
    'S''il contre-attaque avec un Whizzer uchi-mata, plantez votre tête contre ses côtes et crochetez sa jambe pour le faucher.',
    'https://assets.mixkit.co/videos/preview/mixkit-wrestlers-training-on-the-mat-42840-large.mp4',
    true, true, 'Blue', 'half_guard'
),
(
    'back_take',
    'Prise de Dos (Back Take & Hooks)',
    'position',
    '["Glisser sous son aisselle dégagée pour passer derrière", "Insérer les deux crochets (hooks) entre ses cuisses sans croiser les pieds", "Verrouiller le contrôle ceinture de sécurité (Seatbelt)"]'::jsonb,
    'S''il tente de tourner les épaules vers le tapis, gardez votre poitrine collée à son dos et basculez vers l''étranglement arrière (RNC).',
    'https://assets.mixkit.co/videos/preview/mixkit-martial-arts-training-in-a-dojo-42841-large.mp4',
    true, true, 'White', 'half_guard'
);

-- ==========================================================
-- SEED DATA: Transitions (The Tactical Flow Engine)
-- ==========================================================
INSERT INTO transitions (initial_technique_id, opponent_reaction, target_technique_id, tactical_tip) VALUES
-- From Closed Guard
('closed_guard', 'Il pose ses mains sur le tapis', 'kimura', 'Opportunité immédiate sur le bras isolé.'),
('closed_guard', 'Il se redresse fortement pour briser la posture', 'hip_bump', 'Utilisez son élan vers le haut pour le renverser.'),
('closed_guard', 'Il avance un bras pour tenter d''ouvrir vos genoux', 'triangle', 'Règle absolue : 1 bras dedans, 1 bras dehors = Triangle.'),
('closed_guard', 'Il plonge sa tête vers l''avant pour vous écraser', 'guillotine', 'Enserrez le cou dès que sa tête passe au niveau de votre plexus.'),

-- From Kimura Attempt
('kimura', 'Il cache sa main sur sa cuisse / ceinture', 'hip_bump_from_kimura', 'Son bras est bloqué en bas, il n''a plus d''appui latéral.'),
('kimura', 'Il repousse avec son bras libre sur votre visage', 'triangle', 'Son bras défensif franchit votre ligne médiane, glissez la jambe par-dessus.'),
('kimura', 'Il tourne l''épaule vers l''intérieur et esquive la prise', 'omoplata', 'Enroulez votre jambe par-dessus son épaule pour convertir en Omoplata.'),

-- From Hip Bump Sweep
('hip_bump', 'Il pose la main au sol pour bloquer la chute', 'kimura', 'Son bras est en extension complète, isolez son coude.'),
('hip_bump', 'Il baisse la tête pour absorber l''impact', 'guillotine', 'Enroulez la gorge immédiatement avec le bras avant.'),

-- From Triangle
('triangle', 'Il cache son bras ou tente de se redresser violemment', 'armbar', 'Tirez son bras transversalement et étendez vos hanches pour l''Armbar.'),
('triangle', 'Il tourne le dos pour s''extirper', 'omoplata', 'Inversez les jambes et attaquez l''épaule exposée.'),

-- From Ashi Garami System
('ashi_garami', 'Il repousse votre pied de hanche et tente d''avancer', 'straight_ankle_lock', 'Baissez votre coude pour comprimer le tendon d''Achille.'),
('ashi_garami', 'Il tourne sa jambe vers l''extérieur pour dégager le genou', 'outside_heel_hook', 'Expose son talon extérieur, verrouillez la prise en coupe.'),

-- From Half Guard System
('half_guard', 'Il se penche en avant pour bloquer votre hanche', 'dogfight', 'Montez sur vos genoux avec l''underhook profond pour engager le Dogfight.'),
('dogfight', 'Il pousse agressivement avec son Whizzer pour vous aplatir', 'back_take', 'Plongez sous son aisselle dégagée pour lui prendre le dos.');
