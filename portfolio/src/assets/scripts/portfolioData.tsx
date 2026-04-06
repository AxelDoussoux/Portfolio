import { 
  Gamepad2, 
  Palette, 
  Coffee, 
  Zap, 
  Atom, 
  GitBranch, 
  Globe,
  Layers,
  Video,
  FileX,
  Music,
  Blocks,
  Brush,
  Waves,
  LayoutTemplate,
  HashIcon
} from 'lucide-react';

// Configuration du portfolio

const PORTFOLIO_CONFIG = {
  name: "Axel DOUSSOUX",
  title: "Développeur Web Fullstack & Artiste 3D",
  avatar: "/images/pp_min.png",
  email: "contact@axeldoussoux.fr",
  github: "https://github.com/AxelDoussoux",
  linkedin: "https://www.linkedin.com/in/axeldoussoux/",
  instagram: "https://www.instagram.com/axel_in_the_pict/",
  cvVideo: "https://youtu.be/uiMLm_isuGs",
  bio: "Développeur web fullstack passionné, je conçois des expériences interactives du front-end au back-end, avec une spécialisation en UX Design et interface utilisateur.",
  
  skills: [
    { name: "TypeScript", icon: Zap, category: "Développement Web" },
    { name: "React", icon: Atom, category: "Développement Web" },
    { name: "TailWindCSS", icon: Waves, category: "Développement Web" },
    { name: "Java", icon: Coffee, category: "Programmation" },
    { name: "C#", icon: HashIcon, category: "Programmation" },
    { name: "Git", icon: GitBranch, category: "Contrôle de Versions" },
    { name: "Figma", icon: LayoutTemplate, category: "Design UI/UX" },
    { name: "Pixi.js", icon: FileX, category: "Web 2D" },
    { name: "Three.js", icon: Globe, category: "Web 3D" },
    { name: "Unity", icon: Gamepad2, category: "Moteur de Jeu" },
    { name: "Blender", icon: Palette, category: "Modélisation 3D" },
    { name: "Aseprite", icon: Blocks, category: "Art 2D" },
    { name: "Krita", icon: Brush, category: "Art 2D" },
    { name: "Adobe Suite", icon: Layers, category: "Création de Contenus" },
    { name: "DaVinci Resolve", icon: Video, category: "Création de Contenus" },
    { name: "FL Studio", icon: Music, category: "Production Musicale" },
  ],
  
  projects: [
    {
    id: 1,
    title: "Dream Bounds",
    description: "Jeu de plateforme 3D réalisé sur Unity avec composante multijoueur en ligne grâce à Netcode. Ce projet a été réalisé avec 2 autres personnes dans le cadre d'une SAE (Projet Universitaire) du 5ème semestre de mon BUT Métiers du Multimédia et de l'Internet.",
    image: "/images/Unity_1.png",
    video: "https://www.youtube.com/watch?v=VhiG8OI3nHk",
    technologies: ["Unity", "C#", "Blender", "FL Studio", "Netcode", "Shader Graph", "UI Toolkit", "Git"],
    demo: "https://drive.google.com/file/d/1DTC4VNG4U5xpOxZLhQES8vPdiv1EethW/view?usp=sharing",
    featured: true,
    year: "2024-2025",
    duration: "5 mois",
    type: "Projet universitaire / SAE",
    status: "Terminé",
    features: [
      "Multijoueur en ligne avec relations Client-Serveur Netcode",
      "3 niveaux de jeu avec environnements variés",
      "Modélisation 3D et animations personnalisées sur Blender",
      "Musique dynamique composée avec FL Studio",
      "Optimisation graphiques et shader-graph personnalisés",
      "Interface utilisateur intuitive avec UI-Toolkit"
    ],
    challenges: "La gestion de la synchronisation des états entre les clients et le serveur a été un défi majeur. J'ai dû implémenter des systèmes de réplication d'état et de gestion des collisions pour assurer une expérience fluide. De plus, l'optimisation des performances graphiques pour maintenir un framerate stable sur différents appareils a nécessité une attention particulière."
  },
  {
    id: 2,
    title: "Génération de terrain procédural sur Unity",
    description: "Génération procédurale de terrain sur Unity avec un système de grille et de tiles pour créer des mondes vastes et variés. Réalisé dans le cadre d'un stage d'apprentissage chez BDCRAFT.",
    image: "/images/Unity_2.png",
    video: "/videos/Unity_2.mp4",
    technologies: ["Unity",  "C#", "ScriptableObjects", "Git"],
    featured: true, 
    year: "2025",
    duration: "1 mois",
    type: "Projet professionnel / BDCRAFT",
    status: "En production",
    features: [
      "Génération procédurale de terrain",
      "Système de grille pour la gestion des tiles",
      "Intégration de ScriptableObjects pour la configuration des tiles",
      "Support pour la génération de ressources et d'objets interactifs"
    ],
    challenges: "La principale difficulté a été de concevoir un algorithme efficace pour générer des terrains variés tout en maintenant une performance optimale. J'ai dû expérimenter avec différents algorithmes de génération procédurale pour trouver le bon équilibre entre diversité et performance. De plus, l'intégration avec les systèmes de gameplay existants a nécessité une planification minutieuse pour éviter les conflits."
  },
  {
    id: 3,
    title: "Motion design pour MOBIVIE",
    description: "Réalisation d'un motion design pour la promotion des services de location de vélo Vivélo de MOBIVIE, incluant la création et l'animation des visuels sur Illustrator et After Effect avec le plugin Limber 2.",
    image: "/images/mobivie.png",
    video: "/videos/mobivie.mp4",
    technologies: ["After Effect", "Illustrator", "Limber 2"],
    featured: true,
    year: "2024",
    duration: "2 mois",
    type: "Projet professionnel / MOBIVIE",
    status: "Terminé",
    features: [
      "Création de visuels animés pour la promotion des services de location de vélo",
      "Utilisation du plugin Limber 2 pour l'animation des personnages",
      "Intégration de la charte graphique de MOBIVIE",
      "Production d'une vidéo promotionnelle pour les panneaux d'affichage publics et les réseaux sociaux"
    ],
    challenges: "La principale difficulté a été de respecter la charte graphique de MOBIVIE tout en créant des animations dynamiques et engageantes. J'ai dû travailler en étroite collaboration avec l'équipe de communication pour m'assurer que les animations reflètent correctement l'image de marque. De plus, l'animation devait tenir sur une durée de moins de 10 secondes à cause des contraintes techniques des panneaux d'affichages de Vichy Communauté."
  },
  {
    id: 4,
    title: "Modélisation scène 3D",
    description: "Scène 3D réalisée sur Blender, mettant en avant mes compétences en modélisation, mise en scène, texturing et shading-procedural. Réalisé dans le cadre de la formation BUT Métiers du Multimédia et de l'Internet.",
    image: "/images/blender_1.png",
    technologies: ["Blender", "Cycles", "Shading procédural", "Texturing"],
    featured: false,
    year: "2025",
  },
  {
    id: 5,
    title: "Test shading Blender",
    description: "Test de shaders procéduraux et de rendu Cycles sur Blender.",
    image: "/images/blender_2.png",
    video: "/videos/blender_2.mp4", 
    technologies: ["Blender", "Cycles", "Shading procédural"],
    featured: false,
    year: "2025",
  },
  {
    id: 6,
    title: "Rick en T-Pose",
    description: "Modélisation, rigging et animation d'un personnage principal de Rick et Morty sur Blender.",
    image: "/images/blender_3.png",
    technologies: ["Blender", "Rigging", "Animation"],
    featured: false,
    year: "2024",
  }
  ],

  experiences: [
    {
      id: 1,
      role: "Développeur Web",
      company: "MusicBrainTraining Company",
      logo: "/images/MBTC_logo.png",
      period: "Mars - Mai 2025",
      description: "Migration de l'architecture graphique du site en CSS vers une architecture Pixi.js, avec intégration de fonctionnalités interactives.",
      technologies: ["TypeScript", "React", "Pixi.js", "Git"],
      achievements: [
        "Migration de l'architecture graphique",
        "Optimisation des performances sur mobile et tablette",
        "Documentation complète du processus"
      ]
    },
    {
    id: 2,
      role: "Assistant Développeur de Jeux Vidéo",
      company: "BD CRAFT",
      logo: "/images/bdcraft_logo.png",
      period: "Mai - Juillet 2025",
      description: "Aide au développement d'un jeu vidéo indie multijoueur utilisant Unity et C#.",
      technologies: ["Unity", "C#", "Blender", "Git", "Game Design Document", ],
      achievements: [
        "Narration et dialogue pour les personnages",
        "Modélisation d'assets 3D et animations",
        "Création d'un monde procédural avec un système de grille et de tiles pour la génération de terrain"
      ]
    },
    {
      id: 3,
      role: "Concepteur de supports de communication",
      company: "MOBIVIE - Transdev Vichy",
      logo: "/images/mobivie_logo.png",
      period: "Janvier - Mars 2024",
      description: "Concepteur de support de communication pour la promotion des services de transport public de la communauté de commune de Vichy, incluant la création de visuels et de vidéos.",
      technologies: ["Suite Adobe", "DaVinci Resolve", "Captation photo et vidéo"],
      achievements: [
        "Conception d'affiches et flyers",
        "Publicité en Motion Design",
        "Production de publicité vidéo pour les réseaux sociaux"
      ]
    }
  ],

  instagramPosts: [
    {
      id: 1,
      embedUrl: "https://www.instagram.com/p/DDFbY24tAvz/embed/",
      link: "https://www.instagram.com/p/DDFbY24tAvz/"
    },
    {
      id: 2,
      embedUrl: "https://www.instagram.com/p/DCf1LgovgeC/embed/",
      link: "https://www.instagram.com/p/DCf1LgovgeC/"
    },
    {
      id: 3,
      embedUrl: "https://www.instagram.com/p/DA3TZ6UPefm/embed/",
      link: "https://www.instagram.com/p/DA3TZ6UPefm/"
    },
    {
      id: 4,
      embedUrl: "https://www.instagram.com/p/Ct145ebIogT/embed/",
      link: "https://www.instagram.com/p/Ct145ebIogT/"
    },
    {
      id: 5,
      embedUrl: "https://www.instagram.com/p/Ctu7kkmoPWX/embed/",
      link: "https://www.instagram.com/p/Ctu7kkmoPWX/"
    },
    {
      id: 6,
      embedUrl: "https://www.instagram.com/p/C1E997AtDca/embed/",
      link: "https://www.instagram.com/p/C1E997AtDca/"
    }
  ]

};

export default PORTFOLIO_CONFIG;