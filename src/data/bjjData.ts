import { Technique, TacticalSystem } from '@/types/bjj';

export const INITIAL_TECHNIQUES: Record<string, Technique> = {
  // Required initial seed: closed_guard
  closed_guard: {
    id: "closed_guard",
    name: "Garde Fermée (Dessous)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Garder les chevilles croisées et les genoux actifs",
      "Contrôler les manches ou poignets adverses",
      "Briser la posture avec les genoux ramenés vers soi"
    ],
    troubleshooting: "S'il se lève, ouvrez la garde immédiatement pour suivre ses hanches ou attaquer les jambes.",
    youtube_id: "Z_FBT8ZDSmo",
    video_url: "https://www.youtube.com/embed/Z_FBT8ZDSmo",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il pose ses mains sur le tapis", nextId: "kimura", tacticalTip: "Opportunité d'isolement de l'épaule immédiate" },
      { condition: "Il se redresse fortement", nextId: "hip_bump", tacticalTip: "Exploitez son impulsion montante pour le renverser" },
      { condition: "Il avance un bras pour ouvrir les genoux", nextId: "triangle", tacticalTip: "Règle 1 bras dedans, 1 bras dehors" },
      { condition: "Il plonge sa tête vers l'avant", nextId: "guillotine", tacticalTip: "Enserrez la nuque avec le radius sous le menton" },
      { condition: "Vous êtes à l'intérieur : posture & ouverture", nextId: "standing_guard_break", tacticalTip: "Contrôlez les poignets et dressez-vous en posture haute" }
    ]
  },

  // Required initial seed: kimura
  kimura: {
    id: "kimura",
    name: "Tentative de Kimura",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Décroiser les jambes et s'asseoir en diagonale",
      "Saisir son propre poignet en prise en 4 (figure four)",
      "Plaquer le bras de l'adversaire à 90° et tourner le buste"
    ],
    troubleshooting: "S'il raidit le bras ou cache sa main sous sa cuisse, basculez sans hésiter sur le Hip Bump ou le Triangle.",
    youtube_id: "mVkKOPNGvjA",
    video_url: "https://www.youtube.com/embed/mVkKOPNGvjA",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il cache sa main sur sa cuisse", nextId: "hip_bump_from_kimura", tacticalTip: "Pas d'appui au sol : balayage garanti" },
      { condition: "Il repousse avec son bras libre", nextId: "triangle", tacticalTip: "Le bras défensif traverse l'axe central" },
      { condition: "Il tourne l'épaule vers l'intérieur", nextId: "omoplata", tacticalTip: "Pivotez les hanches à 180° pour l'Omoplata" }
    ]
  },

  // Linked destinations from seed
  hip_bump: {
    id: "hip_bump",
    name: "Hip Bump Sweep (Renversement)",
    category: "Renversement / Balayage",
    category_id: "sweep",
    details: [
      "Ouvrir la garde et planter le pied opposé au sol",
      "Se dresser vigoureusement sur le coude puis sur la paume",
      "Projeter la hanche en avant en verrouillant le coude adverse"
    ],
    troubleshooting: "Si l'adversaire résiste et pose sa main pour stopper le renversement, verrouillez immédiatement la Guillotine ou la Kimura.",
    youtube_id: "YOLCyeCiIc8",
    video_url: "https://www.youtube.com/embed/YOLCyeCiIc8",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il pose la main au sol pour bloquer la chute", nextId: "kimura", tacticalTip: "Le bras est tendu : attaque de Kimura" },
      { condition: "Il baisse la tête pour absorber l'impact", nextId: "guillotine", tacticalTip: "Enroulez la tête pour une Guillotine instantanée" },
      { condition: "Le renversement réussit : vous êtes dessus", nextId: "mount_control", tacticalTip: "Stabilisez les crochets en position montée" }
    ]
  },

  hip_bump_from_kimura: {
    id: "hip_bump_from_kimura",
    name: "Enchaînement Hip Bump (Depuis Kimura)",
    category: "Renversement / Balayage",
    category_id: "sweep",
    details: [
      "Gardez la prise Kimura fermée sur son poignet",
      "Poussez vigoureusement sur vos hanches vers son côté sans appui",
      "Montez directement en position montée avec le contrôle du bras"
    ],
    troubleshooting: "S'il s'affaisse vers vous pour contrer le sweep, basculez en clé de bras (Armbar).",
    youtube_id: "YOLCyeCiIc8",
    video_url: "https://www.youtube.com/embed/YOLCyeCiIc8",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il s'effondre sur le dos : vous montez", nextId: "mount_control", tacticalTip: "Stabilisez 3 secondes pour sécuriser les points" },
      { condition: "Il résiste en poussant fort", nextId: "armbar", tacticalTip: "Pivotez à 90° et passez la jambe sur la tête" }
    ]
  },

  triangle: {
    id: "triangle",
    name: "Étranglement Triangle (Sankaku)",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Glisser un bras à l'intérieur et l'autre à l'extérieur",
      "Verrouiller le creux du genou sur la cheville opposée",
      "Pivoter à 45° pour couper l'artère carotide et tirer la tête"
    ],
    troubleshooting: "S'il tente de se redresser pour vous écraser (stack), sous-croisez sa jambe extérieure pour couper son angle.",
    youtube_id: "5ED_yLiMhyc",
    video_url: "https://www.youtube.com/embed/5ED_yLiMhyc",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il cache son bras ou tente de se redresser violemment", nextId: "armbar", tacticalTip: "Attaque en pince : le bras est déjà prisonnier" },
      { condition: "Il tourne le dos pour sortir la tête", nextId: "omoplata", tacticalTip: "Inversez le triangle et attaquez l'épaule" },
      { condition: "Il s'affaisse et tape au sol", nextId: "closed_guard", tacticalTip: "Victoire par soumission ! Recommencer le drill" }
    ]
  },

  armbar: {
    id: "armbar",
    name: "Clé de Bras Droite (Juji Gatame)",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Contrôler le poignet de l'adversaire contre votre torse avec deux mains",
      "Pivoter le bassin pour placer une jambe sur son dos et l'autre par-dessus sa tête",
      "Serrer fermement les genoux et monter le bassin en douceur"
    ],
    troubleshooting: "S'il croise les mains pour défendre (hitchhiker escape), commutez sur l'Omoplata ou reprenez le Triangle.",
    youtube_id: "ug5Knk1HlsY",
    video_url: "https://www.youtube.com/embed/ug5Knk1HlsY",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il défend en crochetant ses deux mains", nextId: "triangle", tacticalTip: "Repassez la jambe supérieure par-dessus sa nuque" },
      { condition: "Il commence à rouler vers l'avant", nextId: "omoplata", tacticalTip: "Suivez le mouvement et verrouillez l'épaule" }
    ]
  },

  omoplata: {
    id: "omoplata",
    name: "Omoplata (Clé d'épaule)",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Pousser la tête de l'adversaire avec la cuisse",
      "Pivoter à 180° parallèlement au buste adverse",
      "S'asseoir vers l'avant et contrôler sa hanche pour bloquer la roulade"
    ],
    troubleshooting: "S'il commence à faire une roulade avant pour s'échapper, suivez la rotation pour monter directement en side control.",
    youtube_id: "ra0tIjxI2Tc",
    video_url: "https://www.youtube.com/embed/ra0tIjxI2Tc",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il fait une roulade avant pour esquiver", nextId: "side_control", tacticalTip: "Accompagnez sa roulade et stabilisez en 100 kilos" },
      { condition: "Il reste figé à plat ventre", nextId: "closed_guard", tacticalTip: "Montez les hanches et serrez le bras pour finaliser" }
    ]
  },

  guillotine: {
    id: "guillotine",
    name: "Guillotine Fermée",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Enrouler le menton avec le radius fermement calé sous la gorge",
      "Connecter les mains en prise High Elbow ou Paume contre Paume",
      "Reformer la garde fermée avec les jambes et arquer le torse"
    ],
    troubleshooting: "S'il saute par-dessus vos hanches en side control, utilisez votre coude pour créer un cadre et récupérer la demi-garde.",
    youtube_id: "bLBHnMUjoug",
    video_url: "https://www.youtube.com/embed/bLBHnMUjoug",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il saute sur le côté pour contrer l'angle", nextId: "half_guard", tacticalTip: "Récupérez immédiatement une jambe en demi-garde" },
      { condition: "Il tape sur le tapis", nextId: "closed_guard", tacticalTip: "Finalisation propre ! Retour au point de départ" }
    ]
  },

  mount_control: {
    id: "mount_control",
    name: "Position Montée (Mount)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Poser les genoux hauts sous ses aisselles",
      "Baisser le centre de gravité et écraser avec les hanches",
      "Contrôler la tête avec un cross-face puissant"
    ],
    troubleshooting: "S'il ponte vigoureusement (Upa), écartez les mains en appui parachute au sol.",
    youtube_id: "gUf0UsJEZG8",
    video_url: "https://www.youtube.com/embed/gUf0UsJEZG8",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il pousse sur vos genoux avec les deux bras", nextId: "armbar", tacticalTip: "Ses coudes sont étendus : Armbar direct" },
      { condition: "Il se tourne sur le côté pour fuir", nextId: "back_take", tacticalTip: "Prenez le dos et glissez les crochets" }
    ]
  },

  side_control: {
    id: "side_control",
    name: "Contrôle Latéral (100 Kilos)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Poids concentré sur la poitrine adverse",
      "Bras sous la tête en cross-face avec saisie du creux de l'aisselle",
      "Genoux écartés et orteils ancrés au tapis pour une pression maximale"
    ],
    troubleshooting: "S'il insère un genou bouclier (knee shield), repoussez son genou et passez en Nord-Sud.",
    youtube_id: "HuWBCy6GUJw",
    video_url: "https://www.youtube.com/embed/HuWBCy6GUJw",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "closed_guard",
    reactions: [
      { condition: "Il tente de repousser votre tête avec son bras", nextId: "kimura", tacticalTip: "Isolez immédiatement son poignet au sol" },
      { condition: "Il tourne dos à vous pour se relever", nextId: "back_take", tacticalTip: "Glissez vos crochets pour prendre le dos" }
    ]
  },

  // Ashi Garami System
  ashi_garami: {
    id: "ashi_garami",
    name: "Ashi Garami (Contrôle de Jambe)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Pied extérieur connecté sur la hanche de l'adversaire",
      "Jambe intérieure passant sous la cuisse, pied crocheté au creux poplité",
      "Pincer les genoux ensemble pour contrôler la rotation de hanche"
    ],
    troubleshooting: "S'il repousse votre pied de hanche, cachez votre pied sous sa cuisse pour passer en 50/50.",
    youtube_id: "eVaGYMeWeAg",
    video_url: "https://www.youtube.com/embed/eVaGYMeWeAg",
    is_gi: false,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "ashi_garami",
    reactions: [
      { condition: "Il repousse votre pied et avance vers vous", nextId: "straight_ankle_lock", tacticalTip: "Fermez le coude sur le tendon d'Achille" },
      { condition: "Il tourne sa jambe vers l'extérieur pour dégager", nextId: "outside_heel_hook", tacticalTip: "Le talon extérieur est offert en coupe" },
      { condition: "Vous devez vous défendre : mettre la botte & dégager le genou", nextId: "leg_lock_defense", tacticalTip: "Mettez la botte immédiatement et poussez le pied de hanche" }
    ]
  },

  straight_ankle_lock: {
    id: "straight_ankle_lock",
    name: "Straight Ankle Lock (Clé de Cheville)",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Placer le tendon d'Achille directement sur l'arête du radius",
      "Serrer le coude contre les côtes pour éliminer le jeu",
      "Regarder par-dessus l'épaule et cambrer le buste en arrière"
    ],
    troubleshooting: "S'il pousse sur vos hanches pour s'extirper, resserrez la pince des genoux et étendez le bassin.",
    youtube_id: "1UShYzZtG_8",
    video_url: "https://www.youtube.com/embed/1UShYzZtG_8",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "ashi_garami",
    reactions: [
      { condition: "Il met « la botte » et pousse pour monter", nextId: "outside_heel_hook", tacticalTip: "Son talon se décolle du tapis : expose le Heel Hook" },
      { condition: "Il tape sur le tapis", nextId: "ashi_garami", tacticalTip: "Soumission validée !" }
    ]
  },

  outside_heel_hook: {
    id: "outside_heel_hook",
    name: "Outside Heel Hook (Clé de Talon)",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Isoler le calcanéum (talon) avec le creux du poignet",
      "Connecter les mains en prise Gable (paume à plat)",
      "Effectuer une rotation du torse en bloc sans forcer sur les bras"
    ],
    troubleshooting: "Attention en sparring : soumission dévastatrice pour les ligaments croisés, relâcher dès le premier signe de tape.",
    youtube_id: "hNTsYUShvLU",
    video_url: "https://www.youtube.com/embed/hNTsYUShvLU",
    is_gi: false,
    is_nogi: true,
    belt_level: "Purple",
    system_tag: "ashi_garami",
    reactions: [
      { condition: "L'adversaire tape instantanément", nextId: "ashi_garami", tacticalTip: "Soumission dévastatrice !" }
    ]
  },

  // Half Guard System
  half_guard: {
    id: "half_guard",
    name: "Demi-Garde Underhook",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Se caler fermement sur la hanche inférieure (pas à plat dos)",
      "Glisser un underhook (sous-aisselle) profond du bras supérieur",
      "Verrouiller le triangle de jambes sur la cheville adverse"
    ],
    troubleshooting: "S'il vous écrase avec un Whizzer lourd, plongez sous son centre de gravité vers le Deep Half.",
    youtube_id: "clA_-Uf6DGQ",
    video_url: "https://www.youtube.com/embed/clA_-Uf6DGQ",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "half_guard",
    reactions: [
      { condition: "Il se penche en avant pour bloquer la hanche", nextId: "dogfight", tacticalTip: "Montez vigoureusement sur les genoux" },
      { condition: "Il recule pour créer de l'espace", nextId: "closed_guard", tacticalTip: "Ramenez vos jambes pour fermer la garde" },
      { condition: "Vous êtes au-dessus : fendre la demi-garde", nextId: "knee_cut_pass", tacticalTip: "Underhook profond et glissade de genou (Knee Cut)" }
    ]
  },

  dogfight: {
    id: "dogfight",
    name: "Position Dogfight",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Monter sur les genoux face à face en maintenant l'underhook",
      "Enrouler la taille adverse avec fermeté",
      "Contrôler la cheville lointaine ou faucher le genou d'appui"
    ],
    troubleshooting: "S'il tente un fauchage Whizzer, plantez votre tête contre ses côtes pour stabiliser votre équilibre.",
    youtube_id: "x79IOGhUk_k",
    video_url: "https://www.youtube.com/embed/x79IOGhUk_k",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "half_guard",
    reactions: [
      { condition: "Il pousse avec son Whizzer pour vous aplatir", nextId: "back_take", tacticalTip: "Glissez sous son aisselle pour prendre le dos" },
      { condition: "Il lève le genou pour fuir", nextId: "mount_control", tacticalTip: "Balayez la cheville pour passer dessus" }
    ]
  },

  back_take: {
    id: "back_take",
    name: "Prise de Dos (Back Control)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Insérer les deux crochets intérieurs entre les cuisses sans croiser les chevilles",
      "Verrouiller le harnais de sécurité (Seatbelt grip : 1 bras dessus, 1 dessous)",
      "Garder la poitrine collée à ses omoplates"
    ],
    troubleshooting: "S'il tente de tourner les épaules vers le tapis, gardez le contact thorax-dos et verrouillez le RNC.",
    youtube_id: "9AzPWS7rsE0",
    video_url: "https://www.youtube.com/embed/9AzPWS7rsE0",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "half_guard",
    reactions: [
      { condition: "Il laisse son cou exposé en défendant les crochets", nextId: "closed_guard", tacticalTip: "Verrouillez l'étranglement arrière (RNC)" },
      { condition: "Il tourne ses épaules vers le tapis", nextId: "mount_control", tacticalTip: "Basculez directement en position montée" }
    ]
  },

  // De La Riva System Techniques
  delariva_guard: {
    id: "delariva_guard",
    name: "Garde De La Riva (DLR)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Enrouler la cuisse adverse avec le crochet extérieur au creux poplité",
      "Verrouiller le talon ou la cheville avec la main du même côté",
      "Pousser sur la hanche ou cuisse opposée avec le pied libre pour contrôler la distance"
    ],
    troubleshooting: "S'il tourne son genou vers l'intérieur pour écraser le crochet (Knee Cut), poussez son autre jambe et partez en Tripod Sweep.",
    youtube_id: "3cg65KuEipo",
    video_url: "https://www.youtube.com/embed/3cg65KuEipo",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "delariva",
    reactions: [
      { condition: "Il avance le genou pour couper la garde (Knee Cut)", nextId: "dlr_tripod_sweep", tacticalTip: "Poussez la hanche et tirez la cheville" },
      { condition: "Il s'assied lourdement en arrière pour casser le crochet", nextId: "berimbolo", tacticalTip: "Inverser sous son centre de gravité" },
      { condition: "Il tend les bras pour attraper votre col", nextId: "triangle", tacticalTip: "Projetez vos jambes vers son cou" },
      { condition: "Vous êtes debout : désamorcer le crochet De La Riva", nextId: "dlr_hook_kill", tacticalTip: "Pivotez la pointe de pied et poussez le genou" }
    ]
  },

  dlr_tripod_sweep: {
    id: "dlr_tripod_sweep",
    name: "Balayage Tripod / Sickle Sweep",
    category: "Renversement / Balayage",
    category_id: "sweep",
    details: [
      "Placer la plante du pied sur sa hanche opposée",
      "Faucher derrière son tendon d'Achille avec la seconde jambe",
      "Tirer fermement la manche et la cheville simultanément"
    ],
    troubleshooting: "S'il résiste en avançant, changez d'angle pour attaquer la jambe en Ashi Garami.",
    youtube_id: "zbo39TwFa2Y",
    video_url: "https://www.youtube.com/embed/zbo39TwFa2Y",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "delariva",
    reactions: [
      { condition: "L'adversaire s'effondre au sol : vous vous levez", nextId: "mount_control", tacticalTip: "Passez dessus et sécurisez la position montée" },
      { condition: "Il s'appuie sur une main en chutant", nextId: "armbar", tacticalTip: "Attaquez le bras isolé tendu" }
    ]
  },

  berimbolo: {
    id: "berimbolo",
    name: "Inversion Berimbolo",
    category: "Renversement / Balayage",
    category_id: "sweep",
    details: [
      "Saisir la ceinture ou l'arrière du pantalon",
      "Effectuer une rotation sur les épaules en passant sous ses hanches",
      "Pousser l'arrière de son genou pour le faire tourner dos à vous"
    ],
    troubleshooting: "Gardez les hanches hautes et les abdominaux gainés pour ne pas subir son écrasement.",
    youtube_id: "PAf2iCezKzY",
    video_url: "https://www.youtube.com/embed/PAf2iCezKzY",
    is_gi: true,
    is_nogi: true,
    belt_level: "Purple",
    system_tag: "delariva",
    reactions: [
      { condition: "Vous émergez derrière son bassin", nextId: "crab_ride", tacticalTip: "Double crochets aux genoux (Crab Ride)" },
      { condition: "Il tourne vers vous pour faire face", nextId: "mount_control", tacticalTip: "Basculez en Leg Drag vers la montée" }
    ]
  },

  crab_ride: {
    id: "crab_ride",
    name: "Position Crab Ride (Contrôle Bassin)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Placer les pieds derrière les deux genoux adverses",
      "Contrôler la ceinture ou les deux hanches à deux mains",
      "Étirer les jambes pour l'empêcher de poser les pieds au sol"
    ],
    troubleshooting: "Si l'adversaire tente de rouler en avant, suivez avec le haut du torse pour plaquer le dos.",
    youtube_id: "q1Y4x_EUZtY",
    video_url: "https://www.youtube.com/embed/q1Y4x_EUZtY",
    is_gi: true,
    is_nogi: true,
    belt_level: "Purple",
    system_tag: "delariva",
    reactions: [
      { condition: "Ses hanches sont exposées", nextId: "back_take", tacticalTip: "Insérez les crochets supérieurs pour le dos complet" },
      { condition: "Il bascule sur le ventre", nextId: "mount_control", tacticalTip: "Plaquez les hanches en montée" }
    ]
  },

  // Butterfly Guard System Techniques
  butterfly_guard: {
    id: "butterfly_guard",
    name: "Garde Papillon (Butterfly Guard)",
    category: "Position Initiale",
    category_id: "position",
    details: [
      "Insérer les deux crochets sous les cuisses, orteils pointés vers le haut",
      "Garder le dos arrondi et la tête collée sous le menton adverse",
      "Obtenir un Overhook (au-dessus du bras) ou contrôle ceinture"
    ],
    troubleshooting: "Ne restez jamais à plat dos ! Soyez toujours assis sur les fesses, prêt à basculer sur une hanche.",
    youtube_id: "HOSTU-Rq918",
    video_url: "https://www.youtube.com/embed/HOSTU-Rq918",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "butterfly",
    reactions: [
      { condition: "Il met son poids vers l'avant pour vous aplatir", nextId: "butterfly_sweep", tacticalTip: "Basculez sur la hanche et élevez le crochet" },
      { condition: "Il baisse la tête pour contrer le balayage", nextId: "marcelo_guillotine", tacticalTip: "Enserrez le cou en High-Elbow Guillotine" },
      { condition: "Il recule ses fesses pour désamorcer les crochets", nextId: "arm_drag", tacticalTip: "Tirez le bras en deux contre un" },
      { condition: "Vous êtes au-dessus : écraser la garde papillon", nextId: "butterfly_over_under", tacticalTip: "Verrouillez l'Over-Under et marchez en diagonale" }
    ]
  },

  butterfly_sweep: {
    id: "butterfly_sweep",
    name: "Balayage Papillon (Hook Sweep)",
    category: "Renversement / Balayage",
    category_id: "sweep",
    details: [
      "Tomber sur l'épaule latérale (jamais en arrière)",
      "Élever vigoureusement la cuisse adverse avec le crochet actif",
      "Piéger son bras d'appui avec l'overhook"
    ],
    troubleshooting: "S'il parvient à poser sa main libre au sol, pivotez sous lui pour reprendre la demi-garde ou le dos.",
    youtube_id: "ytv0Wf34Xe0",
    video_url: "https://www.youtube.com/embed/ytv0Wf34Xe0",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "butterfly",
    reactions: [
      { condition: "L'adversaire est projeté par-dessus : vous montez", nextId: "mount_control", tacticalTip: "Stabilisez immédiatement la position montée" },
      { condition: "Il pose le coude opposé pour freiner la chute", nextId: "triangle", tacticalTip: "Passez la jambe supérieure par-dessus sa nuque" }
    ]
  },

  marcelo_guillotine: {
    id: "marcelo_guillotine",
    name: "High-Elbow Guillotine (Marcelo Garcia)",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Enrouler le cou avec le radius placé directement sous la trachée",
      "Lever le coude d'attaque très haut au-dessus de son épaule",
      "Fermer la garde papillon ou complète et cambrer le buste"
    ],
    troubleshooting: "Ne serrez pas seulement avec les bras : rapprochez vos hanches de sa tête pour maximiser la compression.",
    youtube_id: "cJuld_NEZUw",
    video_url: "https://www.youtube.com/embed/cJuld_NEZUw",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "butterfly",
    reactions: [
      { condition: "L'adversaire tape instantanément", nextId: "butterfly_guard", tacticalTip: "Victoire par Guillotine !" },
      { condition: "Il tourne son corps pour sauter sur le côté", nextId: "anaconda_choke", tacticalTip: "Roulade et verrouillage en Anaconda" }
    ]
  },

  arm_drag: {
    id: "arm_drag",
    name: "Arm Drag vers le Dos",
    category: "Renversement / Balayage",
    category_id: "sweep",
    details: [
      "Saisir le poignet opposé et triceps à deux mains (2-on-1)",
      "Tirer le bras adverse en diagonale à travers votre ligne centrale",
      "Plonger votre poitrine directement contre son épaule / dos"
    ],
    troubleshooting: "Bougez vos hanches vers son dos au lieu de simplement essayer de tirer tout son poids vers vous.",
    youtube_id: "e_c7G5T_ZR8",
    video_url: "https://www.youtube.com/embed/e_c7G5T_ZR8",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "butterfly",
    reactions: [
      { condition: "Vous atteignez son dos", nextId: "back_take", tacticalTip: "Glissez les crochets pour finaliser le contrôle du dos" },
      { condition: "Il résiste en reculant violemment", nextId: "butterfly_sweep", tacticalTip: "Son poids part en arrière : renversez-le" }
    ]
  },

  anaconda_choke: {
    id: "anaconda_choke",
    name: "Étranglement Anaconda",
    category: "Attaque / Soumission",
    category_id: "submission",
    details: [
      "Passer le bras sous la gorge puis sous l'aisselle adverse",
      "Verrouiller le biceps comme un étranglement arrière inversé",
      "Effectuer une roulade alligator pour le plaquer sur le flanc"
    ],
    troubleshooting: "Marchez vos hanches vers ses jambes pour réduire l'espace et comprimer les carotides.",
    youtube_id: "l2OyTTLG2a0",
    video_url: "https://www.youtube.com/embed/l2OyTTLG2a0",
    is_gi: true,
    is_nogi: true,
    belt_level: "Purple",
    system_tag: "butterfly",
    reactions: [
      { condition: "L'adversaire tape sur le flanc", nextId: "butterfly_guard", tacticalTip: "Soumission par étranglement Anaconda !" },
      { condition: "Il réussit à tourner le torse", nextId: "mount_control", tacticalTip: "Basculez sur lui en montée" }
    ]
  },

  // Guard Escapes & Defense System Techniques
  standing_guard_break: {
    id: "standing_guard_break",
    name: "Ouverture Debout de Garde Fermée",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Contrôler fermement le poignet adverse et le plaquer contre votre propre sternum",
      "Bloquer le même côté avec votre genou et vous lever avec la jambe opposée",
      "Se redresser en posture droite (épaules alignées au-dessus du bassin) et faire levier sur la hanche"
    ],
    troubleshooting: "Ne vous penchez jamais en avant en vous levant ! Gardez le menton haut et le dos droit pour éviter le triangle ou la guillotine.",
    youtube_id: "OYtXEqRmtCU",
    video_url: "https://www.youtube.com/embed/OYtXEqRmtCU",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "La garde s'ouvre : vous engagez le genou", nextId: "knee_cut_pass", tacticalTip: "Fendez la garde en glissade de genou (Knee Cut)" },
      { condition: "Il attrape vos chevilles pour renverser", nextId: "closed_guard_roger_break", tacticalTip: "Basculez sur l'ouverture basse au sol" }
    ]
  },

  closed_guard_roger_break: {
    id: "closed_guard_roger_break",
    name: "Ouverture au Sol (Genou au Coccyx - Roger Gracie)",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Casser toutes les prises de col et verrouiller les deux hanches adverses au sol",
      "Insérer le genou au centre exact du coccyx adverse en reculant les hanches",
      "Ouvrir l'autre jambe à 45° et arquer le dos pour faire éclater le cadenas de chevilles"
    ],
    troubleshooting: "Gardez les coudes rentrés contre vos cuisses pour interdire toute tentative d'Omoplata ou de Triangle.",
    youtube_id: "_FQEBE_y5gM",
    video_url: "https://www.youtube.com/embed/_FQEBE_y5gM",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "Les chevilles lâchent : vous fendez la garde", nextId: "knee_cut_pass", tacticalTip: "Glissez le genou en travers de sa cuisse" },
      { condition: "Il s'assied pour vous suivre", nextId: "smash_pass", tacticalTip: "Écrasez ses deux genoux d'un côté (Smash Pass)" }
    ]
  },

  knee_cut_pass: {
    id: "knee_cut_pass",
    name: "Passage Knee Cut (Glissade de Genou)",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Glisser un Underhook profond sous l'aisselle adverse",
      "Appliquer un Crossface puissant avec l'autre bras pour tourner sa tête",
      "Fendre sa cuisse avec le tranchant de votre genou et glisser la hanche au tapis"
    ],
    troubleshooting: "Si son genou bouclier (Knee Shield) bloque votre passage, commutez immédiatement sur le Smash Pass.",
    youtube_id: "lOPh9K5kOcE",
    video_url: "https://www.youtube.com/embed/lOPh9K5kOcE",
    is_gi: true,
    is_nogi: true,
    belt_level: "White",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "Le passage est finalisé", nextId: "side_control", tacticalTip: "Stabilisez les 100 kilos et bloquez sa hanche" },
      { condition: "Il bloque la cheville en quart de garde", nextId: "smash_pass", tacticalTip: "Plaquez ses genoux ensemble et écrasez" }
    ]
  },

  smash_pass: {
    id: "smash_pass",
    name: "Smash Pass (Écrasement de Garde)",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Replier les deux genoux de l'adversaire du même côté",
      "Peser avec votre poitrine sur sa cuisse supérieure pour verrouiller son bassin",
      "Enrouler sa tête ou son épaule opposée et passer en contrôle latéral"
    ],
    troubleshooting: "Ne le laissez pas tourner sur le ventre : contrôlez le col et le pantalon pour maintenir son dos au sol.",
    youtube_id: "HnAxQkRKP80",
    video_url: "https://www.youtube.com/embed/HnAxQkRKP80",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "L'adversaire est totalement aplati", nextId: "side_control", tacticalTip: "Sécurisez les 100 kilos avec pression de thorax" },
      { condition: "Il tente de tourner le dos pour fuir", nextId: "back_take", tacticalTip: "Glissez les crochets pour prendre le dos" }
    ]
  },

  dlr_hook_kill: {
    id: "dlr_hook_kill",
    name: "Sortie & Casse du Crochet De La Riva",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Pivoter le genou et la pointe du pied vers l'extérieur pour casser l'angle",
      "Pousser fermement sur l'intérieur du genou adverse avec votre paume",
      "Reculer la jambe piégée pour désengager le pied du creux poplité"
    ],
    troubleshooting: "Ne restez jamais statique avec les pieds parallèles ! Adoptez une posture en fente basse avec base stable.",
    youtube_id: "gSl-e634LUE",
    video_url: "https://www.youtube.com/embed/gSl-e634LUE",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "Le crochet est libéré", nextId: "knee_cut_pass", tacticalTip: "Engagez la glissade de genou directe" },
      { condition: "Il tente d'inverser en Berimbolo", nextId: "smash_pass", tacticalTip: "Faites un backstep lourd pour écraser ses hanches" }
    ]
  },

  butterfly_over_under: {
    id: "butterfly_over_under",
    name: "Passage Over-Under (Anti-Papillon)",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Passer un bras par-dessus une cuisse et l'autre bras sous la seconde cuisse",
      "Verrouiller le creux de la jambe inférieure et coller l'épaule sur son sternum",
      "Marcher sur la pointe des pieds en diagonale pour extraire vos jambes"
    ],
    troubleshooting: "Plantez fermement votre tête du côté du bras overhook pour neutraliser toute tentative de guillotine.",
    youtube_id: "F4aSM8beVHo",
    video_url: "https://www.youtube.com/embed/F4aSM8beVHo",
    is_gi: true,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "La garde s'ouvre sous la pression", nextId: "side_control", tacticalTip: "Contournez les hanches pour les 100 kilos" },
      { condition: "Il tente de repousser la tête", nextId: "mount_control", tacticalTip: "Glissez le genou intérieur pour monter" }
    ]
  },

  leg_lock_defense: {
    id: "leg_lock_defense",
    name: "Défense & Sortie d'Ashi Garami (Anti-Leg Lock)",
    category: "Sortie de Garde / Défense",
    category_id: "pass",
    details: [
      "Enfiler « La Botte » immédiatement : flexion dorsale maximale de la cheville",
      "Pousser à deux mains sur le pied adverse connecté à votre hanche",
      "Faire glisser le genou au-delà de sa ligne de hanches (Clear the Knee Line)"
    ],
    troubleshooting: "Agissez dès la première seconde ! Si la ligne du genou est dépassée, il est trop tard pour défendre sans rouler.",
    youtube_id: "5ZAqUQpsus8",
    video_url: "https://www.youtube.com/embed/5ZAqUQpsus8",
    is_gi: false,
    is_nogi: true,
    belt_level: "Blue",
    system_tag: "guard_escapes",
    reactions: [
      { condition: "Le genou est dégagé : vous avancez", nextId: "knee_cut_pass", tacticalTip: "Montez en contre-attaque sur ses hanches" },
      { condition: "Il persiste sur la cheville sans contrôle", nextId: "mount_control", tacticalTip: "Passez dessus et sécurisez la position montée" }
    ]
  }
};

export const TACTICAL_SYSTEMS: TacticalSystem[] = [
  {
    id: "guard_escapes_system",
    name: "Sorties de Garde & Défense",
    rootTechniqueId: "standing_guard_break",
    description: "Le répertoire complet de survie et d'évasion : ouvertures debout et au sol, Knee Cut, Smash Pass, neutralisation De La Riva, Over-Under et défenses de clés de jambe.",
    category: "Défense & Sorties",
    is_gi: true,
    is_nogi: true,
    difficulty: "Débutant",
    belt_level: "White",
    nodeCount: 7,
    featuredBadge: "Guide de Survie",
    iconName: "ShieldCheck"
  },
  {
    id: "closed_guard_system",
    name: "Système Garde Fermée",
    rootTechniqueId: "closed_guard",
    description: "Le système maître classique : enchaînements Kimura, Hip Bump, Triangle et Armbar.",
    category: "Fondamental",
    is_gi: true,
    is_nogi: true,
    difficulty: "Débutant",
    belt_level: "White",
    nodeCount: 8,
    featuredBadge: "Système Recommandé",
    iconName: "Shield"
  },
  {
    id: "delariva_system",
    name: "Système De La Riva & Berimbolo",
    rootTechniqueId: "delariva_guard",
    description: "L'art moderne de la garde ouverte : Tripod Sweeps déstabilisants et inversions Berimbolo vers le dos.",
    category: "Garde Ouverte & Dos",
    is_gi: true,
    is_nogi: true,
    difficulty: "Avancé",
    belt_level: "Purple",
    nodeCount: 6,
    featuredBadge: "Moderne & Fluide",
    iconName: "Zap"
  },
  {
    id: "butterfly_system",
    name: "Système Garde Papillon & Guillotine",
    rootTechniqueId: "butterfly_guard",
    description: "Le jeu offensif sans kimono par excellence : Hook Sweeps puissants, Arm Drags et Guillotines éclair.",
    category: "Attaque Dynamique",
    is_gi: true,
    is_nogi: true,
    difficulty: "Intermédiaire",
    belt_level: "Blue",
    nodeCount: 5,
    featuredBadge: "Signature No-Gi",
    iconName: "Crosshair"
  },
  {
    id: "ashi_garami_system",
    name: "Système Ashi Garami",
    rootTechniqueId: "ashi_garami",
    description: "Le système moderne de clé de jambe : Straight Ankle Locks et Heel Hooks dévastateurs.",
    category: "Attaques Basses",
    is_gi: false,
    is_nogi: true,
    difficulty: "Intermédiaire",
    belt_level: "Blue",
    nodeCount: 4,
    featuredBadge: "No-Gi Modern",
    iconName: "Zap"
  },
  {
    id: "half_guard_system",
    name: "Système Demi-Garde & Underhook",
    rootTechniqueId: "half_guard",
    description: "L'art de la remontée offensive : Dogfight, fauchages et prises de dos imparables.",
    category: "Balayages & Dos",
    is_gi: true,
    is_nogi: true,
    difficulty: "Intermédiaire",
    belt_level: "Blue",
    nodeCount: 5,
    featuredBadge: "Contre-Offensif",
    iconName: "Crosshair"
  }
];
